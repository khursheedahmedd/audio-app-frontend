import React, { useState } from "react";

const TextToVoice = () => {
    const [textInput, setTextInput] = useState("");
    const [gender, setGender] = useState(""); // State to store user's gender
    const [loading, setLoading] = useState(false);
    const [audioResponse, setAudioResponse] = useState(null);

    const handleTextInputChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    // Function to convert base64 audio to a Blob and generate an Object URL for playing
    const playBase64Audio = (base64AudioData, format) => {
        const byteCharacters = atob(base64AudioData);
        const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `audio/${format}` });
        const audioUrl = URL.createObjectURL(blob);
        setAudioResponse(audioUrl);
        playAudio(audioUrl);
    };

    // Function to convert text to speech using the Speechify API with fetch
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
            const voiceId = gender === "male" ? "Henry" : "Emily"; // Set voice_id based on gender
            const url = "https://api.sws.speechify.com/v1/audio/speech";
            const options = {
                method: "POST",
                headers: {
                    accept: "*/*",
                    "content-type": "application/json",
                    Authorization: "Bearer sk2DrCkKnue5Ouh0NetFjt6HBee4V-0pyp8wexJTJDk=", // Replace with your actual Speechify API key
                },
                body: JSON.stringify({
                    input: textInput, // Use the text provided by the user
                    language: "en", // Replace or modify based on supported languages
                    model: "simba-english", // Model used by Speechify, adjust if needed
                    voice_id: voiceId, // Use voice_id based on gender
                }),
            };

            // Fetch request to Speechify API
            const response = await fetch(url, options);

            // Check if the response is OK, else throw an error
            if (!response.ok) {
                const errorText = await response.text(); // Get error message from response
                throw new Error(`Speechify API Error: ${errorText}`);
            }

            const json = await response.json();
            console.log("API Response: ", json);

            if (json.audio_data) {
                // Play the base64-encoded audio
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

    // Function to play the audio
    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md mt-10">
                <h1 className="text-2xl font-bold mb-4">Text to Voice</h1>

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
                    className={`bg-blue-500 text-white py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={loading}
                >
                    {loading ? "Generating Voice..." : "Convert to Voice"}
                </button>
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
