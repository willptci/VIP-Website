import { storage, db } from "./firebaseConfig";
import { doc, getDoc, getDocFromCache, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";

import { updateBusinessData } from "./businesses";

export { uploadBusinessImage, };

/***/

const BASE_URL = "https://graph.facebook.com";
const VERSION = "v22.0";

export async function uploadProfileImage(uid, image) {
    // image = {mime_type: string, sha256: string, id: string}
    
    // Create a reference to the user's directory in Firebase Storage.
    const userUploadRef = ref(storage, 'profileImages'); // points to 'storage/profileImages'

    try {
        // Upload the image and retrieve the download URL.
        const downloadURL = await uploadImage(image, userUploadRef);
        console.log('File available at', downloadURL);

        // Update the photos field in collection "users/uid"
        const userRef = doc(collection(db, 'users'), uid);
        await setDoc(userRef, { profileImageUrl: downloadURL }, { merge: true });
        console.log("Updated the image successfully.")

    } catch(error) {
        console.error("uploadProfileImage Error: ", error);
        throw new Error(`Uploading profile image failed: ${error.message}`);
    }
}

async function uploadBusinessImage(uid, image, imageIdx) {
    // Create a reference to the user's directory in Firebase Storage.
    const userUploadRef = ref(storage, `users/${uid}`); // points to 'user/<userid>'

    try {
        // Upload the image and retrieve the download URL.
        const downloadURL = await uploadImage(image, userUploadRef);
        console.log('File available at', downloadURL);

        // Get the database of the business photos and update the image
        const bizSnap = await getDoc(doc(db, 'businesses', uid));
        if (!bizSnap.exists()) throw new Error('Business not found');
        const bizData = bizSnap.data();
        const photos = bizData.photos;

        photos[imageIdx] = downloadURL;
        console.log("Image Index: ", imageIdx);
        console.log(photos);

        // Update the photos field in collection "users/uid"
        await updateBusinessData(uid, { photos: photos })
        console.log("Updated the image successfully.")

    } catch(error) {
        console.error("uploadBusinessImage Error: ", error);
        throw new Error(`Uploading business image failed: ${error.message}`);
    }
}


export async function uploadImage(image, userUploadReference) {
    // image = {mime_type: string, sha256: string, id: string}
    console.log("uploadImage function is called.")

    // Destructure necessary parameters.
    const { mime_type, id } = image;
    const API_TOKEN = process.env.API_TOKEN; // WhatsApp API token

    // Build API URL and construct file name.
    const api_url = `${BASE_URL}/${VERSION}/${id}`;
    const extension = mime_type.split('/')[1]; // Example: 'image/jpeg' -> 'jpeg'
    const file_name = `${id}.${extension}`;
    const headers = { Authorization: `Bearer ${API_TOKEN}` };

    try {
        // Get the image URL from the WhatsApp API.
        const response = await axios({url: api_url, headers: headers});
        if (!response.data?.url) throw new Error('Failed to retrieve image URL from WhatsApp API.');
        const image_url = response.data.url;

        // Download the image as an ArrayBuffer.
        const downloaded_response = await axios({
            url: image_url, 
            headers: headers, 
            responseType: 'arraybuffer'
        });
        // console.log(downloaded_response.data)

        // Create a storage reference to the file.
        const storageRef = ref(userUploadReference, file_name);
        console.log(storageRef.fullPath);

        // Create the upload task.
        const uploadTask = uploadBytesResumable(storageRef, downloaded_response.data, { auth: "secret" });

        // Wrap the upload task event in a Promise.
        return await new Promise((resolve, reject) => {
            let lastProgress = 0;
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // Log only if progress increases by at least 10% (or some other threshold)
                    if (progress - lastProgress >= 10 || progress === 100) {
                        console.log(`Upload is ${progress.toFixed(2)}% done`);
                        lastProgress = progress;
                    }
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                    console.error("Upload error:", error.message);
                    reject(new Error(`Upload to Firebase failed: ${error.message}`));
                },
                async () => {
                    // Once the upload completes, retrieve the download URL.
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch(error) {
                        reject(new Error(`Getting download URL failed: ${error.message}`));
                    }
                }
            );
        });
    } catch(error) {
        console.error("uploadImage error: ", error);
        throw new Error(`uploadImage failed: ${error.message}`);
    }
}