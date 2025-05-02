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

export { sendSettingsList, sendSettingButton };

async function sendSettingsList(sender_id: string) {
    const messageBody = "Which fields do you want to show on your page?";
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: sender_id,
        type: "interactive",
        interactive: {
            type: "list",
            // header: { type: "text", text: "Customize Your Page" },
            body: { text: messageBody },
            // footer: { text: " " },
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

async function sendSettingButton(sender_id: string, title: string, button_id: string) {
        // const header = "Welcome to Andros!";
        
        const data = JSON.stringify({
            messaging_product: "whatsapp",
            to: sender_id,
            type: "interactive",
            interactive: {
                type: "button",
                // header: { type: "text", text: header },
                body: { text: `Do you want to show or hide the ${title} section?` },
                action: {
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: `${button_id}_on`,
                                title: "Show"
                            },
                        },
                        {
                            type: "reply",
                            reply: {
                                id: `${button_id}_off`,
                                title: "Hide"
                            },
                        },
                    ]
                },
            }
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
    
        } catch (error) {
            console.error("Error sending message:", error);
        }
}
