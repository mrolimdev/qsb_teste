// config.ts

// The base URL for the AbacatePay API, which should be proxied by the server
// to avoid CORS issues and protect the API key. This path is handled by the
// Vercel Edge Function at /api/abacatepay/[...proxy].ts
export const ABACATEPAY_API_BASE_URL = '/api/abacatepay';

// DO NOT store the API key here. It must be added as an environment variable
// on your hosting platform (e.g., Vercel, Netlify) with the name ABACATEPAY_API_KEY.

export const PAYMENT_AMOUNT_CENTS = 4990;
export const SEND_CODE_WEBHOOK_URL = 'https://api.automacao.click/webhook/60267771-5373-455e-9b1c-a532379ed95c';
export const SEND_REPORT_WEBHOOK_URL = 'https://api.automacao.click/webhook/d0321eca-5759-4cc1-a023-12efd25b0494';
export const ADMIN_EMAIL = 'contato@marciorolim.com.br';
export const GA_TRACKING_ID = 'G-MPH04BBNKP';