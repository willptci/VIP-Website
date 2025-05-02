import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
        });

        const data = await req.json();
        const prompt = data.body;
        // console.log(prompt);

        const result = await model.generateContent(prompt);
        const output = result.response.text();

        return NextResponse.json({ output: output });

    } catch (error){
        console.error(error)
    }
}