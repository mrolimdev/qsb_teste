export type BibleBookMap = {
    [key: string]: {
        pt: string;
        en: string;
        es: string;
    };
};

// Based on standard Protestant canon
export const BIBLE_BOOK_MAP: BibleBookMap = {
    // Old Testament
    'Gênesis': { pt: 'Gênesis', en: 'Genesis', es: 'Génesis' },
    'Êxodo': { pt: 'Êxodo', en: 'Exodus', es: 'Éxodo' },
    'Levítico': { pt: 'Levítico', en: 'Leviticus', es: 'Levítico' },
    'Números': { pt: 'Números', en: 'Numbers', es: 'Números' },
    'Deuteronômio': { pt: 'Deuteronômio', en: 'Deuteronomy', es: 'Deuteronomio' },
    'Josué': { pt: 'Josué', en: 'Joshua', es: 'Josué' },
    'Juízes': { pt: 'Juízes', en: 'Judges', es: 'Jueces' },
    'Rute': { pt: 'Rute', en: 'Ruth', es: 'Rut' },
    '1 Samuel': { pt: '1 Samuel', en: '1 Samuel', es: '1 Samuel' },
    '2 Samuel': { pt: '2 Samuel', en: '2 Samuel', es: '2 Samuel' },
    '1 Reis': { pt: '1 Reis', en: '1 Kings', es: '1 Reyes' },
    '2 Reis': { pt: '2 Reis', en: '2 Kings', es: '2 Reyes' },
    '1 Crônicas': { pt: '1 Crônicas', en: '1 Chronicles', es: '1 Crónicas' },
    '2 Crônicas': { pt: '2 Crônicas', en: '2 Chronicles', es: '2 Crónicas' },
    'Esdras': { pt: 'Esdras', en: 'Ezra', es: 'Esdras' },
    'Neemias': { pt: 'Neemias', en: 'Nehemiah', es: 'Nehemías' },
    'Ester': { pt: 'Ester', en: 'Esther', es: 'Ester' },
    'Jó': { pt: 'Jó', en: 'Job', es: 'Job' },
    'Salmos': { pt: 'Salmos', en: 'Psalms', es: 'Salmos' },
    'Provérbios': { pt: 'Provérbios', en: 'Proverbs', es: 'Proverbios' },
    'Eclesiastes': { pt: 'Eclesiastes', en: 'Ecclesiastes', es: 'Eclesiastés' },
    'Cantares': { pt: 'Cantares', en: 'Song of Solomon', es: 'Cantares' },
    'Isaías': { pt: 'Isaías', en: 'Isaiah', es: 'Isaías' },
    'Jeremias': { pt: 'Jeremias', en: 'Jeremiah', es: 'Jeremías' },
    'Lamentações': { pt: 'Lamentações', en: 'Lamentations', es: 'Lamentaciones' },
    'Ezequiel': { pt: 'Ezequiel', en: 'Ezekiel', es: 'Ezequiel' },
    'Daniel': { pt: 'Daniel', en: 'Daniel', es: 'Daniel' },
    'Oséias': { pt: 'Oséias', en: 'Hosea', es: 'Oseas' },
    'Joel': { pt: 'Joel', en: 'Joel', es: 'Joel' },
    'Amós': { pt: 'Amós', en: 'Amos', es: 'Amós' },
    'Obadias': { pt: 'Obadias', en: 'Obadiah', es: 'Abdías' },
    'Jonas': { pt: 'Jonas', en: 'Jonah', es: 'Jonás' },
    'Miquéias': { pt: 'Miquéias', en: 'Micah', es: 'Miqueas' },
    'Naum': { pt: 'Naum', en: 'Nahum', es: 'Nahúm' },
    'Habacuque': { pt: 'Habacuque', en: 'Habakkuk', es: 'Habacuc' },
    'Sofonias': { pt: 'Sofonias', en: 'Zephaniah', es: 'Sofonías' },
    'Ageu': { pt: 'Ageu', en: 'Haggai', es: 'Hageo' },
    'Zacarias': { pt: 'Zacarias', en: 'Zechariah', es: 'Zacarías' },
    'Malaquias': { pt: 'Malaquias', en: 'Malachi', es: 'Malaquías' },
    // New Testament
    'Mateus': { pt: 'Mateus', en: 'Matthew', es: 'Mateo' },
    'Marcos': { pt: 'Marcos', en: 'Mark', es: 'Marcos' },
    'Lucas': { pt: 'Lucas', en: 'Luke', es: 'Lucas' },
    'João': { pt: 'João', en: 'John', es: 'Juan' },
    'Atos': { pt: 'Atos', en: 'Acts', es: 'Hechos' },
    'Romanos': { pt: 'Romanos', en: 'Romans', es: 'Romanos' },
    '1 Coríntios': { pt: '1 Coríntios', en: '1 Corinthians', es: '1 Corintios' },
    '2 Coríntios': { pt: '2 Coríntios', en: '2 Corinthians', es: '2 Corintios' },
    'Gálatas': { pt: 'Gálatas', en: 'Galatians', es: 'Gálatas' },
    'Efésios': { pt: 'Efésios', en: 'Ephesians', es: 'Efesios' },
    'Filipenses': { pt: 'Filipenses', en: 'Philippians', es: 'Filipenses' },
    'Colossenses': { pt: 'Colossenses', en: 'Colossians', es: 'Colosenses' },
    '1 Tessalonicenses': { pt: '1 Tessalonicenses', en: '1 Thessalonians', es: '1 Tesalonicenses' },
    '2 Tessalonicenses': { pt: '2 Tessalonicenses', en: '2 Thessalonians', es: '2 Tesalonicenses' },
    '1 Timóteo': { pt: '1 Timóteo', en: '1 Timothy', es: '1 Timoteo' },
    '2 Timóteo': { pt: '2 Timóteo', en: '2 Timothy', es: '2 Timoteo' },
    'Tito': { pt: 'Tito', en: 'Titus', es: 'Tito' },
    'Filemom': { pt: 'Filemom', en: 'Philemon', es: 'Filemón' },
    'Hebreus': { pt: 'Hebreus', en: 'Hebrews', es: 'Hebreos' },
    'Tiago': { pt: 'Tiago', en: 'James', es: 'Santiago' },
    '1 Pedro': { pt: '1 Pedro', en: '1 Peter', es: '1 Pedro' },
    '2 Pedro': { pt: '2 Pedro', en: '2 Peter', es: '2 Pedro' },
    '1 João': { pt: '1 João', en: '1 John', es: '1 Juan' },
    '2 João': { pt: '2 João', en: '2 John', es: '2 Juan' },
    '3 João': { pt: '3 João', en: '3 John', es: '3 Juan' },
    'Judas': { pt: 'Judas', en: 'Jude', es: 'Judas' },
    'Apocalipse': { pt: 'Apocalipse', en: 'Revelation', es: 'Apocalipsis' }
};

export const translateBookName = (reference: string): { pt: string, en: string, es: string } => {
    if (!reference || typeof reference !== 'string') {
        return { pt: '', en: '', es: '' };
    }
    // Match the book name (could be one or two words, like "1 Samuel")
    const match = reference.match(/^(\d?\s?[a-zA-Z\u00C0-\u017F]+)\s/);
    if (!match) {
        return { pt: reference, en: reference, es: reference }; // Return original if no book name found
    }

    const bookNamePt = match[1].trim();
    const versePart = reference.substring(match[0].length);
    
    const bookTranslations = BIBLE_BOOK_MAP[bookNamePt];

    if (bookTranslations) {
        return {
            pt: `${bookTranslations.pt} ${versePart}`,
            en: `${bookTranslations.en} ${versePart}`,
            es: `${bookTranslations.es} ${versePart}`,
        };
    }
    
    // Fallback if book not in map
    return { pt: reference, en: reference, es: reference };
};