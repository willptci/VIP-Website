import { GoogleGenAI } from '@google/genai';
import {
    welcomeMessageFunctionDeclaration,
    helpFunctionDeclaration,
    signUpFunctionDeclaration,
    updateSettingsFunctionDeclaration,
    updateDesctiptionFunctionDeclaration,
    updateProfileImageFunctionDeclaration,
    updateBusinessImageFunctionDeclaration,
    updateTourPackageFunctionDeclaration,
    getAvailableBusinessFunctionDeclaration, 
    getBusinessPackagesFunctionDeclaration,
    getBusinessInformationFunctionDeclaration,
} from './functionDeclarations'
import { updateDescription, getBusinessDocs, getBusinessByName, getPackages, getBusinessByWAID } from '@/firebase/businesses';
import { uploadBusinessImage, uploadProfileImage } from '@/firebase/uploadImage';
import { updateSettings } from '@/firebase/settings';
import { updateTourPackage } from '@/firebase/packages';
import { sendTextMessage, sendSettingsList, sendSignUpMessage } from '@/app/api/whatsapp/sendMessages';
// 
export async function callGemini(data) {
    // Configure the client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Send request with function declarations
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: data.prompt,
        config: {
            tools: [{
                functionDeclarations: [
                    // welcomeMessageFunctionDeclaration,
                    // signUpFunctionDeclaration,
                    // updateSettingsFunctionDeclaration,
                    // updateDesctiptionFunctionDeclaration,
                    // updateProfileImageFunctionDeclaration,
                    // updateBusinessImageFunctionDeclaration,
                    // updateTourPackageFunctionDeclaration,
                    // getAvailableBusinessFunctionDeclaration,
                    // getBusinessInformationFunctionDeclaration,
                    // getBusinessPackagesFunctionDeclaration,
                ]
            }],
        },
    });

    console.log(data.prompt);
    console.log(response);
  
    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0]; // Assuming one function call
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
        
        // process functions
        const answer = await processFunctions(functionCall, data);
        await sendTextMessage(data.from, answer, data.id);

    } else {
        console.log("No function call found in the response.");
        // const businssData = await getBusinessByWAID(data.from);
        // console.log(businssData);
        // await getUserByWAID(data.from);
        
        await sendTextMessage(data.from, response.text, data.id);
    }
}

async function processFunctions(functionCall, data) {
    const functionName = functionCall.name;
    let args = functionCall.args;
    let response = "";

    console.log(functionName + " is called.")
    switch (functionName) {
        case "welcome_message":
            response = 'Welcome';
            await sendSignUpMessage(data.from);
            break;

        case "sign_up":
            response = 'sign_up is called.'
            break

        case "update_settings":
            response = 'Update settings';
            await sendSettingsList(data.from);
            // await updateSettings(data.from, args);
            break

        case "update_description":
            response = 'Update description.';
            await updateDescription(data.from, args);
            break
        
        case "update_profile_image":
            await uploadProfileImage(data);
            response = 'Profile image updaded successfully.'
            break
        
        case "update_business_image":
            data.imageIndex = args.imageIndex || 1;
            await uploadBusinessImage(data)
            response = 'Business image updaded successfully.'
            break

        case "update_tour_package":
            response = 'Update tour package successfully.'
            args.from = data.from;
            await updateTourPackage(args);
            break

        case "get_current_businesses":
            response = await getBusinessDocs();
            break;

        case "get_businesses_information":
            response = await getBusinessByName(args.businessName);
            break;

        case "get_businesses_packages":
            await getPackages(args.businessName);
            break;

        default:
            response = "This is default case. Please check the Gemini function name."
            break;
    }
    return response
}

/*
"AquaVenture Bahamas provides exclusive ocean experiences on the pristine turquoise waters of the Bahamas. Our professional and friendly crew ensures a safe, enjoyable, and unforgettable experience, suitable for adventurers of all ages and skill levels."

"Owned and operated by Captain Leona Waters, a Bahamian native passionate about ocean adventures, environmental conservation, and sharing the beauty of Bahamian waters with visitors from around the world."
* */