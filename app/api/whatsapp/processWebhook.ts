import { WhatsAppWebhookPayload, WhatsAppMessage} from './whatsappTypes';
import { handleImage } from '@/app/api/whatsapp/handleImage';
import { handleText } from '@/app/api/whatsapp/handleText';
// import { sendSignUpFlowMessage } from './sendTextMessage';

export function processWhatsAppWebhook(body: WhatsAppWebhookPayload) {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
  
    if (value?.messages) {
        value?.messages.forEach((message: WhatsAppMessage) => {
            console.log(`Received ${message.type} message from ${message.from}`);
            processWhatsAppMessage(message);
        });
    }
}

/**
 * can change or integrate handle text and handle image functions
 * 
 */

export async function processWhatsAppMessage(message: WhatsAppMessage) {
    const type = message?.type;
    switch (type) {
        case "text":
            console.log(`Text message: ${message?.text?.body}`);
            await handleText(message);
            break;
        
        case "image":
            console.log(`Image received: ID=${message?.image?.id}, MIME=${message?.image?.mime_type}`);
            const caption = message?.image?.caption;
            if (caption) {
                console.log(caption);
                await handleImage(message);

            } else {
                console.log("Please send an image with caption.");
            }
            break;
        
        case "audio":
            console.log(`Audio received: ID=${message.audio.id}, MIME=${message.audio.mime_type}`);
            break;

        

        case "video":
            console.log(`Video received: ID=${message.video.id}, MIME=${message.video.mime_type}`);
            break;
    
        case "document":
            console.log(`Document received: ID=${message.document.id}, File=${message.document.filename}`);
            break;
        
        case "sticker":
            console.log(`Sticker received: ID=${message.sticker.id}, MIME=${message.sticker.mime_type}`);
            break;
        
        case "interactive":
            if (message.interactive.button_reply) {
                console.log(`Button clicked: ${message.interactive.button_reply.title}`);
                // await sendSignUpFlowMessage(message.from);

            } else if (message.interactive.list_reply) {
                console.log(`List option selected: ${message.interactive.list_reply.title}`);
            }
            break;
        
        default:
            console.log(`Unknown message type: ${type}`);
    };
}