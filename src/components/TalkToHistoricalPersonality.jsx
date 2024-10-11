import React, { useState } from 'react';
import Groq from "groq-sdk"; // Import Groq SDK
import { ElevenLabsClient } from "elevenlabs"; // Import Eleven Labs Client

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });
// const client = new ElevenLabsClient({ apiKey: import.meta.env.VITE_ELEVEN_LABS_API_KEY });

const TalkToHistoricalPersonality = () => {
    const [selectedPersonality, setSelectedPersonality] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [voiceId, setVoiceId] = useState('');

    // Map of historical personalities with corresponding Eleven Labs voice IDs
    const personalities = {
        'Albert Einstein': {
            name: 'Albert Einstein',
            voice_id: 'sb8IVWqIHi934SGRDgcj',
        },
        // 'Cleopatra': {
        //     name: 'Cleopatra',
        //     voice_id: '',
        // },
        'William Shakespeare': {
            name: 'William Shakespeare',
            voice_id: '',
        },
        'Babar Azam': {
            name: 'Babar Azam',
            voice_id: 'u3MFbhlsL5bZkWzY7btw',
        },
        // 'Quad e Azam': {
        //     name: 'Quad e Azam',
        //     voice_id: '',
        // },
        // 'Mahatma Gandhi': {
        //     name: 'Mahatma Gandhi',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        'Adolf Hitler': {
            name: 'Adolf Hitler',
            voice_id: 'JPz8MA5CQrWEItGuoRmz',  // Add respective voice_id or create
        },
        // 'Napoleon Bonaparte': {
        //     name: 'Napoleon Bonaparte',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        'Winston Churchill': {
            name: 'Winston Churchill',
            voice_id: '3dQSSx3rVVUftsP64uty',  // Add respective voice_id or create
        },
        // 'Isaac Newton': {
        //     name: 'Isaac Newton',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        // 'Joan of Arc': {
        //     name: 'Joan of Arc',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        // 'Leonardo da Vinci': {
        //     name: 'Leonardo da Vinci',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        'Martin Luther King Jr.': {
            name: 'Martin Luther King Jr.',
            voice_id: 'pXJpk2YmsKXjCByMn4z9',  // Add respective voice_id or create
        },
        'Queen Elizabeth I': {
            name: 'Queen Elizabeth I',
            voice_id: 'JMZEU2B2GyFoRYQHV1t6',  // Add respective voice_id or create
        },
        // 'Julius Caesar': {
        //     name: 'Julius Caesar',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        // 'Nikola Tesla': {
        //     name: 'Nikola Tesla',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        // 'Abraham Lincoln': {
        //     name: 'Abraham Lincoln',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        // 'Florence Nightingale': {
        //     name: 'Florence Nightingale',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        // 'Malcolm X': {
        //     name: 'Malcolm X',
        //     voice_id: '',  // Add respective voice_id or create
        // },
        // 'Alexander the Great': {
        //     name: 'Alexander the Great',
        //     voice_id: '',  // Add respective voice_id or create
        // }
    };


    const handlePersonalityChange = (e) => {
        const selectedPerson = personalities[e.target.value];
        setSelectedPersonality(selectedPerson);
        setVoiceId(selectedPerson.voice_id);
    };

    const handleTextInput = (e) => {
        setUserMessage(e.target.value);
    };

    // Function to start speech recognition and convert voice to text
    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setRecording(true);
        };

        recognition.onresult = async (event) => {
            const userText = event.results[0][0].transcript;
            await handleTextQuestion(userText);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            alert("Error recognizing speech. Please try again.");
        };

        recognition.onend = () => {
            setRecording(false);
        };

        recognition.start();
    };

    const stopRecording = () => {
        setRecording(false);
    };

    // Handle text question
    const handleTextQuestion = async (userText) => {
        if (!userText) {
            alert("Please enter some text.");
            return;
        }

        setLoading(true);

        try {
            // Add user question to the chat
            setConversation((prevMessages) => [
                ...prevMessages,
                { sender: "user", message: userText },
            ]);

            const promptText = 'Give short answer. ' + userText + ". Talk like " + selectedPersonality.name;

            // Send text to Groq LLM for response
            const groqResponse = await groq.chat.completions.create({
                messages: [
                    { role: "user", content: promptText },
                ],
                model: "llama3-8b-8192",
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
            });

            const llmTextResponse = groqResponse.choices[0].message.content;

            setConversation((prevMessages) => [
                ...prevMessages,
                { sender: "bot", message: llmTextResponse },
            ]);

            generateAudio(llmTextResponse, voiceId);

        } catch (error) {
            console.error("Error processing question:", error);
        } finally {
            setLoading(false);
            setUserMessage("");
        }
    };

    // Function to generate audio using Eleven Labs API
    async function generateAudio(text, voiceId) {
        const apiKey = import.meta.env.VITE_ELVEN_LAB_API_KEY;
        const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

        const requestBody = {
            text: text,
            output_format: "mp3_44100_128",
            voice_settings: {
                stability: 0.1,
                similarity_boost: 0.3,
                style: 0.2,
            },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const audioStream = response.body;
            if (audioStream) {
                const reader = audioStream.getReader();
                const chunks = [];
                let result;

                while (!(result = await reader.read()).done) {
                    chunks.push(result.value);
                }

                const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                console.error("No audio stream available.");
            }
        } catch (error) {
            console.error("Error generating audio:", error);
        }
    }

    const handleSendMessage = () => {
        if (userMessage.trim()) {
            handleTextQuestion(userMessage);
        }
    };

    return (
        <div className="max-w-xl py-3 px-3 sm:max-w-2xl mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <h2 className="text-2xl font-semibold text-center mb-4">Talk to a Historical Personality</h2>

            <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Choose a Personality</label>
                <select
                    value={selectedPersonality.name || ''}
                    onChange={handlePersonalityChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Select a personality</option>
                    {Object.keys(personalities).map((person) => (
                        <option key={person} value={person}>
                            {person}
                        </option>
                    ))}
                </select>
            </div>

            <div className="chat-window bg-white p-4 rounded-lg shadow-inner h-64 overflow-y-auto mb-4">
                {conversation.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                        <div
                            className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                }`}
                        >
                            {message.message}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center">
                <input
                    type="text"
                    value={userMessage}
                    onChange={handleTextInput}
                    placeholder="Type your message..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={loading}
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Send'}
                </button>
            </div>

            <div className="flex items-center mt-4">
                <button
                    onClick={recording ? stopRecording : startRecording}
                    className={`px-4 py-2 rounded-md ${recording ? 'bg-red-600' : 'bg-green-600'} text-white`}
                >
                    {recording ? 'Stop Recording' : 'Record Audio'}
                </button>
            </div>
        </div>
    );
};

export default TalkToHistoricalPersonality;
