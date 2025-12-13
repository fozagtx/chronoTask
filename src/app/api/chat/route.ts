import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

interface SearchResult {
  title: string
  description: string
  url: string
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      )
    }

    const {
      message,
      transcript,
      concepts,
      videoTitle,
      history,
    } = (await request.json()) as {
      message?: string
      transcript?: string
      concepts?: string[]
      videoTitle?: string
      history?: Array<{ role: string; content: string }>
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      )
    }

    const openai = new OpenAI({ apiKey })

    // Check if we need to perform a search
    const needsSearch =
      !transcript &&
      !concepts?.length &&
      !videoTitle &&
      message.toLowerCase().includes("search") ||
      message.toLowerCase().includes("find") ||
      message.toLowerCase().includes("what") ||
      message.toLowerCase().includes("how") ||
      message.toLowerCase().includes("tell") ||
      message.toLowerCase().includes("about")

    let searchContext = ""

    if (needsSearch) {
      try {
        const searchResponse = await fetch(
          new URL("/api/search", request.nextUrl.origin),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message }),
          },
        )

        if (searchResponse.ok) {
          const searchData = (await searchResponse.json()) as {
            results?: SearchResult[]
          }
          if (searchData.results && searchData.results.length > 0) {
            searchContext = "\n\nWeb search results:\n" +
              searchData.results
                .map(
                  (r) =>
                    `- ${r.title}: ${r.description} (${r.url})`,
                )
                .join("\n")
          }
        }
      } catch (error) {
        console.error("Search error:", error)
      }
    }

    const truncatedTranscript = (transcript || "").slice(0, 10000)
    const conceptList = (concepts || []).slice(0, 10).filter(Boolean)

    const systemPrompt = `You are a helpful AI assistant for a learning platform. ${
      videoTitle ? `The user is learning about: ${videoTitle}. ` : ""
    }${
      conceptList.length
        ? `Key concepts: ${conceptList.join(", ")}. `
        : ""
    }${
      truncatedTranscript
        ? `You have access to video transcript context.`
        : `If the user's question is outside your knowledge or the video context, use the web search results provided to give accurate information.`
    }

Be helpful, concise, and actionable. If you're not sure about something, say so and offer to search for more information.`

    const messages = [
      ...(history || []).map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: `${message}${searchContext}`,
          },
        ],
      },
    ]

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as Parameters<typeof openai.chat.completions.create>[0]["messages"],
      temperature: 0.6,
      max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content || ""

    return NextResponse.json({ message: content })
  } catch (error: unknown) {
    console.error("Chat error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process message"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
