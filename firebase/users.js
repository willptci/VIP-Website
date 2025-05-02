import { storage, db } from "./firebaseConfig";
import { doc, getDoc, getDocFromCache, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { sendProfileMessage } from '@/app/api/whatsapp/messages/profileMessage';

export { getUserByWAID,  updateUserData, showUserProfileHandler }

async function getUserByWAID(id) {
    // get user information stored in database filtered by WhatsApp ID (e.g., phone number)

    // query to find a user in the "users" collection whose id matches a given value.
    const idFeild = "telephone"; // or "whatsAppID"
    const q = query(collection(db, "users"), where(idFeild, "==", id));
    const querySnapshot = await getDocs(q);

    // check if the user exists or not.
    if (querySnapshot.docs.length===0) {
        // console.log("No user found with the given WhatsApp ID.");
        return { role: 'non-user' }

    } else {
        const document = querySnapshot.docs[0];
        const data = document.data();
        console.log("Hello, " + data.firstName + " " + data.lastName);
        return { 
            name: data.firstName + " " + data.lastName,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            description: data.description,
            profileImageUrl: data.profileImageUrl,
            role: data.role,
            uid: data.uid,
        }
    }
}

async function updateUserData(uid, params) {
    // e.g., params = { telephone: <phone number> }
    console.log('update users/', uid, ' ', params);
    try {
        await updateDoc(doc(db, "users", uid), params);
    } catch(error) {
        console.error("updateUserData Error: ", error);
        throw new Error(`Updating user data failed: ${error.message}`);
    }
}

async function showUserProfileHandler(uid) {
    // Load user doc.
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (!userSnap.exists()) throw new Error('User not found');
    const { firstName, lastName, email, description, telephone, profileImageUrl } = userSnap.data();

    // console.log(userSnap.data());

    // build message body
    let textBody = 
        `👤 *${firstName} ${lastName}*\n` +
        `✉️ ${email}\n` +
        `📞 ${telephone}\n` +
        `📝 ${description}`;

    await sendProfileMessage(telephone, textBody, '');

    // whatsapp payload
    /*if (profileImageUrl.length > 0) {
        console.log('Image URL ', profileImageUrl.split("?",1)[0]);
        await sendProfileMessage(telephone, textBody, profileImageUrl.split("?",1)[0]);
    } {
        textBody = textBody + `\nNo Profile Image`;
        await sendProfileMessage(telephone, textBody, '');
    }*/
}

