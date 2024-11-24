import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transcript, videoTitle } = await req.json();

    if (!transcript) {
      throw new Error('No transcript provided');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.4,
      }
    });

    // Create a prompt that includes context about the video
    const prompt = `Please provide a concise summary of the following YouTube video transcript. 
    Video Title: ${videoTitle || 'Untitled'}
    
    Transcript:
    ${transcript}
    
    Please structure the summary to be clear and informative, highlighting the main points and key takeaways.`;

    // Generate the summary
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

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