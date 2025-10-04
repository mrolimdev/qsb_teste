// This file acts as a server-side proxy for the Google Gemini API.
// It is designed to be deployed as a Vercel Edge Function.
// It resolves API key security issues by handling the key on the server.

// You MUST set the GEMINI_KEY as an environment variable in your Vercel project settings.

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  try {
    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      console.error('GEMINI_KEY environment variable not set on Vercel.');
      return new Response(
        JSON.stringify({ error: { message: 'API key is not configured on the server.' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Reconstruct the target Gemini API URL
    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname.replace('/api/gemini', ''); // -> /v1beta/models/gemini-2.5-flash:generateContent
    const targetUrl = `https://generativelanguage.googleapis.com${path}?key=${apiKey}`;

    // Forward the original request body to the Gemini API
    const response = await fetch(targetUrl, {
      method: 'POST', // Gemini API for generateContent uses POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body,
    });

    // Return the response from Gemini directly back to the client
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    console.error('Gemini Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: { message: 'An error occurred in the Gemini API proxy.' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}