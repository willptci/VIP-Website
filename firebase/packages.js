import { storage, db } from "./firebaseConfig";
import { doc, getDoc, getDocFromCache, setDoc, addDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import { sendTextMessage, sendReplyTextMessage } from '@/app/api/whatsapp/messages/textMessages'

export { showPackageInfoHandler, updateTourPackage };

async function showPackageInfoHandler(uid, senderId) {
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
            capacity: data.capacity,
            totalTime: data.total,
            what: data.what,
            time: data.time,
            included: data.included,
            bring: data.bring,
        }
    });
    const pkgs = (await Promise.all(pkgPromises)).filter(p => p);

    // 3) Build the message text
    let body =  `*${biz.companyName} Packages*\n\n`;

    if (pkgs.length) {
        body += ``
        pkgs.forEach(p => {
            body += `*${p.title}* (${p.status?'available':'unavailable'}): $${p.amount}/${p.per} \n`
            body += `       *Max Capacity*: ${p.capacity}\n`;
            body += `       *Total Time*: ${p.totalTime}\n`;
            body += `       *You'll do*: ${p.what}\n`;
            body += `       *Time*: ${p.time}\n`;
            body += `       *Include*: ${p.included}\n`;
            body += `       *Bring*: ${p.bring}\n\n`;
        });
    } else {
        body += `_No packages available_\n`
    }

    await sendTextMessage(senderId, body);

}

async function updateTourPackage(params) {
    // Extract function args and get the package ID from title
    const { uid: uid, title: title, action: action, from: from, msgId: msgId } = params;

    if (action=="add") {
        console.log("Adding new package: ", title)
        try {
            // Reference the 'packages' collection in Firestore.
            const packagesCollection = collection(db, 'packages');
        
            // Add a new packagee document with the given package data.
            const pkgRef = await addDoc(packagesCollection, {
                amount: params.amount || NaN,
                bring: params.bring || NaN,
                capacity: params.capacity || NaN,
                createdAt: serverTimestamp(),
                included: params.included || NaN,
                per: params.per || NaN,
                status: false,
                time: params.time || NaN,
                title: title,
                total: params.total || 0,
                what: params.what || NaN,
            });
            await setDoc(pkgRef, { id: pkgRef.id}, { merge: true });
            console.log('Added document with ID: ', pkgRef.id);

            // Get the database of the business
            const bizSnap = await getDoc(doc(db, 'businesses', uid));
            if (!bizSnap.exists()) throw new Error(`No business found at businesses/${uid}`)
            const biz = bizSnap.data();
            const packages = biz.packages;
            packages.push(pkgRef.id);
            console.log(packages);

            // Add created document to the corresponding businss database "business/<uid>/packages/"
            const businessRef = doc(collection(db, 'businesses'), uid);
            await setDoc(businessRef, { packages: packages }, { merge: true });
            console.log("Updated the package successfully.")
        } catch(error) {
            console.error("updateTourPackage Error: ", error);
            throw new Error(`Adding new package failed: ${error.message}`);
        }
          
    } else {
        console.log("Updating the package: ", title)
        const pkg_data = await getPackageByName(title);
        if (!pkg_data) return await sendTextMessage(from, `Package, "${title}" Not Exists. Please Check the Package Title.`);
        const { id: id } = pkg_data;

        // create the parameters to update
        let paramsUpdate = { 'title': params.title };
        if (params.hasOwnProperty('status')) {
            paramsUpdate.status = params.status;
        } if (params.hasOwnProperty('amount')) {
            paramsUpdate.amount = params.amount;
        } if (params.hasOwnProperty('per')) {
            paramsUpdate.per = params.per;
        } if (params.hasOwnProperty('capacity')) {
            paramsUpdate.capacity = params.capacity;
        } if (params.hasOwnProperty('total')) {
            paramsUpdate.total = params.total;
        } if (params.hasOwnProperty('what')) {
            paramsUpdate.what = params.what;
        } if (params.hasOwnProperty('time')) {
            paramsUpdate.time = params.time;
        } if (params.hasOwnProperty('included')) {
            paramsUpdate.included = params.included;
        } if (params.hasOwnProperty('bring')) {
            paramsUpdate.bring = params.bring;
        } if (params.hasOwnProperty('photos')) {
            paramsUpdate.photos = params.photos;
        }
        console.log(`data to update: ${paramsUpdate}`)

        try {
            // Update the package field in collection "packages/<id>"
            const pkgRef = doc(collection(db, 'packages'), id);
            await setDoc(pkgRef, paramsUpdate, { merge: true });
            console.log("Updated the package successfully.")
            await sendReplyTextMessage(from, `Updated the package successfully.`, msgId);
        } catch(error) {
            console.error('Updating package failed: ', error.message);
            await sendReplyTextMessage(from, error.message, msgId);
        }
        
    }
}

export async function getPackageByName(title) {
    // get package data in database by its title
    const q = query(collection(db, "packages"), where("title", "==", title));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const document = querySnapshot.docs[0];
    const data = document.data();

    return { "id": data.id }
}

