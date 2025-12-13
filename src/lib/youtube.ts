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

export async function fetchTranscript(
  videoId: string,
): Promise<{ transcript: string; title: string }> {
  // Use our own API route to fetch transcript
  const response = await fetch(`/api/transcript?videoId=${videoId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch transcript");
  }

  const data = await response.json();

  if (data.transcript) {
    return {
      transcript: data.transcript,
      title: data.title || `Video ${videoId}`,
    };
  }

  throw new Error("Invalid transcript format");
}
