import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {

    const {prompt}=await req.json();

    if(!prompt.trim()){
        return NextResponse.json({error:"Prompt is required"}, {status:400});
    }

    const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY;

    try{
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model:'gemini-flash-latest',
            contents:`
            `
        })
    }
    }catch(e){

    }
}

