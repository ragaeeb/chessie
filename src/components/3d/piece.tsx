import { useSpring } from '@react-spring/core';
import { a } from '@react-spring/three';
import type { Piece, Square } from 'chess.js';
import { type ReactNode, useMemo } from 'react';
import { squareToPosition } from '@/lib/board';
import { BishopModel, KingModel, KnightModel, PawnModel, QueenModel, RookModel } from '../models';

type AnimatedPieceProps = { from: Square; to: Square; captured?: string | boolean; children: ReactNode };

export const AnimatedPiece = ({ from, to, captured, children }: AnimatedPieceProps) => {
    const fromPos = useMemo(() => squareToPosition(from), [from]);
    const toPos = useMemo(() => squareToPosition(to), [to]);
    
    const { position, rotation, scale } = useSpring({
        from: { position: fromPos, rotation: [0, 0, 0] as [number, number, number], scale: 1 },
        to: { position: toPos, rotation: [0, 0, 0] as [number, number, number], scale: 1 },
        config: { mass: 200, tension: 900, friction: 200, clamp: true },
    });

    return (
        <a.group 
            position={position as unknown as [number, number, number]}
            rotation={rotation as unknown as [number, number, number]}
            scale={scale}
        >
            {children}
        </a.group>
    );
};

type CapturedPieceProps = { position: [number, number, number]; children: ReactNode };

export const CapturedPiece = ({ position, children }: CapturedPieceProps) => {
    // Animate the captured piece flying off the board with a higher arc
    const knockOffPos: [number, number, number] = [position[0] + 4, -3, position[2] + 4];
    
    const { animPosition, rotation, opacity } = useSpring({
        from: { animPosition: position, rotation: [0, 0, 0] as [number, number, number], opacity: 1 },
        to: { animPosition: knockOffPos, rotation: [Math.PI * 2, Math.PI, Math.PI * 1.5] as [number, number, number], opacity: 0 },
        config: { mass: 2, tension: 180, friction: 40 }, // Slower, more dramatic
    });

    return (
        <a.group 
            position={animPosition as unknown as [number, number, number]}
            rotation={rotation as unknown as [number, number, number]}
        >
            <a.group scale={opacity}>
                {children}
            </a.group>
        </a.group>
    );
};

export const PieceComponent = ({ piece, highlight }: { piece: Piece; highlight: boolean }) => {
    return (
        <group castShadow>
            {piece.type === 'p' && (
                <PawnModel position={[0, 0.03, 0]} color={piece.color === 'w' ? '#e0e0e0' : '#222'} />
            )}
            {piece.type === 'r' && (
                <RookModel position={[0, 0.19, 0]} color={piece.color === 'w' ? '#e0e0e0' : '#222'} />
            )}
            {piece.type === 'n' && (
                <KnightModel position={[0, 0.22, 0]} color={piece.color === 'w' ? '#e0e0e0' : '#222'} />
            )}
            {piece.type === 'b' && (
                <BishopModel position={[0, 0.25, 0]} color={piece.color === 'w' ? '#e0e0e0' : '#222'} />
            )}
            {piece.type === 'q' && (
                <QueenModel position={[0, 0.32, 0]} color={piece.color === 'w' ? '#e0e0e0' : '#222'} />
            )}
            {piece.type === 'k' && (
                <KingModel position={[0, 0.9, 0]} color={piece.color === 'w' ? '#e0e0e0' : '#222'} />
            )}
            <meshStandardMaterial
                color={piece.color === 'w' ? '#e0e0e0' : '#222'}
                emissive={highlight ? (piece.color === 'w' ? '#444400' : '#220022') : '#000000'}
                emissiveIntensity={highlight ? 0.3 : 0}
            />
        </group>
    );
};
