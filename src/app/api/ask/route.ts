import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    const { question, transcript, concepts, videoTitle } = (await request
      .json()
      .catch(() => ({}))) as {
      question?: string;
      transcript?: string;
      concepts?: string[];
      videoTitle?: string;
    };

    if (!question?.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    const truncatedTranscript = (transcript || "").slice(0, 15000);
    const conceptList = (concepts || []).slice(0, 15).filter(Boolean);

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a helpful tutor. Answer the user\'s question using the provided video context. If the answer is not supported by the context, say what is missing and answer generally without inventing specific details. Keep it concise and actionable. Respond ONLY as JSON: { "answer": "..." }.',
        },
        {
          role: "user",
          content: [
            videoTitle ? `Video title: ${videoTitle}` : null,
            conceptList.length
              ? `Key concepts: ${conceptList.join("; ")}`
              : null,
            truncatedTranscript
              ? `Transcript excerpt: ${truncatedTranscript}`
              : null,
            `Question: ${question}`,
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content) as { answer?: string };

    return NextResponse.json({ answer: parsed.answer ?? "" });
  } catch (error: unknown) {
    console.error("Error answering question:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to answer question";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
