import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface SearchResult {
  title: string;
  description: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.MINIMAX_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "MiniMax API key is not configured" },
        { status: 500 }
      );
    }

    const { message, content, concepts, documentTitle, history } =
      (await request.json()) as {
        message?: string;
        content?: string;
        concepts?: string[];
        documentTitle?: string;
        history?: Array<{ role: string; content: string }>;
      };

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Configure OpenAI client for MiniMax API
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.minimax.io/v1",
    });

    // Check if we need to perform a search
    const needsSearch =
      (!content &&
        !concepts?.length &&
        !documentTitle &&
        message.toLowerCase().includes("search")) ||
      message.toLowerCase().includes("find") ||
      message.toLowerCase().includes("what") ||
      message.toLowerCase().includes("how") ||
      message.toLowerCase().includes("tell") ||
      message.toLowerCase().includes("about");

    let searchContext = "";

    if (needsSearch) {
      try {
        const searchResponse = await fetch(
          new URL("/api/search", request.nextUrl.origin),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message }),
          }
        );

        if (searchResponse.ok) {
          const searchData = (await searchResponse.json()) as {
            results?: SearchResult[];
          };
          if (searchData.results && searchData.results.length > 0) {
            searchContext =
              "\n\nWeb search results:\n" +
              searchData.results
                .map((r) => `- ${r.title}: ${r.description} (${r.url})`)
                .join("\n");
          }
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    }

    const truncatedContent = (content || "").slice(0, 10000);
    const conceptList = (concepts || []).slice(0, 10).filter(Boolean);

    const systemPrompt = `You are a helpful AI assistant for a learning platform. ${
      documentTitle ? `The user is learning from a document titled: ${documentTitle}. ` : ""
    }${conceptList.length ? `Key concepts: ${conceptList.join(", ")}. ` : ""}${
      truncatedContent
        ? `You have access to the document content for context.`
        : `If the user's question is outside your knowledge or the document context, use the web search results provided to give accurate information.`
    }

Be helpful, concise, and actionable. If you're not sure about something, say so and offer to search for more information.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(history || []).map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: `${message}${searchContext}${truncatedContent ? `\n\nDocument context:\n${truncatedContent}` : ""}`,
      },
    ];

    const response = await client.chat.completions.create({
      model: "MiniMax-M2",
      messages,
      temperature: 0.6,
      max_tokens: 1000,
    });

    let responseContent = response.choices[0]?.message?.content || "";

    // Strip any <think>...</think> tags from the response (chain-of-thought)
    responseContent = responseContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    return NextResponse.json({ message: responseContent });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process message";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
