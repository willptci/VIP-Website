import { error } from "console";

// const GEMINI_API_URL = '/api/gemini';
const BASE_URL = 'https://fe6b-2601-c2-1680-6460-451-22f3-386f-a5ce.ngrok-free.app/';
const GEMINI_API_URL = BASE_URL + 'api/gemini';

export async function generateText(prompt: string) {
    const headers = {
        "Content-Type": "application/json",
    }
    
    const body = JSON.stringify({
        "body": prompt,
    });

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: headers,
            body: body
        });
        const data = await response.json();

        if (response.ok) {
            return data.output;
        } else {
            console.error(error);
            console.log(data.error);
            return data.error;
        }
        
    } catch(error) {
        console.error(error);
    }
}