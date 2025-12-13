export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function isPlaceholderTitle(title: string | undefined, videoId: string) {
  const t = (title || "").trim();
  return !t || t === `Video ${videoId}`;
}

export async function fetchVideoTitle(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );

    if (!res.ok) return null;
    const data = (await res.json()) as { title?: unknown };

    const title = typeof data.title === "string" ? data.title.trim() : "";
    return title ? title : null;
  } catch {
    return null;
  }
}

export async function fetchTranscript(
  videoId: string,
): Promise<{ transcript: string; title: string }> {
  const response = await fetch(`/api/transcript?videoId=${videoId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch transcript");
  }

  const data = (await response.json()) as {
    transcript?: string;
    title?: string;
  };

  if (data.transcript) {
    const resolvedTitle = isPlaceholderTitle(data.title, videoId)
      ? (await fetchVideoTitle(videoId)) || `Video ${videoId}`
      : data.title || `Video ${videoId}`;

    return {
      transcript: data.transcript,
      title: resolvedTitle,
    };
  }

  throw new Error("Invalid transcript format");
}
