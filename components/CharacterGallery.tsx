import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ENEAGRAMA_FILTER_NAMES } from '../constants';
import { Character } from '../types';
import CharacterCard from './CharacterCard';
import { FilterIcon } from './icons';
import Loader from './Loader';
import { getTranslatedValue } from '../utils/translation';

interface CharacterGalleryProps {
  characters: Character[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectCharacter: (character: Character) => void;
  onStartTest: () => void;
  hasPreviousResult?: boolean;
}

const CharacterGallery: React.FC<CharacterGalleryProps> = ({ characters, isLoading, onRefresh, onSelectCharacter, onStartTest, hasPreviousResult }) => {
  const { t, i18n } = useTranslation();
  const [genderFilter, setGenderFilter] = useState('all'); // 'all', 'male', 'female'
  const [profileFilter, setProfileFilter] = useState('all');
  const [audioFilter, setAudioFilter] = useState('all'); // 'all', 'with', 'without'
  const [sortOrder, setSortOrder] = useState('random'); // 'alpha', 'random'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const shuffledCharacters = useMemo(() => {
    return [...characters].sort(() => Math.random() - 0.5);
  }, [characters]);

  const filteredAndSortedCharacters = useMemo(() => {
    let currentCharacters;

    if (sortOrder === 'random') {
      currentCharacters = [...shuffledCharacters];
    } else {
      currentCharacters = [...characters].sort((a, b) => getTranslatedValue(a.name, i18n.language).localeCompare(getTranslatedValue(b.name, i18n.language)));
    }

    if (genderFilter !== 'all') {
        currentCharacters = currentCharacters.filter(c => c.gender === genderFilter);
    }

    if (profileFilter !== 'all') {
        currentCharacters = currentCharacters.filter(c => c.mainTrait === profileFilter);
    }

    if (audioFilter !== 'all') {
        currentCharacters = currentCharacters.filter(c => {
            if (audioFilter === 'with') return !!c.audio;
            if (audioFilter === 'without') return !c.audio;
            return true;
        });
    }

    if (searchTerm.trim()) {
        currentCharacters = currentCharacters.filter(c => 
            getTranslatedValue(c.name, i18n.language).toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
    }
    
    return currentCharacters;
  }, [genderFilter, profileFilter, audioFilter, sortOrder, characters, shuffledCharacters, i18n.language, searchTerm]);

  const profileOptions = Object.entries(ENEAGRAMA_FILTER_NAMES);

  return (
    <div className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-800">{t('gallery_title')}</h2>
        <p className="text-stone-600 max-w-xl mx-auto mt-2">{t('gallery_subtitle')}</p>
      </div>

      <div className="mb-8 p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-sm">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center justify-center w-full p-2.5 bg-white border border-stone-300 rounded-md shadow-sm text-stone-700 font-semibold"
          aria-expanded={isFilterOpen}
          aria-controls="filter-panel"
        >
          <FilterIcon className="w-5 h-5 mr-2"/>
          {t('gallery_filter_button')}
        </button>

        <div 
          id="filter-panel"
          className={`${isFilterOpen ? 'grid' : 'hidden'} mt-4 md:mt-0 md:grid grid-cols-1 md:grid-cols-5 gap-4 items-end transition-all duration-300`}
        >
          <div className="flex flex-col">
            <label htmlFor="search-filter" className="text-sm font-semibold text-stone-600 mb-2">{t('gallery_search_by_name')}</label>
            <input
              id="search-filter"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('gallery_search_placeholder')}
              className="w-full p-2.5 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              aria-label={t('gallery_search_by_name')}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="profile-filter" className="text-sm font-semibold text-stone-600 mb-2">{t('gallery_filter_by_profile')}</label>
            <select
              id="profile-filter"
              value={profileFilter}
              onChange={(e) => setProfileFilter(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              aria-label={t('gallery_filter_by_profile')}
            >
              {profileOptions.map(([value, key]) => (
                <option key={value} value={value}>{t(key)}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="audio-filter" className="text-sm font-semibold text-stone-600 mb-2">{t('gallery_filter_by_audio')}</label>
            <select
              id="audio-filter"
              value={audioFilter}
              onChange={(e) => setAudioFilter(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              aria-label={t('gallery_filter_by_audio')}
            >
              <option value="all">{t('audio_filter_all')}</option>
              <option value="with">{t('audio_filter_with')}</option>
              <option value="without">{t('audio_filter_without')}</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="gender-filter" className="text-sm font-semibold text-stone-600 mb-2">{t('gallery_filter_by_gender')}</label>
            <select
              id="gender-filter"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              aria-label={t('gallery_filter_by_gender')}
            >
              <option value="all">{t('gender_all')}</option>
              <option value="male">{t('gender_male')}</option>
              <option value="female">{t('gender_female')}</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="sort-order" className="text-sm font-semibold text-stone-600 mb-2">{t('gallery_sort_by')}</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              aria-label={t('gallery_sort_by')}
            >
              <option value="alpha">{t('gallery_sort_alpha')}</option>
              <option value="random">{t('gallery_sort_random')}</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader text={t('loader_characters')} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedCharacters.map(character => (
              <CharacterCard 
                key={character.id} 
                character={character} 
                onClick={() => onSelectCharacter(character)}
              />
            ))}
          </div>
          
          {filteredAndSortedCharacters.length === 0 && !isLoading && (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md mt-8">
                <h3 className="text-xl font-semibold text-stone-700">{t('gallery_no_characters_title')}</h3>
                <p className="text-stone-500 mt-2">{t('gallery_no_characters_subtitle')}</p>
            </div>
          )}
        </>
      )}

      <div className="text-center mt-12 py-8 border-t border-stone-200">
        <h3 className="text-2xl font-bold text-stone-800 mb-2">{t('gallery_cta_title')}</h3>
        <p className="text-stone-600 mb-6 max-w-lg mx-auto">{t('gallery_cta_subtitle')}</p>
        <button
          onClick={onStartTest}
          className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg sm:text-xl"
        >
          {hasPreviousResult ? t('button_see_my_result') : t('button_do_test_alt')}
        </button>
      </div>
    </div>
  );
};

export default CharacterGallery;