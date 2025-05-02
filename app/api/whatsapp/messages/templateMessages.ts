export { sendTemplateMessage };

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

async function sendTemplateMessage(senderId: string, templateName: string='template') {    
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: senderId,
        type: "template",
        template: {
            "name": templateName, 
            // "language": { "code": "en_US" }
            "language": { "code": "en" },
        }
    });

    try {
        const response = await fetch(MESSAGE_API_URL, {
            method: "POST",
            headers: HEADERS,
            body: data,
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}