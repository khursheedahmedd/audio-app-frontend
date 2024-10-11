import React, { useState, useRef } from "react";

const TextToVoice = () => {
    const [textInput, setTextInput] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);
    const [audioResponse, setAudioResponse] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const videoRef = useRef(null); // To reference the video element
    const mediaStreamRef = useRef(null); // To store the media stream

    const handleTextInputChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
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

    const convertTextToSpeech = async () => {
        if (!textInput) {
            alert("Please enter some text.");
            return;
        }

        if (!gender) {
            alert("Please select a gender.");
            return;
        }

        setLoading(true);

        try {
            const voiceId = gender === "male" ? "Henry" : "Emily";
            const url = "https://api.sws.speechify.com/v1/audio/speech";
            const options = {
                method: "POST",
                headers: {
                    accept: "*/*",
                    "content-type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_SPEECHIFY_API_KEY}`,
                },
                body: JSON.stringify({
                    input: textInput,
                    language: "en",
                    model: "simba-english",
                    voice_id: voiceId,
                }),
            };

            const response = await fetch(url, options);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Speechify API Error: ${errorText}`);
            }

            const json = await response.json();
            console.log("API Response: ", json);

            if (json.audio_data) {
                playBase64Audio(json.audio_data, json.audio_format);
            } else {
                console.error("Error: No audio data returned");
            }
        } catch (error) {
            console.error("Error generating voice:", error);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    const startRecording = async () => {
        setIsRecording(true);

        try {
            // Request access to the camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream; // Set video element to display the stream
            mediaStreamRef.current = stream; // Store the stream so we can stop it later
            console.log("Recording started...");
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access camera. Please check your permissions.");
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        setIsRecording(false);

        // Stop the camera stream
        if (mediaStreamRef.current) {
            const tracks = mediaStreamRef.current.getTracks();
            tracks.forEach((track) => track.stop()); // Stop each track (audio/video)
            mediaStreamRef.current = null; // Clear the stream reference
        }

        alert("Recording finished. We will add this feature soon.");
        console.log("Recording stopped...");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center px-2 py-[7rem]">
            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md mt-10">
                <h1 className="text-2xl font-bold mb-4">Get Back Your Voice</h1>

                <div className="flex flex-col mb-4">
                    <label htmlFor="gender" className="mb-2 font-semibold">
                        Select Gender
                    </label>
                    <select
                        id="gender"
                        className="border p-2 rounded-md w-full"
                        value={gender}
                        onChange={handleGenderChange}
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="flex flex-col mb-4">
                    <label htmlFor="textInput" className="mb-2 font-semibold">
                        Enter Text
                    </label>
                    <textarea
                        id="textInput"
                        className="border p-2 rounded-md w-full"
                        rows="4"
                        value={textInput}
                        onChange={handleTextInputChange}
                        placeholder="Type the text you want to convert to voice..."
                    />
                </div>

                <button
                    onClick={convertTextToSpeech}
                    className={`bg-blue-500 text-white py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Generating Voice..." : "Convert to Voice"}
                </button>

                {!isRecording && (
                    <button
                        onClick={startRecording}
                        className="bg-green-500 text-white py-2 px-4 rounded-md mt-4 sm:ml-2"
                    >
                        Record Sign Language
                    </button>
                )}

                {isRecording && (
                    <div className="mt-4">
                        {/* Video element to display camera stream */}
                        <div className="border p-2 rounded-md w-full h-64 bg-gray-200 flex items-center justify-center">
                            <video
                                ref={videoRef}
                                autoPlay
                                className="w-full h-full object-cover"
                            ></video>
                        </div>

                        <button
                            onClick={stopRecording}
                            className="bg-red-500 text-white py-2 px-4 rounded-md mt-4"
                        >
                            Stop Recording
                        </button>
                    </div>
                )}
            </div>

            {audioResponse && (
                <audio className="mt-4" controls>
                    <source src={audioResponse} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
};

export default TextToVoice;
