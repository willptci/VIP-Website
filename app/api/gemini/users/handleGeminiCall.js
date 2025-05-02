import { GoogleGenAI } from '@google/genai';
import * as declarations from '@/app/api/gemini/users/declarations';
import { searchBusinessesHandler } from '@/firebase/businesses';
import { sendListMessage } from '../../whatsapp/messages/listMessages';
export { callGeminiUser };

// Instantiate AI client once
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Collect all function declarations
const allFnDecls = [
    declarations.search_businesses,
    // declarations.recommend_businesses,
];

// tools
const tools = [
    // { googleSearch: {} },
    { functionDeclarations: allFnDecls },
];

// Handler map: function name -> async handler
const fnHandlers = {
    search_businesses: searchBusinessesHandler,

};

async function callGeminiUser(params) {
    const { prompt, senderId, messageID } = params;

    // Generate content with Gemini
    const res = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { tools: tools },
    });

    console.log(`User   -> "${prompt}"`);

    // Check for function calls in the response
    if (res.functionCalls && res.functionCalls.length > 0) {
        res.functionCalls.forEach( async (fnCall) => {
            console.log(`Function to call: ${fnCall.name}`);
            console.log(`Arguments: ${JSON.stringify(fnCall.args)}`);

            const handler = fnHandlers[fnCall.name];
            const recs = await handler(fnCall.args);
            console.log(recs)

            await sendListMessage(
                senderId, 
                'Recommended Packages',
                `Here are some options for you based on: ${fnCall.args.query}`,
                'Andros',
                'View Options',
                recs
            );

        })
    } else {
        console.log(`Gemini -> "${res.text}"`);
        // console.log("No function call found in the response.");
    }
}