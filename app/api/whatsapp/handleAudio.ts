import axios from "axios";
import { WhatsAppMessage } from './whatsappTypes'

// import { GoogleGenAI, createUserContent, createPartFromUri, } from "@google/genai";
// Instantiate AI client once
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export { handleAudioMessage }

const BASE_URL = "https://graph.facebook.com";
const VERSION = "v22.0";

async function handleAudioMessage(msg: WhatsAppMessage) {
    // Destructure necessary parameters.
    const { audio } = msg;
    const { mime_type, sha256, id, voice } = audio;
    const API_TOKEN = process.env.API_TOKEN; // WhatsApp API token

    // Build API URL and construct file name.
    const api_url = `${BASE_URL}/${VERSION}/${id}`;
    const headers = { Authorization: `Bearer ${API_TOKEN}` };

    try {
        // Get the audio URL from the WhatsApp API.
        const response = await axios({url: api_url, headers: headers});
        if (!response.data?.url) throw new Error('Failed to retrieve audio URL from WhatsApp API.');
        const audio_url = response.data.url;
        // console.log(audio_url);

        // Download the audio as an stream.
        const downloaded_response = await axios({
            url: audio_url,
            headers: headers, 
            responseType: 'arraybuffer'
        });
        const base64AudioFile = Buffer.from(downloaded_response.data).toString("base64");
        // console.log(base64AudioFile);

        const contents = [
            { text: "Please summarize the audio, and call the appropriate function." },
            {
                inlineData: {
                    mimeType: mime_type,
                    data: base64AudioFile,
                },
            },
        ];
        return contents

    } catch(error) {
        console.error("handleAudioMessage error: ", error);
        throw new Error(`handleAudioMessage failed: ${error}`);
    }
}