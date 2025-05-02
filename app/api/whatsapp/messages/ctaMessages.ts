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

export { sendUrlButton };

async function sendUrlButton(
    senderId: string,
    buttonUrl: string, 
    buttonText: string,
    bodyText: string,
    headerText: string,
    footerText: string,
) {
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: senderId,
        type: "interactive",
        interactive: {
            type: "cta_url",
            /* Header optional */
            header: { type: "text", text: headerText },
            /* Body optional */
            body: { text: bodyText },
            /* Footer optional */
            footer: { text: footerText },

            action: {
                name: 'cta_url',
                button: "Tap for the options",
                parameters: {
                    display_text: buttonText,
                    url: buttonUrl
                }
            },
        },
    });

    try {
        const response = await fetch(MESSAGE_API_URL, {
            method: "POST",
            headers: HEADERS,
            body: data,
        });
        if (!response.ok) {
            console.error("WhatsApp API Error:", response.body);
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}