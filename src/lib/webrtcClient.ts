import { RTC_CONFIG } from './webrtcConfig';

export type GameMessageType = 'move' | 'start_game' | 'game_over' | 'chat';

export type GameMessage = { type: GameMessageType; payload: unknown; timestamp: number };

type SignalPayload = 'offer' | 'answer' | 'ice';

type ConnectionChangeHandler = (state: RTCPeerConnectionState) => void;

type MessageHandler = (message: GameMessage) => void;

export class WebRTCGameClient {
    private peerConnection: RTCPeerConnection | null = null;
    private dataChannel: RTCDataChannel | null = null;
    private onMessageCallback: MessageHandler | null = null;
    private onConnectionStateChange: ConnectionChangeHandler | null = null;
    private lastSignalTimestamp = 0;
    private polling = false;

    constructor(
        private readonly gameId: string,
        private readonly playerId: string,
        private readonly accessToken: string,
        private readonly isInitiator: boolean,
    ) {}

    async initialize() {
        this.peerConnection = new RTCPeerConnection(RTC_CONFIG);

        this.peerConnection.onconnectionstatechange = () => {
            const state = this.peerConnection?.connectionState;
            if (!state) return;
            if (state === 'connected') {
                void this.updateServerConnectionStatus(true);
            }
            if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                void this.updateServerConnectionStatus(false);
            }
            this.onConnectionStateChange?.(state);
        };

        this.peerConnection.onicecandidate = (event) => {
            const candidate = event.candidate;
            if (candidate) {
                void this.sendSignal('ice', candidate.toJSON());
            }
        };

        if (this.isInitiator) {
            this.dataChannel = this.peerConnection.createDataChannel('game-channel', { ordered: true });
            this.setupDataChannel();

            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            await this.sendSignal('offer', offer);
        } else {
            this.peerConnection.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this.setupDataChannel();
            };
        }

        this.startSignalPolling();
    }

    private setupDataChannel() {
        if (!this.dataChannel) {
            return;
        }

        this.dataChannel.onopen = () => {
            // No-op: rely on connection state events.
        };

        this.dataChannel.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as GameMessage;
                this.onMessageCallback?.(message);
            } catch (error) {
                console.error('Failed to parse game message', error);
            }
        };

        this.dataChannel.onerror = (error) => {
            console.error('Data channel error', error);
        };

        this.dataChannel.onclose = () => {
            // Connection updates are handled by RTCPeerConnection events.
        };
    }

    private startSignalPolling() {
        if (this.polling) {
            return;
        }
        this.polling = true;

        const poll = async () => {
            if (!this.polling) {
                return;
            }

            try {
                const response = await fetch(
                    `/api/game/signal?gameId=${this.gameId}&playerId=${this.playerId}&accessToken=${this.accessToken}&since=${this.lastSignalTimestamp}`,
                );

                if (response.ok) {
                    const payload = (await response.json()) as {
                        signals?: Array<{ type: SignalPayload; data: unknown; timestamp: number }>;
                    };

                    for (const signal of payload.signals ?? []) {
                        this.lastSignalTimestamp = Math.max(this.lastSignalTimestamp, signal.timestamp);
                        await this.handleSignal(signal.type, signal.data);
                    }
                }
            } catch (error) {
                console.error('Signal polling error', error);
            }

            const state = this.peerConnection?.connectionState;
            if (state !== 'connected' && state !== 'closed') {
                setTimeout(poll, 1000);
            } else {
                this.polling = false;
            }
        };

        void poll();
    }

    private deserializeSignal<T>(data: unknown): T | null {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data) as T;
            } catch (error) {
                console.error('Failed to parse signal payload', error);
                return null;
            }
        }
        return data as T;
    }

    private async handleSignal(type: SignalPayload, data: unknown) {
        if (!this.peerConnection) {
            return;
        }

        try {
            if (type === 'offer') {
                const offer = this.deserializeSignal<RTCSessionDescriptionInit>(data);
                if (!offer) {
                    return;
                }
                await this.peerConnection.setRemoteDescription(offer);
                const answer = await this.peerConnection.createAnswer();
                await this.peerConnection.setLocalDescription(answer);
                await this.sendSignal('answer', answer);
            } else if (type === 'answer') {
                const answer = this.deserializeSignal<RTCSessionDescriptionInit>(data);
                if (!answer) {
                    return;
                }
                await this.peerConnection.setRemoteDescription(answer);
            } else if (type === 'ice') {
                if (data) {
                    const candidate = this.deserializeSignal<RTCIceCandidateInit>(data);
                    if (!candidate) {
                        return;
                    }
                    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                }
            }
        } catch (error) {
            console.error('Failed to handle signal', error);
        }
    }

    private async sendSignal(type: SignalPayload, data: unknown) {
        try {
            await fetch('/api/game/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: this.gameId,
                    playerId: this.playerId,
                    accessToken: this.accessToken,
                    signalType: type,
                    signalData: data,
                }),
            });
        } catch (error) {
            console.error('Failed to send signal', error);
        }
    }

    private async updateServerConnectionStatus(connected: boolean) {
        try {
            await fetch('/api/game/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameId: this.gameId,
                    playerId: this.playerId,
                    accessToken: this.accessToken,
                    connected,
                }),
            });
        } catch (error) {
            console.error('Failed to update connection status', error);
        }
    }

    sendMessage(message: GameMessage) {
        if (this.dataChannel?.readyState === 'open') {
            this.dataChannel.send(JSON.stringify(message));
        } else {
            console.error('Data channel is not open');
        }
    }

    onMessage(callback: MessageHandler) {
        this.onMessageCallback = callback;
    }

    onConnectionChange(callback: ConnectionChangeHandler) {
        this.onConnectionStateChange = callback;
    }

    isConnected(): boolean {
        return this.peerConnection?.connectionState === 'connected';
    }

    close() {
        this.polling = false;
        this.dataChannel?.close();
        this.peerConnection?.close();
        void this.updateServerConnectionStatus(false);
    }
}
