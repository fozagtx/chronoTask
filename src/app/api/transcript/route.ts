import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
import {
  YouTubeTranscriptApi,
  GenericProxyConfig,
} from "@playzone/youtube-transcript";

// Route segment config to prevent build-time timeout
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to fetch transcript with retries and exponential backoff
async function fetchTranscriptWithRetry(
  videoId: string,
  retries = MAX_RETRIES,
): Promise<{ transcript: string; title: string }> {
  const proxyUrl = process.env.YOUTUBE_TRANSCRIPT_PROXY;
  const proxyConfig = proxyUrl
    ? new GenericProxyConfig(proxyUrl, proxyUrl)
    : undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(
        `Attempting to fetch transcript (attempt ${attempt + 1}/${retries + 1})...`,
      );

      // Create API instance with optional proxy configuration
      const api = new YouTubeTranscriptApi(proxyConfig);

      // Fetch transcript using @playzone/youtube-transcript
      const transcriptData = await api.fetch(videoId);

      if (!transcriptData || !transcriptData.snippets?.length) {
        throw new Error("No transcript data received");
      }

      // Extract and format transcript text from snippets
      const transcript = transcriptData.snippets
        .map((segment) => segment.text)
        .filter((text) => text && text.length > 0)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (!transcript) {
        throw new Error("Empty transcript after processing");
      }

      // Fetch video title from YouTube oEmbed API
      const title = await fetchVideoTitle(videoId);

      console.log(
        `Successfully fetched transcript on attempt ${attempt + 1}`,
      );
      return { transcript, title };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Attempt ${attempt + 1} failed: ${errorMessage}`);

      // If this was the last retry, throw the error
      if (attempt === retries) {
        throw error;
      }

      // Calculate exponential backoff delay
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw new Error("Max retries exceeded");
}

// Fallback to youtubei.js if primary method fails
async function fetchTranscriptWithYoutubeJS(videoId: string): Promise<{
  transcript: string;
  title: string;
}> {
  console.log("Attempting fallback to youtubei.js...");

  const youtube = await Innertube.create();
  const info = await youtube.getInfo(videoId);

  // Get title
  const title =
    (info.basic_info.title || (await fetchVideoTitle(videoId)) || "").trim();

  // Get transcript
  const transcriptData = await info.getTranscript();

  if (!transcriptData?.transcript?.content?.body?.initial_segments) {
    throw new Error("No transcript available via youtubei.js");
  }

  // Extract text from transcript segments
  const segments = transcriptData.transcript.content.body.initial_segments;
  const transcript = segments
    .map(
      (segment: { snippet?: { text?: string } }) => segment.snippet?.text || "",
    )
    .filter((text: string) => text.length > 0)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!transcript) {
    throw new Error("Empty transcript from youtubei.js");
  }

  console.log("Successfully fetched transcript via youtubei.js fallback");
  return { transcript, title };
}

// Helper to fetch video title from YouTube oEmbed
async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );
    if (!res.ok) return "";
    const data = (await res.json()) as { title?: unknown };
    return typeof data.title === "string" ? data.title.trim() : "";
  } catch {
    return "";
  }
}

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
    console.log(`Fetching transcript for video: ${videoId}`);

    // Try primary method with retries
    try {
      const result = await fetchTranscriptWithRetry(videoId);
      return NextResponse.json(result);
    } catch (primaryError) {
      const primaryErrorMessage =
        primaryError instanceof Error
          ? primaryError.message
          : "Unknown error";
      console.warn(
        `Primary method failed: ${primaryErrorMessage}. Trying fallback...`,
      );

      // Try fallback method
      const result = await fetchTranscriptWithYoutubeJS(videoId);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("All transcript fetch methods failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Provide helpful error messages
    let userMessage = `Failed to fetch transcript: ${errorMessage}.`;

    if (errorMessage.includes("disabled") || errorMessage.includes("captions")) {
      userMessage += " This video may not have captions available.";
    } else if (
      errorMessage.includes("blocked") ||
      errorMessage.includes("403") ||
      errorMessage.includes("429")
    ) {
      userMessage +=
        " YouTube may be temporarily blocking requests. Consider configuring a proxy in your environment variables (YOUTUBE_TRANSCRIPT_PROXY).";
    } else {
      userMessage +=
        " Please ensure the video exists and has captions enabled.";
    }

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
