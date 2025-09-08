import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Character, UserProfile } from '../types';
import CharactersAdminTab from './CharactersAdminTab';
import UsersAdminTab from './UsersAdminTab';
import { BookOpenIcon, UsersIcon } from './icons';

interface AdminScreenProps {
  characters: Character[];
  onEditCharacter: (character: Character) => void;
  onCreateWithAI: (characterName: string) => void;
  onRefreshCharacters: () => void;
  isGeneratingCharacter: boolean;
  onViewUserReport: (user: UserProfile) => void;
}

type AdminTab = 'characters' | 'users';

const AdminScreen: React.FC<AdminScreenProps> = (props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const TabButton: React.FC<{ tabName: AdminTab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base font-semibold rounded-t-lg border-b-2 transition-colors ${
        activeTab === tabName
          ? 'text-amber-600 border-amber-600'
          : 'text-stone-500 border-transparent hover:text-stone-700 hover:border-stone-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-6xl p-4 sm:p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-800">{t('admin_title')}</h2>
      </div>

      <div className="border-b border-stone-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <TabButton tabName="users" label={t('admin_tab_users')} icon={<UsersIcon className="w-5 h-5" />} />
          <TabButton tabName="characters" label={t('admin_tab_characters')} icon={<BookOpenIcon className="w-5 h-5" />} />
        </nav>
      </div>

      <div className="pt-6">
        {activeTab === 'users' && (
          <UsersAdminTab 
            onViewReport={props.onViewUserReport}
          />
        )}
        {activeTab === 'characters' && (
          <CharactersAdminTab
            characters={props.characters}
            onEditCharacter={props.onEditCharacter}
            onCreateWithAI={props.onCreateWithAI}
            onRefreshCharacters={props.onRefreshCharacters}
            isGeneratingCharacter={props.isGeneratingCharacter}
          />
        )}
      </div>
    </div>
  );
};

export default AdminScreen;