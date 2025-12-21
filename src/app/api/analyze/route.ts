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

    // Configure OpenAI client for MiniMax API
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.minimax.io/v1",
    });

    const { content, documentTitle } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Document content is required" },
        { status: 400 }
      );
    }

    // Truncate content if too long (token limits)
    const truncatedContent = content.slice(0, 15000);

    const completion = await client.chat.completions.create({
      model: "MiniMax-M2",
      messages: [
        {
          role: "system",
          content: `You are an educational content analyzer. Given a document's text content, extract:
1. Key concepts (5-7 main ideas/topics covered)
2. Action tasks (6-10 actionable study tasks with time estimates)

Respond in JSON format:
{
  "concepts": ["concept 1", "concept 2", ...],
  "tasks": [
    {"id": "1", "title": "Task description", "duration": "X min", "completed": false},
    ...
  ]
}

Make tasks specific and actionable. Time estimates should be realistic (5-30 min each).`,
        },
        {
          role: "user",
          content: `Analyze this document${documentTitle ? ` titled "${documentTitle}"` : ""} and create a study plan:\n\n${truncatedContent}`,
        },
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response from MiniMax");
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = responseContent;
    const jsonMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    } else {
      // Try to find JSON object directly in response
      const objectMatch = responseContent.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonStr.trim());
    } catch {
      console.error("Failed to parse JSON from response:", responseContent);
      throw new Error(
        "Failed to parse analysis response. The AI returned an invalid format."
      );
    }

    // Validate expected structure
    if (!analysis.concepts || !analysis.tasks) {
      throw new Error(
        "Invalid analysis format: missing concepts or tasks"
      );
    }

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error("Error analyzing document:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze document";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
