import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../types';
import { EditIcon } from './icons';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSave: (user: UserProfile, updates: { nome?: string; acesso?: string }) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [access, setAccess] = useState('0');

  useEffect(() => {
    if (user) {
      setName(user.nome || '');
      setAccess(String(user.acesso) || '0');
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      const updates: { nome?: string; acesso?: string } = {};
      if (name !== (user.nome || '')) {
        updates.nome = name;
      }
      if (access !== (String(user.acesso) || '0')) {
        updates.acesso = access;
      }
      if (Object.keys(updates).length > 0) {
        onSave(user, updates);
      } else {
        onClose();
      }
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
          <EditIcon className="w-6 h-6 text-stone-700 mr-3" />
          <h2 className="text-xl font-bold text-stone-800">{t('user_edit_modal_title')}</h2>
        </div>
        
        <p className="text-sm text-stone-500 mb-4">{user.email}</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-stone-700">{t('user_edit_modal_name')}</label>
            <input
              id="userName"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full p-2 border border-stone-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="userAccess" className="block text-sm font-medium text-stone-700">{t('user_edit_modal_access')}</label>
            <select
              id="userAccess"
              value={access}
              onChange={e => setAccess(e.target.value)}
              className="mt-1 w-full p-2 border border-stone-300 rounded-md"
            >
              <option value="1">{t('admin_users_filter_access_premium')}</option>
              <option value="0">{t('admin_users_filter_access_basic')}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-stone-200 text-stone-800 font-semibold rounded-lg hover:bg-stone-300">
            {t('button_cancel')}
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700">
            {t('user_edit_modal_save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
