import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

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
    // Use youtubei.js - more reliable and maintained
    const youtube = await Innertube.create();
    
    // Fetch the video info
    const info = await youtube.getInfo(videoId);
    
    // Get the transcript data
    const transcriptData = await info.getTranscript();
    
    if (!transcriptData?.transcript?.content?.body?.initial_segments) {
      throw new Error('No transcript available for this video');
    }
    
    // Extract text from transcript segments
    const lines = transcriptData.transcript.content.body.initial_segments.map(
      (segment: { snippet: { text: string } }) => segment.snippet.text
    );
    
    const transcript = lines.join(' ').replace(/\s+/g, ' ').trim();
    
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
