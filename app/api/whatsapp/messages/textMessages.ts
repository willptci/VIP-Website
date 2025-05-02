// WhatsApp Cloud API Enviroment Variable
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_TOKEN = process.env.API_TOKEN;

// WhatsApp Cloud API Endpoint URL Path
const BASE_URL = "https://graph.facebook.com";
const VERSION = "v22.0";
const MESSAGE_API_URL = `${BASE_URL}/${VERSION}/${PHONE_NUMBER_ID}/messages`;

const HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`
}

export { sendTextMessage, sendReplyTextMessage }

async function sendTextMessage(senderId: string, message: string,) {
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: senderId,
        type: "text",
        text: { "body": message }
    });
    try {
        const response = await fetch(MESSAGE_API_URL, {
            method: "POST",
            headers: HEADERS,
            body: data,
        });

        if (!response.ok) {
            console.error("WhatsApp API Error:", data);
            throw new Error(`Response status: ${response.status}`);
        }
    } catch(error) {
        console.error(error);
    }
}

async function sendReplyTextMessage(sender_id: string, message: string, message_id: string) {
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: sender_id,
        context: { "message_id": message_id },
        type: "text",
        text: { "body": message }
    });
    try {
        const response = await fetch(MESSAGE_API_URL, {
            method: "POST",
            headers: HEADERS,
            body: data,
        });
        if (!response.ok) {
            console.error("WhatsApp API Error:", data);
            throw new Error(`Response status: ${response.status}`);
        }
    } catch(error) {
        console.error(error);
    }
}