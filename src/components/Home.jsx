import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const talkToLostFriend = () => {
        navigate('/talk-to-lost-friend');
    };

    const getBackYourVoice = () => {
        navigate('/get-back-your-voice');
    };

    const TalkToHistoricalPersonality = () => {
        navigate('/talk-to-historical-personality');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-12">Welcome to MyVoice</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {/* Card 1: Talk to a Lost Friend */}
                <div
                    className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer hover:shadow-2xl"
                    onClick={talkToLostFriend}
                >
                    {/* <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=60"
                            alt="Talk to a lost friend"
                            className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    </div> */}
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Talk to a Lost Friend</h2>
                        <p className="text-gray-600 mb-6">
                            Reconnect with a friend you've lost touch with, through memories and AI-powered conversations. Relive old times, and bridge the gap in your friendship.
                        </p>
                        <button
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded transition-colors"
                            onClick={talkToLostFriend}
                        >
                            Try Now
                        </button>
                    </div>
                </div>

                {/* Card 2: Get Back Your Voice */}
                <div
                    className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer hover:shadow-2xl"
                    onClick={getBackYourVoice}
                >
                    {/* <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1531891437562-5a1a3749f937?auto=format&fit=crop&w=500&q=60"
                            alt="Get back your voice"
                            className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    </div> */}
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Get Back Your Voice</h2>
                        <p className="text-gray-600 mb-6">
                            Use our cutting-edge voice restoration technology to rediscover your voice, regain confidence, and connect with others using your unique sound.
                        </p>
                        <button
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded transition-colors"
                            onClick={getBackYourVoice}
                        >
                            Try Now
                        </button>
                    </div>
                </div>

                {/* Card 3: Talk to Historical Personality */}
                <div
                    className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer hover:shadow-2xl"
                    onClick={TalkToHistoricalPersonality}
                >
                    {/* <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1523642208894-4b7e573f5d63?auto=format&fit=crop&w=500&q=60"
                            alt="Talk to historical personality"
                            className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    </div> */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Talk to a Historical Personality</h2>
                        <p className="text-gray-600 mb-6">
                            Dive into history and have conversations with renowned historical figures. Experience history from their perspective and learn from their wisdom.
                        </p>
                        <button
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded transition-colors"
                            onClick={TalkToHistoricalPersonality}
                        >
                            Try Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
