import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.MINIMAX_API_KEY;

    if (!apiKey) {
      console.error("MINIMAX_API_KEY is not configured");
      return NextResponse.json(
        { error: "MiniMax API key is not configured" },
        { status: 500 }
      );
    }

    const { question, content, concepts, documentTitle } = (await request
      .json()
      .catch(() => ({}))) as {
      question?: string;
      content?: string;
      concepts?: string[];
      documentTitle?: string;
    };

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const truncatedContent = (content || "").slice(0, 15000);
    const conceptList = (concepts || []).slice(0, 15).filter(Boolean);

    // Configure OpenAI client for MiniMax API
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.minimax.io/v1",
    });

    const completion = await client.chat.completions.create({
      model: "MiniMax-M2",
      messages: [
        {
          role: "system",
          content:
            'You are a helpful tutor. Answer the user\'s question using the provided document context. If the answer is not supported by the context, say what is missing and answer generally without inventing specific details. Keep it concise and actionable. Respond ONLY as JSON: { "answer": "..." }.',
        },
        {
          role: "user",
          content: [
            documentTitle ? `Document title: ${documentTitle}` : null,
            conceptList.length
              ? `Key concepts: ${conceptList.join("; ")}`
              : null,
            truncatedContent
              ? `Document excerpt: ${truncatedContent}`
              : null,
            `Question: ${question}`,
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ],
      temperature: 0.4,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from MiniMax");
    }

    // Strip any <think>...</think> tags from the response (chain-of-thought)
    let cleanedResponse = responseContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = cleanedResponse;
    const jsonMatch = cleanedResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    } else {
      // Try to find JSON object directly in response
      const objectMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
    }

    let parsed: { answer?: string };
    try {
      parsed = JSON.parse(jsonStr.trim());
    } catch {
      console.error("Failed to parse JSON from response:", responseContent);
      throw new Error("Failed to parse answer response");
    }

    return NextResponse.json({ answer: parsed.answer ?? "" });
  } catch (error: unknown) {
    console.error("Error answering question:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to answer question";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
