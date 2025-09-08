import { Json } from '../services/database.types';

export const getTranslatedValue = (field: Json, lang: string, options: { noFallback?: boolean } = {}): string => {
  const language = lang.split('-')[0]; // 'pt-BR' -> 'pt'
  if (typeof field === 'object' && field !== null && !Array.isArray(field)) {
    if (language in field && typeof field[language] === 'string') {
      return field[language] as string;
    }

    if (options.noFallback) {
      return ''; // Return empty string if specific language not found and fallback is disabled
    }
    
    // Fallback to other languages if the preferred one isn't available
    if ('pt' in field && typeof field.pt === 'string') return field.pt;
    if ('en' in field && typeof field.en === 'string') return field.en;
    if ('es' in field && typeof field.es === 'string') return field.es;
  }
  if (typeof field === 'string') {
    return field;
  }
  // This will handle null, boolean, number, or empty object by converting to string.
  return String(field || '');
};