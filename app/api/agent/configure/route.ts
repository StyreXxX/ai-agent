import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { AgentConfigSystemPrompt } from "@/data/Prompt";
import { AgentConfigRespSchema } from "@/data/ResponseSchema";
import { AgentConfig, db, tools } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

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
    const user = await currentUser();

    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const aiTools = await db.select({
        slug: tools.slug
    }).from(tools);

    // Build a real comma-separated list of tool slugs instead of
    // aiTools.toString(), which produced "[object Object],[object Object]"
    const toolList = aiTools.map((t) => t.slug).join(", ");

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_CLOUD_GEMINI_API_KEY });
    let lastError: unknown;

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: AgentConfigSystemPrompt
                        .replace("{USER_PROMPT}", prompt)
                        .replace("{AVAILABLE_TOOLS}", toolList),
                    config: {
                        // thinkingLevel is only for Gemini 3 models; 2.5 uses thinkingBudget
                        thinkingConfig: model.startsWith("gemini-3")
                            ? { thinkingLevel: ThinkingLevel.LOW }
                            : { thinkingBudget: 0 },
                        responseMimeType: "application/json",
                        responseSchema: AgentConfigRespSchema,
                    },
                });

                //To Save final Agent Config
                const aiOutput = JSON.parse(response.text ?? "{}");

                if (aiOutput.status == 'ready') {
                    const agentId = crypto.randomUUID();
                    const dbResult = await db.insert(AgentConfig).values({
                        ...aiOutput.config,
                        agentImage: 'https://api.dicebear.com/10.x/marbles/svg?noseProbability=0&seed=' + agentId,
                        agentId: agentId,
                        userEmail: user?.primaryEmailAddress?.emailAddress
                    }).returning();
                    return NextResponse.json({ ...dbResult[0], status_: 'ready' });
                }

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
        {
            error: "The AI service is busy right now. Please try again in a moment.",
            details: lastError instanceof Error ? lastError.message : String(lastError),
        },
        { status: 503 }
    );
}

export async function PUT(req: NextRequest) {
    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { agentConfig } = await req.json();
        console.log("Updating Agent Config:", agentConfig);

        if (!agentConfig?.agentId) {
            return NextResponse.json(
                { error: "agentId is required" },
                { status: 400 }
            );
        }

        const {
            name,
            agentImage,
            description,
            instructions,
            objective,
            tools,
            skills,
            schedule,
            status,
            outputFormat,
        } = agentConfig;

        const result = await db
            .update(AgentConfig)
            .set({
                name,
                agentImage,
                description,
                instructions,
                objective,
                tools,
                skills,
                schedule,
                status,
                outputFormat,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(AgentConfig.agentId, agentConfig.agentId),
                    eq(AgentConfig.userEmail, email)
                )
            )
            .returning();

        if (!result[0]) {
            return NextResponse.json(
                { error: "Agent not found or not yours" },
                { status: 404 }
            );
        }

        console.log("Updated Agent Config:", result[0]);

        return NextResponse.json({
            ...result[0],
            status_: "updated",
        });
    } catch (error) {
        console.error("Error updating Agent Config:", error);

        return NextResponse.json(
            {
                error: "Failed to update Agent Config",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
        .select()
        .from(AgentConfig)
        .where(eq(AgentConfig.userEmail, email));

    return NextResponse.json(result);
}