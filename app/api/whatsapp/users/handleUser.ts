import { callGeminiUser } from '@/app/api/gemini/users/handleGeminiCall';
import { WhatsAppMessage } from '../whatsappTypes';

export { handleUser }

async function handleUser(msg: WhatsAppMessage) {

    if (msg.type==='text') {

        await callGeminiUser({
            prompt: msg.text.body,
            senderId: msg.from,
            messageId: msg.id,
        });
    }
}