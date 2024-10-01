import React, { useState, useRef } from "react";
import axios from "axios";
import Groq from "groq-sdk"; // Import Groq SDK
import { ElevenLabsClient } from "elevenlabs"; // Import Eleven Labs Client

const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

const AudioChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [personality, setPersonality] = useState("");
    const [voiceSample, setVoiceSample] = useState(null);
    const [loading, setLoading] = useState(false);
    const [setupComplete, setSetupComplete] = useState(true);
    const [voiceId, setVoiceId] = useState(null); // For Eleven Labs voice ID
    const [textInput, setTextInput] = useState("");

    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaRecorderRef = useRef(null);
    const [audioResponse, setAudioResponse] = useState(null);

    const handlePersonalityChange = (e) => {
        setPersonality(e.target.value);
    };

    const handleVoiceSampleChange = (e) => {
        setVoiceSample(e.target.files[0]);
    };

    const playBase64Audio = (base64AudioData, format) => {
        const byteCharacters = atob(base64AudioData);
        const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `audio/${format}` });
        const audioUrl = URL.createObjectURL(blob);
        setAudioResponse(audioUrl);
        playAudio(audioUrl);
    };

    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(error => {
                console.error("Error playing audio: ", error);
            });
        }
    };


    // Initial setup for voice and personality
    const setupVoicePersonality = async () => {
        if (!personality || !voiceSample) {
            alert("Please provide both voice sample and personality traits.");
            return;
        }

        setLoading(true);

        try {
            // Upload voice sample to Eleven Labs using ElevenLabsClient
            const client = new ElevenLabsClient({ apiKey: 'sk_39920a0e8abd2ad20f3a54e666117fdcee879a48963e6d7a' });
            // Since voiceSample is already a file object, you can directly append it to FormData
            const formData = new FormData();
            formData.append("files", voiceSample); // voiceSample is the File object from the input

            // Send the voice sample to Eleven Labs using the client
            const voiceCloneResponse = await client.voices.add({
                files: [voiceSample], // Directly use the file object
                name: "Deceased Person Voice", // Name for the cloned voice
            });

            setVoiceId(voiceCloneResponse.voiceId); // Set the voice ID for further use

            // Send personality to Groq
            await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: personality },
                ],
                model: "llama3-8b-8192",
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                stream: true,
            });

            setSetupComplete(true);
        } catch (error) {
            console.error("Error setting up:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle recording audio with MediaRecorder
    // Start speech recognition and convert voice to text
    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = async (event) => {
            const userText = event.results[0][0].transcript;
            setMessages((prevMessages) => [...prevMessages, { sender: "user", text: userText }]);
            await handleTextQuestion(userText);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            alert("Error recognizing speech. Please try again.");
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
    };


    // Handle live audio question
    // const handleVoiceQuestion = async (audioBlob) => {
    //     if (!setupComplete) {
    //         alert("Please complete the setup first.");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    //         const recognition = new SpeechRecognition();
    //         recognition.lang = "en-US"; // Set language if needed
    //         recognition.interimResults = false;
    //         recognition.maxAlternatives = 1;

    //         // Convert audio blob to a File object
    //         const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });

    //         // Start speech recognition
    //         recognition.start();
    //         recognition.onresult = async (event) => {
    //             const userText = event.results[0][0].transcript; // Get the transcribed text

    //             // Add user question to chat
    //             setMessages((prevMessages) => [
    //                 ...prevMessages,
    //                 { sender: "user", text: userText },
    //             ]);

    //             // Now send the transcribed text to the LLM via handleTextQuestion
    //             await handleTextQuestion(userText);
    //         };

    //         recognition.onerror = (event) => {
    //             console.error("Error with speech recognition:", event.error);
    //             alert("Error recognizing speech, please try again.");
    //         };
    //     } catch (error) {
    //         console.error("Error with speech recognition:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    // Handle text question
    const handleTextQuestion = async (userText) => {
        if (!setupComplete) {
            alert("Please complete the setup first.");
            return;
        }

        setLoading(true);

        try {
            // Add user question to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "user", text: userText },
            ]);

            const promptText = 'Give short answer.' + userText + " " + personality;

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

            // Get the assistant's response text from Groq
            const llmTextResponse = groqResponse.choices[0].message.content;

            // Add LLM response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: llmTextResponse },
            ]);

            const url = "https://api.sws.speechify.com/v1/audio/speech";

            const options = {
                method: "POST",
                headers: {
                    accept: "*/*",
                    "content-type": "application/json",
                    Authorization: 'Bearer sk2DrCkKnue5Ouh0NetFjt6HBee4V-0pyp8wexJTJDk=', // Use environment variables for API keys in production
                },
                body: JSON.stringify({
                    input: llmTextResponse,
                    language: "en",
                    model: "simba-english",
                    voice_id: "Emily",
                }),
            };

            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Speechify API Error: ${errorText}`);
                }

                const json = await response.json();
                console.log("API Response: ", json);

                // Check for audio data in base64
                if (json.audio_data) {
                    // Play the base64-encoded audio
                    playBase64Audio(json.audio_data, json.audio_format);
                } else {
                    console.error("No audio data returned from Speechify API.");
                }

            } catch (error) {
                console.error("Error with Speechify API: ", error);
            }
        } catch (error) {
            console.error("Error processing question:", error);
        } finally {
            setLoading(false);
            setTextInput("");
        }
    };




    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            {!setupComplete ? (
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Voice and Personality Setup</h1>
                    <div className="mb-4">
                        <label htmlFor="personality" className="block mb-2 font-semibold">Personality Traits</label>
                        <textarea
                            id="personality"
                            className="border p-2 rounded-md w-full"
                            rows="4"
                            value={personality}
                            onChange={handlePersonalityChange}
                            placeholder="Describe the personality traits of the deceased person..."
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="voiceSample" className="block mb-2 font-semibold">Voice Sample</label>
                        <input
                            type="file"
                            id="voiceSample"
                            accept="audio/*"
                            className="border p-2 rounded-md w-full"
                            onChange={handleVoiceSampleChange}
                        />
                    </div>
                    <button
                        onClick={setupVoicePersonality}
                        className={`bg-blue-500 text-white py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Submit"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="w-full h-full max-w-lg p-6 bg-white rounded-lg shadow-md mt-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-2">Conversation</h2>
                        <div className="flex flex-col space-y-2">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${message.sender === "bot" ? "bg-gray-200 self-start" : "bg-blue-500 text-white self-end"}`}
                                >
                                    {message.text}
                                </div>
                            ))}

                        </div>
                        <div className="flex flex-col mb-4 mt-2">
                            {!isRecording && <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Type your question..."
                                className="border p-2 rounded-md w-full"
                            />
                            }
                            <button
                                onClick={() => handleTextQuestion(textInput)}
                                className={`bg-blue-500 text-white py-2 px-4 rounded-md mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Ask"}
                            </button>
                        </div>
                        <div className="flex mb-4">
                            <button
                                className={`px-4 py-2 rounded-md ${isRecording ? "bg-red-500" : "bg-green-500"} text-white`}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? "Recording..." : "Record Audio"}
                            </button>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default AudioChatApp;