import { WhatsAppTextMessage } from "@/app/api/whatsapp/whatsappTypes";
import { generateText } from "@/app/api/gemini/generateText";
import { callGemini } from "@/app/api/gemini/handleGeminiCall";

export async function handleText(message: WhatsAppTextMessage) {
    if (!message?.id) {
        console.error("No text ID found in message.");
        return;
    }
    const data = {
        "prompt": message.text.body,
        "from": message.from,
        "id": message.id,
    }

    // call Gemini to interpret user prompt
    await callGemini(data);

}




async function Gemini(message: WhatsAppTextMessage) {
    // call gemini and generate response

    if (!message?.id) {
        console.error("No text ID found in message.");
        return;
    }
    const text = message?.text?.body;
    const sender_id = message?.from;
    
    let answer = await generateText(text) ?? "Sorry, I couldn't process your request.";
    console.log("Gemini's reponse: " + answer);

    // await sendTextMessage(sender_id, answer);
}