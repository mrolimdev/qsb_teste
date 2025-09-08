import { ABACATEPAY_API_BASE_URL, PAYMENT_AMOUNT_CENTS } from '../config';
import { PaymentStatusData, PixQrCodeData } from '../types';

interface ApiResponse<T> {
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('API (via proxy) did not return JSON. Status:', response.status, 'Body:', text);
        throw new Error(`The API did not return a valid JSON response. Status: ${response.status}`);
    }
    
    const data: ApiResponse<T> = await response.json();

    if (data.error) {
        console.error('AbacatePay API Error Response (via proxy):', data.error);
        throw new Error(data.error.message || `API returned an error: ${JSON.stringify(data.error)}`);
    }

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    if (!data.data) {
        console.error('AbacatePay API response (via proxy) is missing the "data" field. Full response:', data);
        throw new Error('Invalid API response format: "data" field is missing.');
    }

    return data.data;
};

export const createPixQrCode = async (email: string): Promise<PixQrCodeData> => {
    try {
        const response = await fetch(`${ABACATEPAY_API_BASE_URL}/pixQrCode/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                metadata: {
                    externalId: email,
                },
                amount: PAYMENT_AMOUNT_CENTS,
            }),
        });
        return await handleResponse<PixQrCodeData>(response);
    } catch (error) {
        console.error("PIX QR Code creation failed. The proxy might be misconfigured or the AbacatePay API is down. Error object:", error);
        throw error;
    }
};

export const checkPixPaymentStatus = async (id: string): Promise<PaymentStatusData> => {
    try {
        const response = await fetch(`${ABACATEPAY_API_BASE_URL}/pixQrCode/${id}`, {
            method: 'GET',
        });
        return await handleResponse<PaymentStatusData>(response);
    } catch (error) {
        console.error(`PIX status check failed for ID ${id}. The proxy might be misconfigured or the AbacatePay API is down. Error object:`, error);
        throw error;
    }
};