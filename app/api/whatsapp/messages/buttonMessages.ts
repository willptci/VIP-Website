import { sendListMessage } from "./listMessages";
import { getUserByWAID } from '@/firebase/users'

export { sendButtonMessage}

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

// Define types
interface Reply {
    id: string,
    title: string
}
  
interface Button {
    type: string,
    reply: Reply
}

async function sendButtonMessage(
    senderId: string,
    headerText: string,
    textBody: string,
    footerText: string,
    buttons: Button[],
) {
    
    const payload = {
        messaging_product: "whatsapp",
        to: senderId,
        type: "interactive",
        interactive: {
            type: "button",
            header: { type: "text", text: headerText },
            footer: { text: footerText },
            body: { text: textBody },
            action: {
                buttons: buttons,
            },
        }
    }
    console.log(payload)

    try {
        const response = await fetch(MESSAGE_API_URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            console.error("WhatsApp API Error:", response);
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

/**
const BUTTONS = [
    {
        type: "reply",
            reply: {
                id: "change_profile",
                title: "Change Profile"
            },
    },
    {
        type: "reply",
        reply: {
            id: "change_profile_image",
            title: "Change Profile Image"
        },
    },
]
 */