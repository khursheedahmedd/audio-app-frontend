async function generateAudio(text, voiceId) {
    const apiKey = "YOUR_API_KEY"; // replace with your actual API key
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const requestBody = {
        text: text,
        output_format: "mp3_44100_128", // or any format you prefer
        voice_settings: {
            stability: 0.1,
            similarity_boost: 0.3,
            style: 0.2,
        },
        // Include other optional fields as necessary
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

        // Assuming the response is a stream
        const audioStream = response.body; // get the readable stream
        if (audioStream) {
            const reader = audioStream.getReader();
            const chunks = [];
            let result;

            // Read the stream until it's done
            while (!(result = await reader.read()).done) {
                chunks.push(result.value);
            }

            // Convert chunks to a Blob
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
