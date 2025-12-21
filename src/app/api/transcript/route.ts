import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time timeout
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TranscriptErrorCode =
  | "MISSING_CAPTIONS"
  | "VIDEO_NOT_FOUND"
  | "RATE_LIMITED"
  | "BLOCKED"
  | "BAD_REQUEST"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

function extractUpstreamStatus(error: unknown): number | null {
  const e = error as {
    status?: unknown;
    statusCode?: unknown;
    code?: unknown;
    response?: { status?: unknown };
  };

  if (typeof e?.status === "number") return e.status;
  if (typeof e?.statusCode === "number") return e.statusCode;
  if (typeof e?.code === "number") return e.code;
  if (typeof e?.response?.status === "number") return e.response.status;

  const msg = error instanceof Error ? error.message : String(error);
  const match =
    msg.match(/status code\s+(\d{3})/i) || msg.match(/status\s+(\d{3})/i);
  if (match?.[1]) {
    const parsed = Number.parseInt(match[1], 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function classifyTranscriptError(error: unknown): {
  status: number;
  code: TranscriptErrorCode;
  userMessage: string;
  rawMessage: string;
} {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const status = extractUpstreamStatus(error);
  const msg = rawMessage.toLowerCase();

  const looksLikeMissingCaptions =
    msg.includes("no transcript") ||
    msg.includes("captions") ||
    msg.includes("subtitles") ||
    msg.includes("transcript is disabled") ||
    (status === 400 && msg.includes("get_transcript"));

  if (looksLikeMissingCaptions) {
    return {
      status: 404,
      code: "MISSING_CAPTIONS",
      userMessage: "No captions/transcript are available for this video.",
      rawMessage,
    };
  }

  const looksLikeVideoNotFound =
    status === 404 ||
    msg.includes("video unavailable") ||
    msg.includes("not found") ||
    msg.includes("private") ||
    msg.includes("unavailable");

  if (looksLikeVideoNotFound) {
    return {
      status: 404,
      code: "VIDEO_NOT_FOUND",
      userMessage:
        "This video is unavailable (private, removed, or not found).",
      rawMessage,
    };
  }

  if (status === 429 || msg.includes(" 429") || msg.includes("429")) {
    return {
      status: 429,
      code: "RATE_LIMITED",
      userMessage:
        "YouTube is rate limiting transcript requests. Please try again in a bit.",
      rawMessage,
    };
  }

  if (
    status === 403 ||
    msg.includes(" 403") ||
    msg.includes("403") ||
    msg.includes("blocked")
  ) {
    return {
      status: 403,
      code: "BLOCKED",
      userMessage:
        "YouTube blocked this transcript request. Try again later or configure a proxy (YOUTUBE_TRANSCRIPT_PROXY).",
      rawMessage,
    };
  }

  if (status === 400) {
    return {
      status: 400,
      code: "BAD_REQUEST",
      userMessage:
        "Invalid request. Please double-check the YouTube video URL/ID and try again.",
      rawMessage,
    };
  }

  if (status && status >= 500) {
    return {
      status: 502,
      code: "UPSTREAM_ERROR",
      userMessage:
        "YouTube returned an upstream error while fetching the transcript. Please try again later.",
      rawMessage,
    };
  }

  return {
    status: 500,
    code: "INTERNAL_ERROR",
    userMessage: "Failed to fetch transcript.",
    rawMessage,
  };
}

// Helper function to fetch transcript with retries and exponential backoff
async function fetchTranscriptWithRetry(
  videoId: string,
  retries = MAX_RETRIES,
): Promise<{ transcript: string; title: string }> {
  // Dynamic import to avoid build-time execution
  const { fetchTranscript } = await import("youtube-transcript-plus");

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(
        `Attempting to fetch transcript (attempt ${attempt + 1}/${retries + 1})...`,
      );

      // Fetch transcript using youtube-transcript-plus
      const transcriptData = await fetchTranscript(videoId, {
        lang: "en",
      });

      if (
        !transcriptData ||
        !Array.isArray(transcriptData) ||
        transcriptData.length === 0
      ) {
        throw new Error("No transcript data received");
      }

      // Extract and format transcript text from snippets
      const transcript = transcriptData
        .map((segment: { text: string }) => segment.text)
        .filter((text: string) => text && text.length > 0)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (!transcript) {
        throw new Error("Empty transcript after processing");
      }

      // Fetch video title from YouTube oEmbed API
      const title = await fetchVideoTitle(videoId);

      console.log(`Successfully fetched transcript on attempt ${attempt + 1}`);
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

  // Dynamic import to avoid build-time execution
  const { Innertube } = await import("youtubei.js");

  const youtube = await Innertube.create();
  const info = await youtube.getInfo(videoId);

  // Get title
  const title = (
    info.basic_info.title ||
    (await fetchVideoTitle(videoId)) ||
    ""
  ).trim();

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
      return NextResponse.json({
        success: true,
        hasTranscript: true,
        ...result,
      });
    } catch (primaryError) {
      const primaryErrorMessage =
        primaryError instanceof Error ? primaryError.message : "Unknown error";
      console.warn(
        `Primary method failed: ${primaryErrorMessage}. Trying fallback...`,
      );

      // Try fallback method
      const result = await fetchTranscriptWithYoutubeJS(videoId);
      return NextResponse.json({
        success: true,
        hasTranscript: true,
        ...result,
      });
    }
  } catch (error) {
    const classified = classifyTranscriptError(error);

    if (classified.status >= 500) {
      console.error("All transcript fetch methods failed:", error);
    } else {
      console.warn("Transcript unavailable:", classified.rawMessage);
    }

    const body: {
      success: false;
      hasTranscript: false;
      error: string;
      code: TranscriptErrorCode;
      details?: string;
    } = {
      success: false,
      hasTranscript: false,
      error: classified.userMessage,
      code: classified.code,
    };

    if (process.env.NODE_ENV !== "production") {
      body.details = classified.rawMessage;
    }

    // Return 200 for missing captions to avoid browser console 404 errors
    // Only return error status codes for actual server/network errors
    if (
      classified.code === "MISSING_CAPTIONS" ||
      classified.code === "VIDEO_NOT_FOUND"
    ) {
      return NextResponse.json(body, { status: 200 });
    }

    return NextResponse.json(body, { status: classified.status });
  }
}
