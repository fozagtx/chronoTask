import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    // Truncate transcript if too long (OpenAI has token limits)
    const truncatedTranscript = transcript.slice(0, 15000);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an educational content analyzer. Given a video transcript, extract:
1. Key concepts (5-7 main ideas/topics covered)
2. Action tasks (6-10 actionable study tasks with time estimates)

Respond in JSON format:
{
  "concepts": ["concept 1", "concept 2", ...],
  "tasks": [
    {"id": "1", "title": "Task description", "duration": "X min", "completed": false},
    ...
  ]
}

Make tasks specific and actionable. Time estimates should be realistic (5-30 min each).`,
        },
        {
          role: 'user',
          content: `Analyze this video transcript and create a study plan:\n\n${truncatedTranscript}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(content);

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error('Error analyzing transcript:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze transcript';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
