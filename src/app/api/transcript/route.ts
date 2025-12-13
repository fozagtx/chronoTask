import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 },
    );
  }

  try {
    // Use youtubei.js (Innertube) - more reliable as it uses YouTube's internal API
    // instead of scraping HTML which gets blocked by YouTube
    const youtube = await Innertube.create();

    // Fetch the video info
    const info = await youtube.getInfo(videoId);

    // Get the title
    const title = info.basic_info.title;

    // Get the transcript data
    const transcriptData = await info.getTranscript();

    if (!transcriptData?.transcript?.content?.body?.initial_segments) {
      throw new Error("No transcript available for this video");
    }

    // Extract text from transcript segments
    const segments = transcriptData.transcript.content.body.initial_segments;
    const transcript = segments
      .map(
        (segment: { snippet?: { text?: string } }) =>
          segment.snippet?.text || "",
      )
      .filter((text: string) => text.length > 0)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (!transcript) {
      throw new Error("Empty transcript");
    }

    return NextResponse.json({ transcript, title });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: `Failed to fetch transcript: ${errorMessage}. This video may not have captions available.`,
      },
      { status: 500 },
    );
  }
}
