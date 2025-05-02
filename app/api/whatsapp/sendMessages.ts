export { sendSignUpMessage, }

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

const signUptext = 
`
Andros is a non-profit dedicated to preserving and rejuvenating the planet's natural resources by empowering local communities through sustainable eco-tourism.

Why join Andros?

Explore eco-tourism opportunities that support communities in the Bahamas, the United States, and India.
Discover unique cultural experiences and natural wonders.
Connect with eco-conscious businesses and services.

Ready to make a difference?

Sign up as a Customer:
Explore eco-friendly businesses and book sustainable adventures.

Sign up as a Business Owner:
Showcase your eco-tourism services and connect with mindful travelers.

Click below to get started and help us create meaningful change!
`;

async function sendSignUpMessage(sender_id: string) {
    const headerText = "Welcome to Andros!";
    const footerText = 'Andros';
    
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: sender_id,
        type: "interactive",
        interactive: {
            type: "button",
            header: { type: "text", text: headerText },
            footer: { text: footerText },
            body: { text: signUptext },
            action: {
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "user_sign_up",
                            title: "User Sign Up"
                        },
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "business_sign_up",
                            title: "Business Sign Up"
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




async function sendProfileSettings(senderId: string) {
    const messageBody = "Which fields of your profile do you want to edit?";
    const data = JSON.stringify({
        messaging_product: "whatsapp",
        to: senderId,
        type: "interactive",
        interactive: {
            type: "list",
            header: { type: "text", text: "Edit Your Profile" },
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