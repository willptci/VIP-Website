import { WhatsAppMessage } from '@/app/api/whatsapp/whatsappTypes';
import { callGeminiBusiness } from '@/app/api/gemini/business/handleGeminiCall';
import { sendProfileListMessage, sendBizInfoListMessage } from '@/app/api/whatsapp/messages/profileMessage';
import { sendReplyTextMessage } from '@/app/api/whatsapp/messages/textMessages';
import { sendListMessage } from '@/app/api/whatsapp/messages/listMessages';
import { handleAudioMessage } from '../handleAudio';
import { getSessionForUser, initializeSession, saveSession, sessionType} from '@/firebase/customizeSession';
import { updateUserData } from '@/firebase/users';
import { updateBusinessData } from '@/firebase/businesses';
import { updateSettings } from '@/firebase/settings';
import { updateTourPackage } from '@/firebase/packages'
import { uploadProfileImage, uploadBusinessImage } from '@/firebase/uploadImage';
import { sendButtonMessage } from '../messages/buttonMessages';

export { handleBusiness, editProfileImage, initializeAddPackageSession, addNewPackage };

async function handleBusiness(msg: WhatsAppMessage, uid: string) {
    if (msg.type==='text') {
        const session = await getSessionForUser(msg.from);
        if (!session || !session.step) {
            const contents = msg.text.body;
            try {
                await callGeminiBusiness(msg, contents, uid);
            } catch(error) {
                console.error(error);
                await sendReplyTextMessage(msg.from, `${error}`, msg.id);
                throw new Error(`handleBusiness failed: ${error}`);
            }

        } else {
            const stp = session.step;
            console.log('current session: ', stp)
            if (stp==='firstName'||stp==='lastName'||stp==='description') {
                let replyMsg = 'Profile data updated.';
                try {
                    await updateUserData(uid, { [stp]: msg.text.body });
                    console.log('updated', msg.text.body )
                } catch(error) {
                    replyMsg = `${error}` || 'Unknown error during upload.'
                }
                await sendReplyTextMessage(msg.from, replyMsg, msg.id);
                session.step = '';
                await saveSession(msg.from, session);

            } else if (stp==='companyDescription'||stp==='ownerDescription'||stp==='businessEmail') {
                let replyMsg = 'Business Infomation updated.';
                try {
                    await updateBusinessData(uid, { [stp]: msg.text.body })
                    console.log('updated', msg.text.body )
                } catch(error) {
                    replyMsg = `${error}` || 'Unknown error during upload.'
                }
                await sendReplyTextMessage(msg.from, replyMsg, msg.id);
                session.step = '';
                await saveSession(msg.from, session);

            } else if (stp==='add_package') {
                const pkgTitle = msg.text.body;
                await addNewPackage(msg, uid, pkgTitle);
                session.step = '';
                await saveSession(msg.from, session);

            } else {}
        }

    } else if (msg.type==='image') {
        const session = await getSessionForUser(msg.from);
        if (session) {
            const stp = session.step;
            console.log('current session: ', stp)
            // console.log(msg)
            const image = msg.image; // {mime_type, sha256, id}

            if (stp==='change_profile_image') {
                let replyMsg = 'Profile image uploaded.';
                try {
                    await uploadProfileImage(uid, image);
                } catch(error) {
                    replyMsg = `${error}` || 'Unknown error during upload.'
                }
                session.step = '';
                await saveSession(msg.from, session);
                await sendReplyTextMessage(msg.from, replyMsg, msg.id);

            } else if (stp==='business_image_0'||stp==='business_image_1'||stp==='background_image_2') {
                let replyMsg = 'Business image uploaded.'
                try {
                    await uploadBusinessImage(uid, image, stp.split("_")[2]);
                } catch(error) {
                    replyMsg = `${error}` || 'Unknown error during upload.'
                }
                session.step = '';
                await saveSession(msg.from, session);
                await sendReplyTextMessage(msg.from, replyMsg, msg.id);
            }
        }

    } else if (msg.type==='audio') {
        // console.log('received audio: ', msg);
        try {
            const contents = await handleAudioMessage(msg);
            await callGeminiBusiness(msg, contents, uid);

        } catch(error) {
            await sendReplyTextMessage(msg.from, `${error}`, msg.id);
            throw new Error(`handleBusiness failed: ${error}`);
        }
        
    } else if (msg.type==='interactive') {
        const replyType = msg.interactive.type;
        if (replyType==='button_reply') {
            const id = msg.interactive.button_reply?.id;
            if (id==='change_profile') {
                await sendProfileListMessage(msg.from);

            } else if (id==='change_profile_image') {
                await editProfileImage(msg);

            } else if (id==='change_business_info') {
                // update business description, owner description
                await sendBizInfoListMessage(msg.from);

            } else if (id==='add_package') {
                // add new packages
                await initializeAddPackageSession(msg);
                
            } else if (id==='change_image') {
                // change business image 1, 2 and background
                await sendListMessage(
                    msg.from, 
                    'Upload Business Image', 
                    'What business image do you want to upload?',
                    'Andros',
                    'See the options',
                    [{
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
                    }]);
            } else if (id==='on'||id==='off') {
                // start image upload sesstion
                const session = await getSessionForUser(msg.from);
                const stp = session.step;
                if (stp==='showBackground'||stp==='showCompanyDescription'||stp==='showCompanyName'||stp==='showContact'||stp==='showWhoYouAre') {
                    await updateSettings(uid, { [stp]: true ? id==='on': false });
                    session.step = '';
                    await saveSession(msg.from, session);
                    await sendReplyTextMessage(msg.from, "Display setting updated.", msg.id);
                    }
            }


        } else if (replyType==='list_reply') {
            const id = msg.interactive.list_reply?.id;
            const title = msg.interactive.list_reply?.title;
            // start customize sesstion
            let session = await getSessionForUser(msg.from);
            if (!session) session = await initializeSession(msg.from);
            console.log('Customize session initiated for ', title);

            if (id==='firstName'||id==='lastName'||id==='description'||id==='companyDescription'||id==='ownerDescription'||id==='businessEmail') {
                session.step = id;
                await saveSession(msg.from, session);
                console.log('Customize session saved for ', title);
                const message = `Plese enter "${title}".`;
                await sendReplyTextMessage(msg.from, message, msg.id);

            } else if (id==='showBackground'||id==='showCompanyDescription'||id==='showCompanyName'||id==='showContact'||id==='showWhoYouAre') {
                session.step = id;
                await saveSession(msg.from, session);
                console.log('Customize session saved for ', title);
                await sendButtonMessage(
                    msg.from, 
                    'Show or Hide', 
                    `${title}`, 
                    'Andros',
                    [{
                        "type": "reply",
                        "reply": {
                            "id": `on`,
                            "title": "Show"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": `off`,
                            "title": "Hide"
                        }
                    }]
                )

            } else if (id==='business_image_0'||id==='business_image_1'||id==='background_image_2') {
                
                session.step = id;
                await saveSession(msg.from, session);
                console.log('Customize session saved for ', title);
                const message = `Please upload the image for ${title}.`;
                await sendReplyTextMessage(msg.from, message, msg.id);
            }
        }
    }
    
}

async function editProfileImage(msg: WhatsAppMessage) {
    // start image upload sesstion
    let session = await getSessionForUser(msg.from);
    if (!session) session = await initializeSession(msg.from);
    console.log('Image upload session initiated');

    session.step = 'change_profile_image';
    await saveSession(msg.from, session);
    console.log('Image upload session saved');
    const message = `Please send a profile photo`;
    await sendReplyTextMessage(msg.from, message, msg.id);
}

async function addNewPackage(msg: WhatsAppMessage, uid: string, pkgTitle: string) {
    const params = {uid: uid, title: pkgTitle, action: 'add'};
    let replyMsg = `New package '${pkgTitle}' is added.`;
    try {
        await updateTourPackage(params);
    } catch(error) {
        replyMsg = `${error}` || 'Unknown error during upload.'
        console.error("addNewPackage Error: ", error);
    }
    await sendReplyTextMessage(msg.from, replyMsg, msg.id);
}

async function initializeAddPackageSession(msg: WhatsAppMessage) {
    let session = await getSessionForUser(msg.from);
    if (!session) session = await initializeSession(msg.from);
    console.log('Add package session initiated');
    session.step = 'add_package';
    await saveSession(msg.from, session);
    await sendReplyTextMessage(msg.from, 'Please enter new pakcage title.', msg.id);
}