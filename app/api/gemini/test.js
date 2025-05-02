import { GoogleGenAI, Type } from '@google/genai';

// define the function declaration for the model
const weatherFunctionDeclaration = {
    name: 'get_current_temperature',
    description: 'Gets the current temperature for a given location.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            location: {
                type: Type.STRING,
                description: 'The city name, e.g. Boston',
            },
        },
        required: ['location'],
    },
};

export async function testGemini() {
    // Configure the client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Send request with function declarations
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: "What packages does Coastal Scuba Diving offer?",
        config: {
            tools: [{
                functionDeclarations: [
                    weatherFunctionDeclaration,
                    getAvailableBusinessFunctionDeclaration,
                    getBusinessPackagesFunctionDeclaration,
                ]
            }],
        },
    });
  
    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]; // Assuming one function call
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
        // In a real app, you would call your actual function here:
        if (functionCall.name==='get_current_businesses') {
            const result = await getCurrentBusinesses();
        }
        // const result = await getCurrentTemperature();
    } else {
        console.log("No function call found in the response.");
        console.log(response.text);
    }
}

async function getCurrentTemperature() {
    console.log("function is called.");
    return null
}