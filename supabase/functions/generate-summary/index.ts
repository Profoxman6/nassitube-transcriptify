import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, videoTitle, customPrompt } = await req.json();

    if (!transcript) {
      throw new Error('No transcript provided');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Create base prompt
    let prompt = `Please provide a summary of the following YouTube video transcript.
    Video Title: ${videoTitle || 'Untitled'}
    
    Transcript:
    ${transcript}
    
    Please structure the summary to be clear and informative, highlighting the main points and key takeaways.`;

    // Add custom instructions if provided
    if (customPrompt) {
      prompt += `\n\nAdditional Instructions: ${customPrompt}`;
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ summary }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error generating summary:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate summary',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});