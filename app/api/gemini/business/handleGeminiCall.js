import { GoogleGenAI } from '@google/genai';
import * as decls from '@/app/api/gemini/business/declarations';
// import { searchBusinessesHandler } from '@/firebase/businesses';
// import { sendListMessage } from '../../whatsapp/messages/listMessages';

import { showUserProfileHandler } from '@/firebase/users';
import { showBusinessInfoHandler } from '@/firebase/businesses';
import { showPackageInfoHandler, updateTourPackage } from '@/firebase/packages'
import { editProfileImage, addNewPackage, initializeAddPackageSession } from '@/app/api/whatsapp/business/handleBusiness'
import { sendReplyTextMessage, sendTextMessage } from '../../whatsapp/messages/textMessages';
import { sendDisplaySettings } from '@/app/api/whatsapp/messages/listMessages';
import { sendProfileListMessage, sendBizInfoListMessage } from '@/app/api/whatsapp/messages/profileMessage';
import { sendListMessage } from '@/app/api/whatsapp/messages/listMessages';

export { callGeminiBusiness };

// Instantiate AI client once
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Collect all function declarations
const allFnDecls = [
    decls.showUserProfile,
    decls.showBusiness,
    decls.showPackages,
    decls.displaySettings,
    decls.editUserProfile,
    decls.editBusiness,
    decls.editProfileImage,
    decls.editBusinessImage,
    decls.addNewTourPackage,
    decls.updateTourPackage,
];

// System Config
const tools = [{ functionDeclarations: allFnDecls },];
const systemInstruction = `
    You are a system manager of the Andros Business Platform.
    Your name is Andros AI.
    But you do not have to show function names.
    Please behaive as if your are a general language model if the user asks non-business-related questions.
    `;

async function callGeminiBusiness(msg, contents, uid) {
    // const prompt = msg.text.body;
    const senderId = msg.from;
    const messageId = msg.id;

    try {
        // Generate content with Gemini
        const res = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: contents,
            config: { 
                tools: tools,
                systemInstruction: systemInstruction, 
            },
        });

        console.log(`User   -> "${contents}" (uid: ${uid})`);

        // Check for function calls in the response
        if (res.functionCalls && res.functionCalls.length > 0) {
            res.functionCalls.forEach( async (fnCall) => {
                console.log(`Function to call: ${fnCall.name}`);
                console.log(`Arguments: ${JSON.stringify(fnCall.args)}`);

                if (fnCall.name==='show_user_profile') {
                    await showUserProfileHandler(uid);

                } else if (fnCall.name==='show_business_page') {
                    await showBusinessInfoHandler(uid, senderId);

                } else if (fnCall.name==='show_packages') {
                    await showPackageInfoHandler(uid, senderId);

                } else if (fnCall.name==='display_settings') {
                    await sendDisplaySettings(senderId);

                } else if (fnCall.name==='edit_user_profile') {
                    await sendProfileListMessage(senderId);

                } else if (fnCall.name==='edit_business_page') {
                    await sendBizInfoListMessage(senderId);

                } else if (fnCall.name==='edit_profile_image') {
                    await editProfileImage(msg);

                } else if (fnCall.name==='edit_business_image') {
                    await sendListMessage(
                        msg.from, 
                        'Upload Business Image', 
                        'What business image do you want to upload?',
                        'Andros',
                        'See the options',
                        BUTTONS,);
                } else if (fnCall.name==='add_package_tour') {
                    if (fnCall.args.hasOwnProperty('title')) {
                        await addNewPackage(msg, uid, fnCall.args.title);
                    } else {
                        await initializeAddPackageSession(msg);
                    }
                } else if (fnCall.name==='update_tour_package') {
                    let params = fnCall.args;
                    params.action = 'edit'
                    params.from = senderId;
                    params.msgId = messageId;
                    await updateTourPackage(params);
                }

            })
        } else {
            console.log(`Gemini -> "${res.text}"`);
            // await sendReplyTextMessage(senderId, res.text, messageID);
            await sendTextMessage(senderId, res.text)
            // console.log("No function call found in the response.");
        }

    } catch(error) {
        console.error(error);
        throw new Error(`callGeminiBusiness failed: ${error}`);
    }
}

const BUTTONS = [{
    "title":"Business Images",
    "rows":[
        {
            "id":"business_image_0",
            "title":"Business Image 1",
            "description":""
        },
        {
            "id":"business_image_1",
            "title":"Business Image 2",
            "description":""
        },
        {
            "id":"background_image_2",
            "title":"Background Image",
            "description":""
        },
    ]
}];

