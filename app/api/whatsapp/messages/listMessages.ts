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

export { sendListMessage, sendDisplaySettings }

// Define types
interface Row {
  id: string
  title: string
  description: string
}

interface Section {
  title: string
  rows: Row[]
}

async function sendListMessage(
    senderId:string, 
    headerText:string,
    bodyText:string,
    footerText:string,
    buttonText:string,
    sections:  Section[]
) {
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: senderId,
        type: "interactive",
        interactive: { 
            type: "list",
            header: { type: "text", text: headerText },
            body: { text: bodyText },
            footer: { text: footerText },
            action: {
                button: buttonText,
                sections: sections,
            }
        }
    });
    try {
        const response = await fetch(MESSAGE_API_URL, {
            method: "POST",
            headers: HEADERS,
            body: data,
        });

        if (!response.ok) {
            const json = await response.json()
            console.error("WhatsApp API Error:", response.status, json);
            throw new Error(`WhatsApp API error ${response.status}: ${json.error?.message || JSON.stringify(json)}`);
        }
    } catch(error) {
        console.error(error);
    }
}
/**
[{
    "title":"AquaVenture Bahamas",
    "rows":[
        {
            "id":"50852fe7-efad-4e06-83eb-78ccae326929",
            "title":"Sunset Fishing Expedition $500/total",
            "description":"Evening fishing for snapper, grouper, and local species; relaxing views of sunset."
        },
        {
            "id":"eQbqytymV5qbmY2V9WwJ",
            "title":"Santa Clause Fishing $NaN/NaN",
            "description":""
        }
    ]
}]
 */

async function sendDisplaySettings(senderId: string) {
    const messageBody = "Which field do you want to display?";
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: senderId,
        type: "interactive",
        interactive: {
            type: "list",
            header: { type: "text", text: "Edit Display" },
            body: { text: messageBody },
            footer: { text: "Andros" },
            action: {
                button: "Tap for the options",
                sections: [
                    {
                        title: 'Choose the option',
                        rows: [
                            {
                                id: 'showCompanyName',
                                title: 'Company Name',
                                description: 'Your Company and its description.'
                            },
                            {
                                id: 'showCompanyDescription',
                                title: 'Advertise Your Business',
                                description: 'How would you describe your business?'
                            },
                            {
                                id: 'showWhoYouAre',
                                title: 'Who You Are?',
                                description: 'Your name and a bit about you.'
                            },
                            {
                                id: 'showContact',
                                title: 'Your Preferred Contact',
                                description: 'How should clients contact you?'
                            },
                            {
                                id: 'showBackground',
                                title: 'Background Image?',
                                description: 'Seperates description and packages.'
                            },
                        ],
                    },
                ],
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