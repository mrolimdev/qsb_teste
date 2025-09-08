import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Character } from '../types';
import { SparklesIcon, UploadIcon, TranslateIcon, EditIcon, DeleteIcon, SpinnerIcon } from './icons';
import AICharacterModal from './AICharacterModal';
import ConfirmationModal from './ConfirmationModal';
import UpdateProgressModal from './UpdateProgressModal';
import LanguageFlags from './LanguageFlags';
import { getTranslatedValue } from '../utils/translation';
import { suggestNewCharacterName } from '../services/geminiService';
import { deleteCharacter, updateCharacterTranslations, upsertCharacter } from '../services/databaseService';
import { ENEAGRAMA_FILTER_NAMES } from '../constants';

interface CharactersAdminTabProps {
  characters: Character[];
  onEditCharacter: (character: Character) => void;
  onCreateWithAI: (characterName: string) => void;
  onRefreshCharacters: () => void;
  isGeneratingCharacter: boolean;
}

const CharactersAdminTab: React.FC<CharactersAdminTabProps> = ({
  characters,
  onEditCharacter,
  onCreateWithAI,
  onRefreshCharacters,
  isGeneratingCharacter,
}) => {
  const { t, i18n } = useTranslation();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateLangModalOpen, setIsUpdateLangModalOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set());
  const [isUpdatingLangs, setIsUpdatingLangs] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatusText, setUpdateStatusText] = useState('');

  const filteredCharacters = useMemo(() => {
    return characters.filter(c =>
      getTranslatedValue(c.name, i18n.language)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [characters, searchTerm, i18n.language]);

  const handleSuggestName = async (gender: 'male' | 'female' | 'any'): Promise<string | null> => {
    try {
      const existingNames = characters.map(c => getTranslatedValue(c.name, 'pt'));
      const suggestion = await suggestNewCharacterName(existingNames, gender);
      if (!suggestion) throw new Error(t('gemini_error_no_name'));
      return suggestion;
    } catch (error) {
      alert(t('alert_suggest_name_fail', { error: error instanceof Error ? error.message : String(error) }));
      return null;
    }
  };

  const confirmDeleteCharacter = (character: Character) => {
    setCharacterToDelete(character);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCharacter = async () => {
    if (!characterToDelete) return;
    try {
      await deleteCharacter(characterToDelete.id);
      alert(t('alert_char_deleted', { characterName: getTranslatedValue(characterToDelete.name, 'pt') }));
      onRefreshCharacters();
    } catch (error) {
      alert(t('alert_char_delete_fail'));
      console.error(error);
    }
  };

  const toggleCharacterSelection = (id: string) => {
    const newSelection = new Set(selectedCharacters);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedCharacters(newSelection);
  };
  
  const toggleSelectAll = () => {
    if (selectedCharacters.size === filteredCharacters.length) {
      setSelectedCharacters(new Set());
    } else {
      setSelectedCharacters(new Set(filteredCharacters.map(c => c.id)));
    }
  };

  const handleUpdateLanguages = async () => {
    const charactersToUpdate = characters.filter(c => selectedCharacters.has(c.id));
    if (charactersToUpdate.length === 0) {
      alert(t('admin_no_characters_selected'));
      return;
    }

    setIsUpdatingLangs(true);
    setUpdateProgress(0);
    setUpdateStatusText(t('admin_progress_status_start', { count: charactersToUpdate.length }));

    for (let i = 0; i < charactersToUpdate.length; i++) {
      const character = charactersToUpdate[i];
      const ptName = getTranslatedValue(character.name, 'pt');
      try {
        setUpdateStatusText(t('admin_progress_status_translating', { name: ptName, current: i + 1, total: charactersToUpdate.length }));
        await updateCharacterTranslations(character);
        setUpdateProgress(((i + 1) / charactersToUpdate.length) * 100);
      } catch (error) {
        setUpdateStatusText(t('admin_progress_status_error', { name: ptName }));
        console.error(`Error updating language for ${ptName}:`, error);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause on error
      }
    }

    setUpdateStatusText(t('admin_progress_status_complete', { count: charactersToUpdate.length }));
    onRefreshCharacters();
    // Don't close modal automatically, let user close it
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        try {
            // Basic CSV parsing - assumes no commas within fields
            const lines = text.split(/\r?\n/).filter(Boolean);
            const headers = lines[0].split(',').map(h => h.trim());
            const characterData = lines.slice(1).map(line => {
                const values = line.split(',');
                return headers.reduce((obj, header, index) => {
                    let value: any = values[index]?.trim() || '';
                    try {
                        // Attempt to parse fields that are expected to be JSON
                        if (['name', 'tagline', 'tags', 'description', 'analysis', 'strengthsInFaith', 'areasForVigilance', 'keyVerses', 'relationshipAnalyses', 'dailyDevotionals', 'studyPlan'].includes(header)) {
                            value = JSON.parse(value.replace(/^"|"$/g, '').replace(/""/g, '"'));
                        }
                    } catch (e) { /* Not a JSON string, keep as is */ }
                    obj[header] = value;
                    return obj;
                }, {} as any);
            });
            
            alert(t('alert_csv_import_success', { count: characterData.length }));

            for (const char of characterData) {
              await upsertCharacter(char as Character);
            }
            onRefreshCharacters();

        } catch (error) {
            alert(t('alert_csv_import_fail', {error: error instanceof Error ? error.message : ''}));
            console.error(error);
        }
    };
    reader.readAsText(file);
  };

  const openImportDialog = () => {
    document.getElementById('csv-importer')?.click();
  }

  const isMobile = window.innerWidth < 768;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button onClick={() => setIsAiModalOpen(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors">
          <SparklesIcon className="w-5 h-5" /> {t('admin_button_create_with_ai')}
        </button>
        <input type="file" id="csv-importer" accept=".csv" onChange={handleFileUpload} className="hidden" />
        <button onClick={openImportDialog} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
            <UploadIcon className="w-5 h-5" /> {t('admin_button_import_csv')}
        </button>
        <button onClick={() => setIsUpdateLangModalOpen(true)} disabled={selectedCharacters.size === 0} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-sm hover:bg-teal-700 transition-colors disabled:bg-stone-400">
          <TranslateIcon className="w-5 h-5" /> {t('admin_button_update_languages')} ({selectedCharacters.size})
        </button>
        <div className="flex-grow">
          <input type="text" placeholder={t('admin_search_placeholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border border-stone-300 rounded-lg shadow-sm" />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isMobile ? (
             <div className="space-y-3">
                 <div className="flex justify-between items-center p-2 bg-stone-50 rounded-md">
                     <div className="flex items-center">
                         <input type="checkbox" checked={selectedCharacters.size === filteredCharacters.length && filteredCharacters.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                         <label className="ml-2 text-sm font-medium text-stone-700">{t('admin_table_header_select_all')}</label>
                     </div>
                 </div>
                 {filteredCharacters.map(character => (
                    <div key={character.id} className="bg-white border border-stone-200 rounded-lg shadow-sm p-3 space-y-2">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <input type="checkbox" checked={selectedCharacters.has(character.id)} onChange={() => toggleCharacterSelection(character.id)} className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                                <img src={character.imageUrl || ''} alt={getTranslatedValue(character.name, i18n.language)} className="w-16 h-16 rounded-md object-cover bg-stone-100" />
                                <div>
                                    <p className="font-bold text-stone-800">{getTranslatedValue(character.name, i18n.language)}</p>
                                    <p className="text-xs text-stone-500 italic">{getTranslatedValue(character.tagline, i18n.language)}</p>
                                </div>
                            </div>
                             <LanguageFlags character={character} />
                        </div>
                        <div className="border-t pt-2 space-y-2">
                             <p className="text-sm"><span className="font-semibold">{t('admin_table_header_main_trait')}:</span> {t(ENEAGRAMA_FILTER_NAMES[character.mainTrait] || '')}</p>
                             <div className="flex items-center justify-end gap-2">
                                <button onClick={() => onEditCharacter(character)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-md"><EditIcon /></button>
                                <button onClick={() => confirmDeleteCharacter(character)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><DeleteIcon /></button>
                            </div>
                        </div>
                    </div>
                 ))}
             </div>
        ) : (
            <table className="min-w-full bg-white border border-stone-200">
                <thead className="bg-stone-50">
                <tr>
                    <th className="p-3 w-12 text-left"><input type="checkbox" checked={selectedCharacters.size === filteredCharacters.length && filteredCharacters.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" /></th>
                    <th className="p-3 text-left text-sm font-semibold text-stone-600">{t('admin_table_header_character')}</th>
                    <th className="p-3 text-left text-sm font-semibold text-stone-600">{t('admin_table_header_main_trait')}</th>
                    <th className="p-3 text-left text-sm font-semibold text-stone-600">Idiomas</th>
                    <th className="p-3 text-right text-sm font-semibold text-stone-600">{t('admin_table_header_actions')}</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                {filteredCharacters.map(character => (
                    <tr key={character.id}>
                    <td className="p-3"><input type="checkbox" checked={selectedCharacters.has(character.id)} onChange={() => toggleCharacterSelection(character.id)} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" /></td>
                    <td className="p-3">
                        <div className="flex items-center gap-3">
                        <img src={character.imageUrl || ''} alt={getTranslatedValue(character.name, i18n.language)} className="w-12 h-12 rounded-md object-cover bg-stone-100" />
                        <div>
                            <p className="font-bold text-stone-800">{getTranslatedValue(character.name, i18n.language)}</p>
                            <p className="text-xs text-stone-500 italic">{getTranslatedValue(character.tagline, i18n.language)}</p>
                        </div>
                        </div>
                    </td>
                    <td className="p-3 text-sm text-stone-600">{t(ENEAGRAMA_FILTER_NAMES[character.mainTrait] || '')}</td>
                    <td className="p-3"><LanguageFlags character={character} /></td>
                    <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onEditCharacter(character)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-md" aria-label={t('admin_edit_aria_label', {characterName: getTranslatedValue(character.name, 'pt')})}><EditIcon /></button>
                        <button onClick={() => confirmDeleteCharacter(character)} className="p-2 text-red-600 hover:bg-red-100 rounded-md" aria-label={t('admin_delete_aria_label', {characterName: getTranslatedValue(character.name, 'pt')})}><DeleteIcon /></button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )}
      </div>

      <AICharacterModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSubmit={onCreateWithAI}
        isLoading={isGeneratingCharacter}
        onSuggestName={handleSuggestName}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCharacter}
        titleKey="admin_confirm_action_title"
      >
        {t('admin_delete_confirmation', { characterName: characterToDelete ? getTranslatedValue(characterToDelete.name, 'pt') : '' })}
      </ConfirmationModal>
      <ConfirmationModal
        isOpen={isUpdateLangModalOpen}
        onClose={() => setIsUpdateLangModalOpen(false)}
        onConfirm={handleUpdateLanguages}
        titleKey="admin_confirm_action_title"
      >
        {t('admin_update_languages_confirmation', { count: selectedCharacters.size })}
      </ConfirmationModal>
      <UpdateProgressModal
        isOpen={isUpdatingLangs}
        onClose={() => setIsUpdatingLangs(false)}
        progress={updateProgress}
        statusText={updateStatusText}
      />
    </>
  );
};

export default CharactersAdminTab;
