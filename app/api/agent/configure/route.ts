import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { AgentConfigSystemPrompt } from "@/data/Prompt";
import { AgentConfigRespSchema } from "@/data/ResponseSchema";
import { db, tools } from "@/db";

const MODELS = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite"]; // primary, then fallback
const MAX_ATTEMPTS_PER_MODEL = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRetryable(e: any) {
    const status = e?.status ?? e?.code;
    const msg = String(e?.message ?? "");

    return (
        [500, 503, 504].includes(status) ||
        /UNAVAILABLE|overloaded|high demand/i.test(msg)
    );
}

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const aiTools = await db.select({
        slug:tools.slug
    }).from(tools)
    
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_CLOUD_GEMINI_API_KEY });
    let lastError: unknown;

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: AgentConfigSystemPrompt.replace("{USER_PROMPT}", prompt).replace('{AVAILABLE_TOOLS}', aiTools.toString()),
                    config: {
                        // thinkingLevel is only for Gemini 3 models; 2.5 uses thinkingBudget
                        thinkingConfig: model.startsWith("gemini-3")
                            ? { thinkingLevel: ThinkingLevel.LOW }
                            : { thinkingBudget: 0 },
                        responseMimeType: "application/json",
                        responseSchema: AgentConfigRespSchema,
                    },
                });

                return NextResponse.json(JSON.parse(response.text ?? "{}"));
            } catch (e) {
                lastError = e;
                console.error(`[${model}] attempt ${attempt} failed:`, e);
                if (!isRetryable(e)) break;          // bad request/key: don't retry, try next model
                if (attempt < MAX_ATTEMPTS_PER_MODEL) {
                    await sleep(500 * 2 ** (attempt - 1) + Math.random() * 300); // ~0.5s, 1s, 2s
                }
            }
        }
    }

    return NextResponse.json(
        { error: "The AI service is busy right now. Please try again in a moment." },
        { status: 503 }
    );
}

/*
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { AgentConfigSystemPrompt } from "@/data/Prompt";
import { AgentConfigRespSchema } from "@/data/ResponseSchema";

export async function POST(req: NextRequest) {

    const {prompt}=await req.json();

    if(!prompt.trim()){
        return NextResponse.json({error:"Prompt is required"}, {status:400});
    }

    const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY;

    try{
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model:'gemini-3.6-flash',
            contents:AgentConfigSystemPrompt.replace("{USER_PROMPT}",prompt),
            config:{
                thinkingConfig: {thinkingLevel:ThinkingLevel.MEDIUM},
                responseMimeType: "application/json",
                responseSchema: AgentConfigRespSchema
            }
        })

        return NextResponse.json(JSON.parse(response.text??"{}"));

    }catch (e) {
    console.error("GEMINI ERROR:", e);

    return NextResponse.json(
        {
            error: e instanceof Error ? e.message : String(e)
        },
        { status: 500 }
    );
}
}
*/
