import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); // Use history to navigate

    const talkToLostFriend = () => {
        navigate('/talk-to-lost-friend'); // Replace with your route
    };

    const getBackYourVoice = () => {
        navigate('/get-back-your-voice'); // Replace with your route
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-8">Welcome to Our App</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div
                    className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={talkToLostFriend}
                >
                    {/* <img
                        src="https://via.placeholder.com/300"
                        alt="Card 1"
                        className="w-full h-48 object-cover"
                    /> */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2">Talk to to a lost friend</h2>
                        <p className="text-gray-600">This is a brief description of Component 1. Click to learn more!</p>
                    </div>
                </div>
                <div
                    className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={getBackYourVoice}
                >
                    {/* <img
                        src="https://via.placeholder.com/300"
                        alt="Card 2"
                        className="w-full h-48 object-cover"
                    /> */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2">Get back your voice</h2>
                        <p className="text-gray-600">This is a brief description of Component 2. Click to learn more!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
