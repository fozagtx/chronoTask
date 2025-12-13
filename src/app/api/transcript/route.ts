import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  try {
    // Use youtube-transcript package - simpler and more reliable
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptItems || transcriptItems.length === 0) {
      throw new Error('No transcript available for this video');
    }

    // Combine all transcript segments into a single text
    const transcript = transcriptItems
      .map((item: { text: string }) => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!transcript) {
      throw new Error('Empty transcript');
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch transcript: ${errorMessage}. This video may not have captions available.` },
      { status: 500 }
    );
  }
}
