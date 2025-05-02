import { storage, db } from "./firebaseConfig";
import { doc, getDoc, getDocFromCache, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { getUserByWAID } from '@/firebase/users';

import { sendTextMessage } from '@/app/api/whatsapp/messages/textMessages';
import { sendButtonMessage } from '@/app/api/whatsapp/messages/buttonMessages';

const BASE_URL = "https://7e52-128-61-222-152.ngrok-free.app/company/";

export { searchBusinessesHandler, showBusinessInfoHandler, updateBusinessData};

async function updateBusinessData(uid, params) {
    // e.g., params = {telephone: <phone number>}
    console.log('update businesses/', uid, ' ', params);
    try {
        await updateDoc(doc(db, "businesses", uid), params, { merge: true });
    } catch(error) {
        console.error("updateBusinessData Error: ", error);
        throw new Error(`Updating business data failed: ${error.message}`);
    }
    
}

async function showBusinessInfoHandler(uid, senderId) {
    // 1) Load business doc
    const bizSnap = await getDoc(doc(db, 'businesses', uid));
    if (!bizSnap.exists()) throw new Error(`No business found at businesses/${uid}`)
    const biz = bizSnap.data();

    // 2) Load each package
    const pkgIds = biz.packages || []
    const pkgPromises = pkgIds.map( async (id) => {
        const snap = await getDoc(doc(db, 'packages', id));
        if (!snap.exists()) return null;
        const data = snap.data();
        console.log(data)
        return {
            title: data.title,
            amount: data.amount,
            per: data.per,
            status: data.status,
        }
    });
    const pkgs = (await Promise.all(pkgPromises)).filter(p => p);

    // 3) Build the message text
    let body =  
        `🏢 *${biz.companyName}*\n` +
        `👤 Owner: ${biz.firstName} ${biz.lastName}\n` +
        `✉️ Email: ${biz.businessEmail}\n` +
        `📞 Phone: ${biz.phoneNumber}\n\n` +
        `📝 Company Info: ${biz.companyDescription || 'NA'}\n` +
        `📝 Owner Info: ${biz.ownerDescription || 'NA'}\n\n`

    if (pkgs.length) {
        body += `*Packages:*\n`
        pkgs.forEach(p => {
            body += `– *${p.title}* (${p.status?'available':'unavailable'}): $${p.amount}/${p.per}\n`
        });
    } else {
        body += `_No packages available_\n`
    }

    const buttons = [
        {
            type: "reply",
            reply: {
                id: "change_business_info",
                title: "Change Information"
            },
        },
        {
            type: "reply",
            reply: {
                id: "add_package",
                title: "Add Package"
            },
        },
        {
            type: "reply",
            reply: {
                id: "change_image",
                title: "Change Site Image"
            },
        },
    ]

    await sendButtonMessage(
        senderId,
        'Business Information',
        body,
        'Andros',
        buttons,
    )
}

async function searchBusinessesHandler({
    query: q,
    limit: limit = 10
}) {
    const keywords = q.toLowerCase().split(" ");
    console.log("keywords: ", keywords);

    const bizReccomend = [];
    const bizSnap = await getDocs(collection(db, 'businesses'));

    for (const bizDoc of bizSnap.docs) {
        const bizData = bizDoc.data();
        const pkgIds = Array.isArray(bizData.packages) ? bizData.packages : [];

        let pkgReccomend = [];
        for (const pkgId of pkgIds) {
            const pkgSnap = await getDoc(doc(db, 'packages', pkgId));
            if (!pkgSnap.exists()) continue;
            const pkg = pkgSnap.data();
            const title = pkg.title || '';
            const desc = pkg.what || '';

            // match any keyword in title or description
            if (keywords.some(kw => title.toLowerCase().includes(kw) || desc.toLowerCase().includes(kw))) {
                if (pkg.status) {
                    pkgReccomend.push({
                        id: pkgId,
                        title: `$${pkg.amount}/${pkg.per}`,
                        description: `${title}`,
                    });
                }
            }
        }
        if (pkgReccomend.length > 0) {
            bizReccomend.push({
                // businessId: bizDoc.id,
                title: bizData.companyName,
                rows: pkgReccomend,
            });
        }
        if (bizReccomend.length >= limit) break;
    }
    // console.log(bizReccomend);
    return bizReccomend;
}

export async function updateDescription(whatsAppID, params) {
    // Extract the WhatsApp ID from params and get user data.
    const user_data = await getUserByWAID(whatsAppID);
    const { uid: uid } = user_data;

    // Update the photos field in collection "businesses/uid"
    const businessRef = doc(collection(db, 'businesses'), uid);
    await setDoc(businessRef, params, { merge: true });
    console.log("Updated the description.")
}


export async function getBusinessDocs() {
    // get all documents in the "businesses" collection
        const querySnapshot = await getDocs(collection(db, "businesses"));
        let companies = {};
        let reply = '🌴 *Here are some amazing businesses on Andros:*\n\n';
    
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            const data = doc.data();
            companies[data.companyName] = {
                id: doc.id,
                description: data.companyDescription,
                email: data.businessEmail,
                phoneNumber: data.phoneNumber,
            }
            reply += `*${data.companyName}*\n`
            if (data.companyDescription.length>0) {
                reply += `${data.companyDescription}\n`;
            }
            reply += `${BASE_URL+doc.id}\n\n`;
        });
        reply += '📦 Reply with the business name to explore their packages, or type “help” for options.';
        return reply.trim()
}

export async function getBusinessByWAID(whatsAppID) {
// get business information stored in database filtered by WhatsApp ID (e.g., phone number)
    const q = query(collection(db, "businesses"), where("phoneNumber", "==", whatsAppID));
    const querySnapshot = await getDocs(q);
    const document = querySnapshot.docs[0];
    const data = document.data();

    return {
        'companyDescription': data.companyDescription,
        'businessEmail': data.businessEmail,
        'companyName': data.companyName,
        'ownerDescription': data.ownerDescription,
        'phoneNumber': data.phoneNumber,
        "photos": data.photos,
        "packages": data.packages,
    }
}

export async function getBusinessByName(companyName) {
// get business information stored in database filtered by companyName
    const q = query(collection(db, "businesses"), where("companyName", "==", companyName));
    const querySnapshot = await getDocs(q);
    const document = querySnapshot.docs[0];
    const data = document.data();

    // console.log(data)

    let response = `🏝️ *${companyName}*\n`;
    response += `${data.companyDescription}\n\n`;

    response += `👤 *Owned by:* ${data.firstName + ' ' + data.lastName}\n`;
    response += `${data.ownerDescription}\n\n`;

    response += `📧 *Email:* ${data.businessEmail}\n`;
    response += `📞 *Phone:* ${data.phoneNumber}\n\n`;

    if (data.packages.length === 0) {
        response += `📦 No packages are currently available.\n`;
    } else {
        response += `📦 *Available Packages:*`;
        for (let i=0; i<data.packages.length; i++) {
            const id = data.packages[i];
            const docRef = doc(db, "packages", id);
            const pkgDoc = await getDoc(docRef);
            const pkg = pkgDoc.data();

            response += `\n${i+1}. *${pkg.title}* – $${pkg.amount} per ${pkg.per}\n`;
            response += `👥 Max Capacity: ${pkg.capacity}\n`;
            response += `🕒 Duration: ${pkg.total} hrs\n`;
            response += `🔹 ${pkg.what}\n`;
        }
    }
    response += `\n💬 Reply with the *package name* to book or ask questions.`;

    return response.trim()
}

export async function getPackages(companyName) {
    const q = query(collection(db, "businesses"), where("companyName", "==", companyName));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
        const data = document.data();
        const packages = data.packages;
        console.log(packages);

        packages.forEach(async (id) => {
            const docRef = doc(db, "packages", id);
            const document = await getDoc(docRef);
            console.log(document.data().title);
        })
    });
}
