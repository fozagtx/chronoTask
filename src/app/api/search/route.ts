import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  title: string;
  description: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = (await request.json()) as { query?: string };

    if (!query?.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    const braveApiKey = process.env.BRAVE_SEARCH_API_KEY;

    if (!braveApiKey) {
      console.warn("BRAVE_SEARCH_API_KEY is not configured");
      return NextResponse.json(
        { results: [], error: "Search API not configured" },
        { status: 200 },
      );
    }

    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": braveApiKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Search API error: ${response.statusText}`);
    }

    interface BraveResult {
      title?: string;
      description?: string;
      url?: string;
    }

    const data = (await response.json()) as {
      web?: BraveResult[];
    };

    const results: SearchResult[] = (data.web || [])
      .slice(0, 5)
      .map((result: BraveResult) => ({
        title: result.title || "Untitled",
        description: result.description || "",
        url: result.url || "",
      }));

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error("Search error:", error);
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 200 },
    );
  }
}
