import { Gamepad2Icon, PlayIcon } from 'lucide-react';
import Link from 'next/link';
import { GiTeacher } from 'react-icons/gi';
import pkg from '@/../package.json';
import Squares from '@/components/react-bits/Squares';

const url = pkg.homepage;

const HeroSection = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 py-20 font-sans text-white">
            <div className="absolute inset-0 z-0 opacity-20">
                <Squares
                    direction="diagonal"
                    speed={0.5}
                    squareSize={120}
                    borderColor="rgba(255, 255, 255, 0.05)"
                    hoverFillColor="#f7e26b"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-4">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
                    <svg
                        className="h-4 w-4 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <title>3D Chess Icon</title>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
                        />
                    </svg>
                    <span className="text-emerald-300 text-sm">Real-time 3D Chess</span>
                </div>

                <h1 className="mb-6 max-w-5xl text-center font-bold text-6xl text-white leading-tight md:text-8xl">
                    Immersive 3D Chess
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                        Multiplayer Experience
                    </span>
                </h1>

                <p className="mb-12 max-w-2xl text-center text-gray-300 text-xl">
                    Play chess in stunning 3D with real-time multiplayer. Challenge opponents worldwide with smooth
                    animations and an immersive board experience.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/game/new"
                        className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-10 font-semibold text-base text-white shadow-emerald-500/25 shadow-lg transition-all hover:scale-105 hover:shadow-emerald-500/40 hover:shadow-xl"
                    >
                        <Gamepad2Icon />
                        Play Chess
                    </Link>
                    <Link
                        href="/learn"
                        className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white/5 px-10 font-semibold text-base text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10"
                    >
                        <GiTeacher />
                        Learn To Play
                    </Link>
                </div>

                <div className="fixed top-8 right-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-2 backdrop-blur-sm">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-emerald-400/50 shadow-lg"></div>
                    <span className="text-emerald-300 text-sm">Live Multiplayer</span>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
