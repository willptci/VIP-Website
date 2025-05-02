import { sendListMessage } from "./listMessages";
import { getUserByWAID } from '@/firebase/users'
import { getBusinessByWAID } from '@/firebase/businesses';

export { sendProfileMessage, sendProfileListMessage, sendBizInfoListMessage}

// WhatsApp Cloud API Enviroment Variable
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_TOKEN = process.env.API_TOKEN;

// WhatsApp Cloud API Endpoint URL Path
const BASE_URL = "https://graph.facebook.com";
const VERSION = "v22.0";
const MESSAGE_API_URL = `${BASE_URL}/${VERSION}/${PHONE_NUMBER_ID}/messages`;
const MEDIA_API_URL = `${BASE_URL}/${VERSION}/${PHONE_NUMBER_ID}/media`;

const HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`
}

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

async function uploadMediaAndGetId(mediaUrl: string) {
    const endpoint = `https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/media`;
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    // Instruct WhatsApp to fetch & store the image at mediaUrl
    form.append('file', 'gs://andros-ea1b8.firebasestorage.app/profileImages/1178658986897628.jpeg');
    form.append('type', 'image/jpeg');

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: form as any,
    });
    console.log(response);

    const text = await response.text();
    if (!response.ok) {
        console.error(`Media upload failed [${response.status}]: ${text}`);
    }

    const payload = JSON.parse(text) as { id: string };
    return payload.id;
}

async function sendProfileMessage(senderId: string, textBody: string, mediaUrl: string='') {
    const footerText = 'Andros';
    let payload;

    if (mediaUrl) {
        const mediaId = await uploadMediaAndGetId(mediaUrl);
        console.log("Media ID: ", mediaId);
        const header = { "type": "image", 
                         "image": { 
                            "id":mediaId  
                        } };
        payload = {
            messaging_product: "whatsapp",
            to: senderId,
            type: "interactive",
            interactive: {
                type: "button",
                header: header,
                footer: { text: footerText },
                body: { text: textBody },
                action: {
                    buttons: BUTTONS
                },
            }
        }
    } else {
        payload = {
            messaging_product: "whatsapp",
            to: senderId,
            type: "interactive",
            interactive: {
                type: "button",
                header: { type: "text", text: "User Profile" },
                footer: { text: footerText },
                body: { text: textBody },
                action: {
                    buttons: BUTTONS
                },
            }
        }
    }
    
    const data = JSON.stringify(payload);

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

async function sendProfileListMessage(senderId: string) {
    const userData = await getUserByWAID(senderId);
    
    const headerText = 'Edit User Profile';
    const bodyText = 'Which section do you want to update?';
    const footerText = 'Andros';
    const buttonText = 'See the sections';
    const sections = [
        {
            "title":"User Profile",
            "rows": [
                {
                    "id": "firstName",
                    "title": "First Name",
                    "description": `${userData.firstName}`
                },
                {
                    "id": "lastName",
                    "title": "Last Name",
                    "description": `${userData.lastName}`
                }, 
                {
                    "id": 'description',
                    'title': 'Description',
                    "description": `${userData.description || 'NA'}`
                },
            ]
        },
    ];

    await sendListMessage(
        senderId, 
        headerText, 
        bodyText, 
        footerText, 
        buttonText,
        sections,
    )
}

async function sendBizInfoListMessage(senderId: string) {
    const bizData = await getBusinessByWAID(senderId);
    let compDescript = bizData.companyDescription || '';
    if (compDescript.length>72) {
        compDescript = compDescript.companyDescription.substring(0, 72) + '...';
    }
    let ownreDescript = bizData.ownerDescription || '';
    if (ownreDescript.length>72) {
        ownreDescript = ownreDescript.companyDescription.substring(0, 72) + '...';
    }
    
    const headerText = 'Edit Business Profile';
    const bodyText = 'Which section do you want to update?';
    const footerText = 'Andros';
    const buttonText = 'See the sections';
    const sections = [
        {
            "title":"Business Profile",
            "rows": [
                {
                    "id": "companyDescription",
                    "title": "About Company",
                    "description": `${compDescript}`
                },
                {
                    "id": "ownerDescription",
                    "title": "About Owner",
                    "description": `${ownreDescript}`
                }, 
                {
                    "id": 'businessEmail',
                    'title': 'Company Email',
                    "description": `${bizData.businessEmail || ''}`
                },
            ]
        },
    ];

    await sendListMessage(
        senderId, 
        headerText, 
        bodyText, 
        footerText, 
        buttonText,
        sections,
    )
}
