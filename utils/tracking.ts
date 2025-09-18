declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  } else {
    console.warn(`Meta Pixel (fbq) not found. Event "${eventName}" not tracked.`);
  }
};
