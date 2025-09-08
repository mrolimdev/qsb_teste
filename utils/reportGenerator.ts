import { Character, UserInfo, KeyVerse } from '../types';
import { getTranslatedValue } from './translation';
import { Json } from '../services/database.types';
import i18next from 'i18next';

export const generateReportHtml = (
  character: Character,
  userInfo: UserInfo | null,
  personalizedAnalysis: Json | null,
  secondaryAnalysis: Json | null,
  i18n: typeof i18next
): string => {
  const t = i18n.t;
  const lang = i18n.language;

  const characterName = getTranslatedValue(character.name, lang);
  const userName = userInfo?.nome || t('you');

  const styles = {
    body: `font-family: 'Poppins', sans-serif; background-color: #f5f5f4; color: #44403c; margin: 0; padding: 20px;`,
    container: `max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);`,
    header: `background-color: #fef3c7; padding: 20px; text-align: center;`,
    logo: `width: 80px; height: auto; margin-bottom: 10px; border: 2px solid #92400e; border-radius: 9999px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);`,
    mainTitle: `font-family: 'Merriweather', serif; font-size: 28px; color: #92400e; margin: 0;`,
    content: `padding: 20px 30px;`,
    sectionTitle: `font-family: 'Merriweather', serif; font-size: 20px; color: #1c1917; border-bottom: 2px solid #fcd34d; padding-bottom: 8px; margin-top: 20px; margin-bottom: 15px;`,
    characterName: `font-family: 'Playfair Display', serif; font-size: 36px; color: #b45309; margin-top: 10px; margin-bottom: 5px; text-align: center;`,
    tagline: `font-style: italic; font-size: 18px; color: #57534e; text-align: center; margin-bottom: 20px;`,
    paragraph: `font-size: 16px; line-height: 1.6; color: #44403c; margin-bottom: 15px;`,
    verseBlock: `background-color: #f5f5f4; padding: 15px; border-radius: 8px; margin-bottom: 10px;`,
    verseText: `font-style: italic; color: #57534e;`,
    verseRef: `text-align: right; font-weight: 600; color: #b45309; margin-top: 5px;`,
    footer: `text-align: center; padding: 20px; font-size: 12px; color: #78716c;`
  };
  
  const renderSection = (titleKey: string, content: string | null) => {
    if (!content) return '';
    const title = t(titleKey, { characterName });
    return `
      <h3 style="${styles.sectionTitle}">${title}</h3>
      <p style="${styles.paragraph}">${content}</p>
    `;
  };

  const renderKeyVerses = () => {
    const verses = Array.isArray(character.keyVerses) ? (character.keyVerses as unknown as KeyVerse[]) : [];
    if (verses.length === 0) return '';
    
    return `
      <h3 style="${styles.sectionTitle}">${t('results_key_verses')}</h3>
      ${verses.map(verse => `
        <div style="${styles.verseBlock}">
          <blockquote style="${styles.verseText}">"${getTranslatedValue(verse.texto, lang)}"</blockquote>
          <p style="${styles.verseRef}">${getTranslatedValue(verse.referencia, lang)}</p>
        </div>
      `).join('')}
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t('app_title')}</title>
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    </head>
    <body style="${styles.body}">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <img src="https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Fundo%20de%20Quem%20sou%20eu%20na%20Biblia%202025%20(1)%20Removido.png" alt="${t('logo_alt')}" style="${styles.logo}">
          <h1 style="${styles.mainTitle}">${t('app_title')}</h1>
        </div>
        <div style="${styles.content}">
          <p style="text-align: center; font-size: 18px; color: #57534e;">${t('results_you_are_like', { name: userName })}</p>
          <h2 style="${styles.characterName}">${characterName}</h2>
          <p style="${styles.tagline}">${getTranslatedValue(character.tagline, lang)}</p>
          
          ${renderSection('results_who_was', getTranslatedValue(character.description, lang))}
          ${renderSection('results_personality_analysis', getTranslatedValue(character.analysis, lang))}
          ${personalizedAnalysis ? renderSection('results_compatibility_analysis', getTranslatedValue(personalizedAnalysis, lang)) : ''}
          ${secondaryAnalysis ? `
              <h3 style="${styles.sectionTitle}">${t('secondary_traits_title')}</h3>
              <p style="${styles.paragraph}">${getTranslatedValue(secondaryAnalysis, lang)}</p>
          ` : ''}

          <h3 style="${styles.sectionTitle}">${t('results_growth_journey')}</h3>
          <h4 style="font-weight: 700; font-size: 16px; color: #15803d;">${t('results_strengths')}</h4>
          <p style="${styles.paragraph}">${getTranslatedValue(character.strengthsInFaith, lang)}</p>
          <h4 style="font-weight: 700; font-size: 16px; color: #b91c1c;">${t('results_vigilance_areas')}</h4>
          <p style="${styles.paragraph}">${getTranslatedValue(character.areasForVigilance, lang)}</p>

          ${renderKeyVerses()}
        </div>
        <div style="${styles.footer}">
          <p>${t('footer_brand')} &copy; 2025 - ${t('footer_copyright')}</p>
          <p>${t('footer_rights')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
