import { WhatsAppImageMessage } from "@/app/api/whatsapp/whatsappTypes";
import { sendTextMessage } from "@/app/api/whatsapp/sendMessages";
import { callGemini } from "@/app/api/gemini/handleGeminiCall";

export async function handleImage(message: WhatsAppImageMessage) {
    if (!message?.id) {
        console.error("No image ID found in message.");
        return;
    }

    const caption = message?.image?.caption;

    if (!caption) {
        await sendTextMessage(message?.from, "Please add the caption of the image.", message?.id);
        return null
    }

    const data = {
        "prompt": caption,
        "from": message?.from,
        "id": message?.id,
        "image_id": message?.image?.id,
        "mime_type": message.image.mime_type,
    }

    // call Gemini to interpret user prompt
    await callGemini(data)

}