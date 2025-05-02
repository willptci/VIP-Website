// File: src/app/api/whatsapp/signUpFlow.ts
import {
    getSessionForUser,
    initializeSession,
    saveSession,
    finalizeSignupAndCleanup,
    clearSession,
} from '@/firebase/signUpSession';
import { sendReplyTextMessage, sendTextMessage, } from '@/app/api/whatsapp/messages/textMessages';
import { sendSignUpMessage } from '@/app/api/whatsapp/messages/signUpMessage';
import { generatePassword } from './pwGenerator';
import { WhatsAppMessage } from '../whatsappTypes';
  
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
export async function handleSignUpFlow(msg: WhatsAppMessage) {
    const msgId = msg.id;
    const phone = msg.from;
    const text = msg.text?.body?.trim() ?? '';

    let session = await getSessionForUser(phone);
  
    // 1) Initialize if new
    if (!session) {
      session = await initializeSession(phone);
      await sendSignUpMessage(phone);
      return;
    }
  
    switch (session.step) {
        case 'init': {
            if (msg.type === 'interactive') {
                const choiceId = msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id;
                if (choiceId === 'business_sign_up') {
                    session.data.role = 'business';
                } else if (choiceId === 'user_sign_up') {
                    session.data.role = 'user';
                } else {
                    return sendReplyTextMessage(phone, 'Invalid selection. Please choose Business or User sign-up.', msgId);
                }
                session.step = 'awaiting_fullName';
                await saveSession(phone, session);
                return sendReplyTextMessage(phone, 'Please enter your full name (e.g. Jane Doe).', msgId);
            }
            return sendReplyTextMessage(phone, 'Please tap one of the sign-up options.', msgId);
        }
  
        case 'awaiting_fullName': {
            if (!text.includes(' ')) {
                return sendReplyTextMessage(phone, 'Please include both first and last name (e.g. Jane Doe).', msgId);
            }
            const [firstName, ...rest] = text.split(/\s+/);
            session.data.firstName = firstName;
            session.data.lastName = rest.join(' ');
            session.step = 'awaiting_email';
            await saveSession(phone, session);
            return sendReplyTextMessage(phone, `Thanks, ${firstName}! Now enter your email address.`, msgId);
        }
  
        case 'awaiting_email': {
            if (!EMAIL_REGEX.test(text)) {
                return sendReplyTextMessage(phone, 'Invalid email—try again.', msgId);
            }
            session.data.email = text;
    
            if (session.data.role === 'business') {
                session.step = 'awaiting_companyName';
                await saveSession(phone, session);
                return sendReplyTextMessage(phone, `Thanks. Almost done, what's your company name?`, msgId);
            }

            session.step = 'complete';
            await sendReplyTextMessage(phone, 'Thanks! Generating your temporary password...', msgId);
            
            const tempPassword = generatePassword(12);
            session.data.password = tempPassword;
            await saveSession(phone, session);
            const line = [
                `🔑 *Your temporary password*:`,
                `\`${tempPassword}\``,
            ].join(' ');
            await sendTextMessage(phone, line);
            return finalizeSignupAndCleanup(phone, session.data);
        }
  
        case 'awaiting_companyName': {
            if (!text) {
            return sendReplyTextMessage(
                phone,
                'Enter a valid company name.',
                msgId
            );
            }
            session.data.companyName = text;
            session.step = 'complete';
            await sendReplyTextMessage(phone, 'Thanks! Generating your temporary password...', msgId);
            
            const tempPassword = generatePassword(12);
            session.data.password = tempPassword;
            const lines = [
                `🔑 *Your temporary password*:`,
                `\`${tempPassword}\``,
            ].join(' ');
            await sendTextMessage(phone, lines);
            await saveSession(phone, session);
            return finalizeSignupAndCleanup(phone, session.data);
        }
  
        default: {
            console.warn('Unknown session step:', session.step);
            await sendReplyTextMessage(phone, 'Oops, something went wrong. Let’s start over.', msgId);
            await clearSession(phone);
            session = await initializeSession(phone);
            await sendSignUpMessage(phone);
            return;
        }
    }
}