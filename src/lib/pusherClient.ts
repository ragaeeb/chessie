import Pusher from 'pusher-js';

export const createPusherClient = (playerId: string) => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key) {
        throw new Error('Missing NEXT_PUBLIC_PUSHER_KEY environment variable');
    }

    return new Pusher(key, {
        cluster: cluster ?? 'mt1',
        channelAuthorization: { endpoint: '/.netlify/functions/pusherAuth', transport: 'ajax', params: { playerId } },
    });
};
