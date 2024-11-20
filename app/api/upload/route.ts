import { NextResponse } from "next/server";
import { Storage, ID, Permission, Role } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";

const { APPWRITE_STORAGE_BUSINESS_BUCKET_ID: BUCKET_ID } = process.env;

export async function POST(req: Request) {
  if (!BUCKET_ID) {
    return NextResponse.json(
      { error: "Bucket ID is missing in environment variables" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const { storage } = await createAdminClient();
    const response = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      file,
      [
        Permission.read(Role.any()), // Publicly readable
      ]
    );

    return NextResponse.json({ fileId: response.$id });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
