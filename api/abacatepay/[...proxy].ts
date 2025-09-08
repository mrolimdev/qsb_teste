// This file acts as a server-side proxy for the AbacatePay API.
// It is designed to be deployed as a Vercel Edge Function.
// It resolves CORS issues and securely handles the API key.

// You MUST set the ABACATEPAY_API_KEY as an environment variable in your Vercel project settings.

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    // Reconstruct the target URL by taking the path and search params from the original request
    const path = requestUrl.pathname.replace('/api/abacatepay', '');
    const search = requestUrl.search; // This captures the query string (e.g., "?id=...")
    const abacatepayApiUrl = `https://api.abacatepay.com/v1${path}${search}`;

    // Get the API key from environment variables on the server
    const apiKey = process.env.ABACATEPAY_API_KEY;

    if (!apiKey) {
      console.error('ABACATEPAY_API_KEY environment variable not set.');
      return new Response(
        JSON.stringify({ error: { message: 'API key is not configured on the server.' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Copy original request headers, but remove host to avoid conflicts
    const headers = new Headers(request.headers);
    headers.delete('host');
    // Set the authorization header securely
    headers.set('Authorization', `Bearer ${apiKey}`);
    
    // Forward the request to the AbacatePay API
    const response = await fetch(abacatepayApiUrl, {
      method: request.method,
      headers: headers,
      // Only include body for methods that support it
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      redirect: 'follow',
    });

    // Create a new response to return to the client, copying headers and body
    const newHeaders = new Headers(response.headers);
    // Set CORS headers to allow the browser to read the response from our proxy
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: { message: 'An error occurred in the API proxy.' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}