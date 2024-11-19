'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_STORAGE_BUCKET_ID: STORAGE_BUCKET_ID,
  APPWRITE_BUSINESS_COLLECTION_ID: BUSINESS_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: SignInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(session);
  } catch (error) {
      console.error('Error', error);
  }
}

export const signUp = async (userData: SignUpParams) => {
    const { email, password } = userData;

    try {
        const { account, database} = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
    );

    if(!newUserAccount) throw new Error('Error creating user')

      const newUser = await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        ID.unique(),
        {
          email: newUserAccount.email,
          userId: newUserAccount.$id,
        }
      )

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
    } catch (error) {
        console.error('Error', error);
    }
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const user = await account.get();
  
      //const user = await getUserInfo({ userId: result.$id})
  
      return parseStringify(user);
    } catch (error) {
      console.log(error)
      return null;
    }
  }

  export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
      const { database } = await createAdminClient();
  
      const user = await database.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
      )
  
      return parseStringify(user.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const updateUserProfile = async (documentId: string, profileData: Partial<User>): Promise<User | null> => {
    try {
        const { database } = await createAdminClient();

        const updatedProfile = await database.updateDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            documentId,
            profileData
        );

        console.log("Updated profile data:", updatedProfile);
        return parseStringify(updatedProfile) as User;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return null;
    }
};

export const logout = async () => {
  try {
      const { account } = await createSessionClient();
      cookies().delete('appwrite-sesssion');
      await account.deleteSession('current');
      console.log("User logged out successfully");
  } catch (error) {
      console.error("Error logging out:", error);
  }
};

export const uploadProfileImage = async (file: File): Promise<string | null> => {
  try {
      const { storage } = await createAdminClient();

      const response = await storage.createFile(
          STORAGE_BUCKET_ID!,
          ID.unique(),
          file
      );

      console.log("Uploaded image file:", response);
      return response.$id;
  } catch (error) {
      console.error("Error uploading profile image:", error);
      return null;
  }
};

export const createBusiness = async (userData: Business) => {
  const { companyName, firstName, lastName, preferredContact, description, charges, offer } = userData;

  try {
    const { account, database } = await createAdminClient();
    
    const user = await getLoggedInUser();
    if (!user || !user.$id) {
      throw new Error('User is not logged in or userId is missing');
    }
    //const userId = user.$id;


    const newBusiness = await database.createDocument(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      ID.unique(),
      {
        userId: user.$id,
        companyName,
        firstName,
        lastName,
        preferredContact,
        description,
        charges,
        offer
      }
    );

    return JSON.stringify(newBusiness);
  } catch (error) {
    console.error('Error creating business document:', error);
    throw new Error('Failed to create business document');
  }
};