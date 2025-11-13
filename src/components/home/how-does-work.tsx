import { Clock, Globe, Play, Users, Zap } from 'lucide-react';

const HowDoesWork = () => {
    return (
        <div className="w-full bg-white px-6 py-20 font-mono">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h1 className="mb-6 font-bold text-5xl text-gray-900">How Does It Work?</h1>
                    <p className="mx-auto max-w-3xl text-gray-600 text-xl">
                        Experience the future of chess with our revolutionary 3D multiplayer platform powered by
                        real-time Server-Sent Events technology.
                    </p>
                </div>

                <div className="mb-16 grid gap-8 md:grid-cols-3">
                    <div className="transform rounded-2xl border border-gray-200 bg-gray-50 p-8 transition-all duration-300 hover:scale-105 hover:bg-gray-100">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                            <Play className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="mb-4 text-center font-bold text-2xl text-gray-900">Click Play</h3>
                        <p className="text-center text-gray-600 leading-relaxed">
                            Hit the play button and instantly join our global queue system. Your journey into 3D chess
                            begins with a single click.
                        </p>
                    </div>

                    <div className="transform rounded-2xl border border-gray-200 bg-gray-50 p-8 transition-all duration-300 hover:scale-105 hover:bg-gray-100">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-700">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="mb-4 text-center font-bold text-2xl text-gray-900">Smart Matching</h3>
                        <p className="text-center text-gray-600 leading-relaxed">
                            Our intelligent queue system instantly checks for available opponents. If someone’s waiting,
                            you’re matched immediately!
                        </p>
                    </div>

                    <div className="transform rounded-2xl border border-gray-200 bg-gray-50 p-8 transition-all duration-300 hover:scale-105 hover:bg-gray-100">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="mb-4 text-center font-bold text-2xl text-gray-900">Instant Game</h3>
                        <p className="text-center text-gray-600 leading-relaxed">
                            Games start the moment you’re matched! Server-Sent Events stream every update in real time,
                            keeping both boards perfectly in sync.
                        </p>
                    </div>
                </div>

                <div className="mb-16 rounded-3xl border border-gray-200 bg-gray-50 p-10">
                    <div className="mb-8 flex items-center justify-center">
                        <Clock className="mr-4 h-12 w-12 text-gray-900" />
                        <h2 className="font-bold text-3xl text-gray-900">Queue System</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800">
                                    <span className="font-bold text-sm text-white">1</span>
                                </div>
                                <div>
                                    <h4 className="mb-2 font-semibold text-gray-900 text-lg">Opponent Available</h4>
                                    <p className="text-gray-600">
                                        When you click play and someone is already in the queue, you’re instantly
                                        matched and the 3D chess battle begins!
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-600">
                                    <span className="font-bold text-sm text-white">2</span>
                                </div>
                                <div>
                                    <h4 className="mb-2 font-semibold text-gray-900 text-lg">Waiting Mode</h4>
                                    <p className="text-gray-600">
                                        No one in queue? No problem! You’ll wait comfortably while our system actively
                                        searches for your perfect opponent.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-6">
                            <h4 className="mb-4 flex items-center font-semibold text-gray-900 text-lg">
                                <Globe className="mr-2 h-5 w-5 text-gray-700" />
                                Real-Time Features
                            </h4>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <div className="mr-3 h-2 w-2 rounded-full bg-gray-800"></div>
                                    SSE-powered instant communication
                                </li>
                                <li className="flex items-center">
                                    <div className="mr-3 h-2 w-2 rounded-full bg-gray-700"></div>
                                    Global player pool for faster matching
                                </li>
                                <li className="flex items-center">
                                    <div className="mr-3 h-2 w-2 rounded-full bg-gray-600"></div>
                                    Automatic reconnection handling
                                </li>
                                <li className="flex items-center">
                                    <div className="mr-3 h-2 w-2 rounded-full bg-gray-500"></div>
                                    Live move synchronization
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowDoesWork;
