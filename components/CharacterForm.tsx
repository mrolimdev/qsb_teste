import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Character, EneagramaTrait, KeyVerse } from '../types';
import type { Json } from '../services/database.types';
import { upsertCharacter } from '../services/databaseService';
import { ENEAGRAMA_FILTER_NAMES } from '../constants';
import { getTranslatedValue } from '../utils/translation';
import { PlusIcon, DeleteIcon } from './icons';

interface CharacterFormProps {
  characterToEdit: Character | null;
  onFormSubmit: () => void;
  onCancel: () => void;
}

const emptyMultilingualField = { pt: '', en: '', es: '' };

const ensureMultilingual = (field: any): { pt: string; en: string; es: string } => {
  if (typeof field === 'object' && field !== null && 'pt' in field) {
    return { pt: field.pt || '', en: field.en || '', es: field.es || '' };
  }
  const value = String(field || '');
  return { pt: value, en: '', es: '' };
};

const emptyCharacter: Character = {
  id: '', name: emptyMultilingualField, mainTrait: EneagramaTrait.INTEGRO, tagline: emptyMultilingualField, imageUrl: '',
  imagePromptDescription: '', tags: [], gender: 'other', description: emptyMultilingualField, analysis: emptyMultilingualField,
  strengthsInFaith: emptyMultilingualField, areasForVigilance: emptyMultilingualField, keyVerses: [], relationshipAnalyses: [],
  dailyDevotionals: [], studyPlan: { readings: [], reflectionQuestions: [], prayer: emptyMultilingualField }, audio: ''
};

type LanguageKey = 'pt' | 'en' | 'es';

const CharacterForm: React.FC<CharacterFormProps> = ({ characterToEdit, onFormSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [character, setCharacter] = useState<Character>(characterToEdit || emptyCharacter);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<LanguageKey>('pt');

  useEffect(() => {
    setCharacter(characterToEdit || emptyCharacter);
  }, [characterToEdit]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
  };

  const handleMultilingualChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof Character
  ) => {
    const { value } = e.target;
    const currentField = character[fieldName];
    const newField = { ...ensureMultilingual(currentField), [activeLang]: value };
    
    let newCharacterState = { ...character, [fieldName]: newField };

    if (fieldName === 'name' && !characterToEdit) {
      const slug = generateSlug(newField.pt); // Slug is always based on Portuguese name
      newCharacterState = { ...newCharacterState, id: slug };
    }
    
    setCharacter(newCharacterState);
  };
  
  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTagsString = e.target.value;
    const newTagsArray = newTagsString.split(',').map(tag => tag.trim()).filter(Boolean);

    setCharacter(prev => {
        const currentTags = Array.isArray(prev.tags) ? [...prev.tags] as any[] : [];
        const updatedTags = newTagsArray.map((newTagText, index) => {
            const existingTag = currentTags[index] && typeof currentTags[index] === 'object' 
                                ? currentTags[index] 
                                : { pt: '', en: '', es: '' };
            return {
                ...existingTag,
                [activeLang]: newTagText
            };
        });
        return { ...prev, tags: updatedTags };
    });
  };

  const getTagsForLang = (lang: LanguageKey): string => {
      if (!Array.isArray(character.tags)) return '';
      return (character.tags as Json[]).map(tag => getTranslatedValue(tag, lang)).join(', ');
  };
  
  const handleKeyVerseChange = (index: number, field: 'texto' | 'referencia', value: string) => {
    const updatedKeyVerses = [...(Array.isArray(character.keyVerses) ? character.keyVerses as unknown as KeyVerse[] : [])];
    const targetField = updatedKeyVerses[index][field];
    const newField = { ...ensureMultilingual(targetField), [activeLang]: value };
    updatedKeyVerses[index][field] = newField;
    setCharacter(prev => ({...prev, keyVerses: updatedKeyVerses as unknown as Json}));
  };
  
  const addKeyVerse = () => {
    const newVerse: KeyVerse = { texto: {pt: '', en: '', es: ''}, referencia: {pt: '', en: '', es: ''}};
    setCharacter(prev => {
        const currentVerses = Array.isArray(prev.keyVerses) ? prev.keyVerses as unknown as KeyVerse[] : [];
        return {...prev, keyVerses: [...currentVerses, newVerse] as unknown as Json };
    });
  };
  
  const removeKeyVerse = (index: number) => {
    const updatedKeyVerses = (Array.isArray(character.keyVerses) ? character.keyVerses as unknown as KeyVerse[] : []).filter((_, i) => i !== index);
    setCharacter(prev => ({...prev, keyVerses: updatedKeyVerses as unknown as Json}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ptName = getTranslatedValue(character.name, 'pt');
    if (!character.id || !ptName) {
        alert(t('alert_char_form_id_empty'));
        return;
    }
    setLoading(true);
    try {
      await upsertCharacter(character);
      alert(t('alert_char_form_save_success', { characterName: ptName }));
      onFormSubmit();
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      const errorMessage = error instanceof Error ? error.message : t('alert_char_form_error_unknown');
      alert(t('alert_char_form_save_fail', { error: errorMessage }));
    } finally {
      setLoading(false);
    }
  };
  
  const renderMultilingualField = (labelKey: string, name: keyof Character, type: 'textarea' | 'text' = 'text', required = false) => (
    <div className="mb-4">
      <label htmlFor={`${name}-${activeLang}`} className="block text-sm font-medium text-stone-700 mb-1">{t(labelKey)}</label>
      {type === 'textarea' ? (
        <textarea id={`${name}-${activeLang}`} name={name} value={getTranslatedValue(character[name], activeLang)} onChange={(e) => handleMultilingualChange(e, name)} rows={4} required={required} className="w-full p-2 border border-stone-300 rounded-md shadow-sm" />
      ) : (
        <input type="text" id={`${name}-${activeLang}`} name={name} value={getTranslatedValue(character[name], activeLang)} onChange={(e) => handleMultilingualChange(e, name)} required={required} className="w-full p-2 border border-stone-300 rounded-md shadow-sm" />
      )}
    </div>
  );

  const LangButton: React.FC<{ lang: LanguageKey, label: string }> = ({ lang, label }) => (
    <button type="button" onClick={() => setActiveLang(lang)} className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${activeLang === lang ? 'border-amber-600 text-amber-700 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
      {label}
    </button>
  );
  
  const keyVerses = Array.isArray(character.keyVerses) ? (character.keyVerses as unknown as KeyVerse[]) : [];

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">{characterToEdit ? t('char_form_title_edit', { characterName: getTranslatedValue(characterToEdit.name, 'pt') }) : t('char_form_title_create')}</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-stone-700 mb-1">{t('char_form_label_id')}</label>
              <input type="text" id="id" name="id" value={character.id || ''} onChange={handleSimpleChange} className="w-full p-2 border border-stone-300 rounded-md shadow-sm bg-stone-100 text-stone-500" disabled required/>
              <p className="mt-1 text-xs text-stone-500">{characterToEdit ? t('char_form_id_help_edit') : t('char_form_id_help_create')}</p>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-700 mb-1">{t('char_form_label_image_url')}</label>
              <input type="text" id="imageUrl" name="imageUrl" value={character.imageUrl || ''} onChange={handleSimpleChange} className="w-full p-2 border border-stone-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="audio" className="block text-sm font-medium text-stone-700 mb-1">{t('char_form_label_audio_url')}</label>
              <input type="text" id="audio" name="audio" value={character.audio || ''} onChange={handleSimpleChange} className="w-full p-2 border border-stone-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-stone-700 mb-1">{t('char_form_label_gender')}</label>
              <select id="gender" name="gender" value={character.gender} onChange={handleSimpleChange} className="w-full p-2 border border-stone-300 rounded-md shadow-sm">
                  <option value='male'>{t('gender_male')}</option>
                  <option value='female'>{t('gender_female')}</option>
                  <option value='other'>{t('gender_other')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="mainTrait" className="block text-sm font-medium text-stone-700 mb-1">{t('char_form_label_main_trait')}</label>
              <select id="mainTrait" name="mainTrait" value={character.mainTrait} onChange={handleSimpleChange} className="w-full p-2 border border-stone-300 rounded-md shadow-sm">
                  {Object.entries(ENEAGRAMA_FILTER_NAMES).filter(([key]) => key !== 'all').map(([value, labelKey]) => (
                      <option key={value} value={value}>{t(labelKey)}</option>
                  ))}
              </select>
            </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="border-b border-stone-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              <LangButton lang="pt" label="Português" />
              <LangButton lang="en" label="English" />
              <LangButton lang="es" label="Español" />
            </nav>
          </div>
          <div className="pt-4">
            {renderMultilingualField('char_form_label_name', 'name', 'text', true)}
            {renderMultilingualField('char_form_label_tagline', 'tagline')}
            <div className="mb-4">
                <label htmlFor={`tags-${activeLang}`} className="block text-sm font-medium text-stone-700 mb-1">{t('char_form_label_tags')}</label>
                <input type="text" id={`tags-${activeLang}`} name="tags" value={getTagsForLang(activeLang)} onChange={handleTagsChange} className="w-full p-2 border border-stone-300 rounded-md shadow-sm" />
            </div>
            {renderMultilingualField('char_form_label_description', 'description', 'textarea')}
            {renderMultilingualField('char_form_label_analysis', 'analysis', 'textarea')}
            {renderMultilingualField('char_form_label_strengths', 'strengthsInFaith', 'textarea')}
            {renderMultilingualField('char_form_label_vigilance', 'areasForVigilance', 'textarea')}

            <div className="mt-4 pt-4 border-t">
                <h3 className="text-lg font-medium text-stone-800 mb-2">{t('char_form_subtitle_key_verses')}</h3>
                {keyVerses.map((verse, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-2 mb-2 p-2 border rounded-md">
                        <textarea value={getTranslatedValue(verse.texto, activeLang)} onChange={(e) => handleKeyVerseChange(index, 'texto', e.target.value)} placeholder={t('char_form_placeholder_verse_text')} rows={2} className="w-full p-2 border border-stone-300 rounded-md shadow-sm" />
                        <input type="text" value={getTranslatedValue(verse.referencia, activeLang) || ''} onChange={(e) => handleKeyVerseChange(index, 'referencia', e.target.value)} placeholder={t('char_form_placeholder_verse_ref')} className="w-full md:w-48 p-2 border border-stone-300 rounded-md shadow-sm" />
                        <button type="button" onClick={() => removeKeyVerse(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><DeleteIcon /></button>
                    </div>
                ))}
                <button type="button" onClick={addKeyVerse} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-stone-200 hover:bg-stone-300 rounded-md"><PlusIcon className="w-4 h-4" /> {t('button_add_verse')}</button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-stone-200 text-stone-800 font-semibold rounded-lg hover:bg-stone-300">{t('button_cancel')}</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 disabled:bg-stone-400">
            {loading ? t('button_saving') : t('button_save_character')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterForm;