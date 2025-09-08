import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../types';
import { getAllUsers, deleteUser, updateUserProfile, grantPremiumAccess } from '../services/databaseService';
import Loader from './Loader';
import UserEditModal from './UserEditModal';
import ConfirmationModal from './ConfirmationModal';
import { DiamondGoldIcon, DiamondSilverIcon, EditIcon, DeleteIcon, ClipboardListIcon, KeyIcon } from './icons';
import GrantAccessModal from './GrantAccessModal';

interface UsersAdminTabProps {
    onViewReport: (user: UserProfile) => void;
}

const UsersAdminTab: React.FC<UsersAdminTabProps> = ({ onViewReport }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [accessFilter, setAccessFilter] = useState('all'); // 'all', '1', '0'
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    
    const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
    const [isGrantAccessModalOpen, setIsGrantAccessModalOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchMatch = user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const accessMatch = accessFilter === 'all' || String(user.acesso || '0') === accessFilter;
            
            const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
            const toDate = dateFilter.to ? new Date(dateFilter.to) : null;
            if(toDate) toDate.setHours(23, 59, 59, 999); // Include the whole day
            
            const userDate = new Date(user.created_at);
            const dateMatch = (!fromDate || userDate >= fromDate) && (!toDate || userDate <= toDate);

            return searchMatch && accessMatch && dateMatch;
        });
    }, [users, searchTerm, accessFilter, dateFilter]);

    const handleSaveUser = async (user: UserProfile, updates: { nome?: string; acesso?: string }) => {
        try {
            const updatedUser = await updateUserProfile(user.email, updates);
            setUsers(prevUsers => prevUsers.map(u => u.email === updatedUser.email ? updatedUser : u));
            alert(t('alert_user_updated', { email: user.email }));
        } catch (error) {
            alert(t('alert_user_update_fail'));
            console.error(error);
        }
        setUserToEdit(null);
    };

    const handleGrantAccess = async (email: string) => {
        try {
            await grantPremiumAccess(email);
            alert(t('alert_grant_access_success', {email}));
            fetchUsers(); // Refresh the user list
            setIsGrantAccessModalOpen(false);
        } catch (error) {
            alert(t('alert_grant_access_fail'));
            console.error(error);
        }
    };
    
    const isMobile = window.innerWidth < 768;

    if (isLoading) return <Loader />;

    return (
        <>
            <h3 className="text-xl font-bold text-stone-800 mb-4">{t('admin_users_title')}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-stone-50 rounded-lg border">
                <input
                    type="text"
                    placeholder={t('admin_users_search_placeholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-md"
                />
                <select value={accessFilter} onChange={e => setAccessFilter(e.target.value)} className="w-full p-2 border border-stone-300 rounded-md">
                    <option value="all">{t('admin_users_filter_access_all')}</option>
                    <option value="1">{t('admin_users_filter_access_premium')}</option>
                    <option value="0">{t('admin_users_filter_access_basic')}</option>
                </select>
                <input type="date" value={dateFilter.from} onChange={e => setDateFilter(prev => ({ ...prev, from: e.target.value }))} className="w-full p-2 border border-stone-300 rounded-md" placeholder={t('admin_users_filter_date_from')} />
                <input type="date" value={dateFilter.to} onChange={e => setDateFilter(prev => ({ ...prev, to: e.target.value }))} className="w-full p-2 border border-stone-300 rounded-md" placeholder={t('admin_users_filter_date_to')} />
             </div>
             <button onClick={() => setIsGrantAccessModalOpen(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors mb-4">
                <KeyIcon className="w-5 h-5" /> {t('admin_button_grant_access')}
             </button>

            {isMobile ? (
                 <div className="space-y-3">
                     {filteredUsers.map(user => (
                        <div key={user.email} className="bg-white border border-stone-200 rounded-lg shadow-sm p-3 space-y-2">
                             <div className="flex items-start justify-between">
                                 <div>
                                    <p className="font-bold text-stone-800">{user.nome || t('ask_name_placeholder')}</p>
                                    <p className="text-sm text-stone-500">{user.email}</p>
                                    <p className="text-xs text-stone-400 mt-1">
                                      {t('admin_users_table_header_date')}: {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                 </div>
                                  {String(user.acesso) === '1' ? <DiamondGoldIcon title="Premium" /> : <DiamondSilverIcon title="Básico" />}
                             </div>
                             <div className="border-t pt-2 flex items-center justify-between">
                                 <button onClick={() => onViewReport(user)} disabled={!user.personagem} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                     <ClipboardListIcon className="w-4 h-4" /> {t('admin_users_view_report')}
                                 </button>
                                 <div className="flex items-center gap-2">
                                     <button onClick={() => setUserToEdit(user)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-md"><EditIcon /></button>
                                     <button onClick={() => setUserToDelete(user)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><DeleteIcon /></button>
                                 </div>
                             </div>
                        </div>
                     ))}
                 </div>
            ) : (
                <table className="min-w-full bg-white border border-stone-200">
                    <thead className="bg-stone-50">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold text-stone-600">{t('admin_users_table_header_user')}</th>
                            <th className="p-3 text-left text-sm font-semibold text-stone-600">{t('admin_users_table_header_access')}</th>
                            <th className="p-3 text-left text-sm font-semibold text-stone-600">{t('admin_users_table_header_date')}</th>
                            <th className="p-3 text-right text-sm font-semibold text-stone-600">{t('admin_table_header_actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                        {filteredUsers.map(user => (
                            <tr key={user.email}>
                                <td className="p-3">
                                    <p className="font-bold text-stone-800">{user.nome || t('ask_name_placeholder')}</p>
                                    <p className="text-sm text-stone-500">{user.email}</p>
                                </td>
                                <td className="p-3">{String(user.acesso) === '1' ? <DiamondGoldIcon title="Premium" /> : <DiamondSilverIcon title="Básico" />}</td>
                                <td className="p-3 text-sm text-stone-600">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => onViewReport(user)} disabled={!user.personagem} className="px-3 py-1 text-xs font-semibold bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 disabled:opacity-50">
                                          {t('admin_users_view_report')}
                                        </button>
                                        <button onClick={() => setUserToEdit(user)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-md"><EditIcon /></button>
                                        <button onClick={() => setUserToDelete(user)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><DeleteIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <UserEditModal 
                isOpen={!!userToEdit}
                onClose={() => setUserToEdit(null)}
                user={userToEdit}
                onSave={handleSaveUser}
            />
            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={async () => {
                    if (!userToDelete) return;
                    try {
                        await deleteUser(userToDelete.email);
                        setUsers(prevUsers => prevUsers.filter(u => u.email !== userToDelete.email));
                        alert(t('alert_user_deleted', { email: userToDelete.email }));
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        alert(`${t('alert_user_delete_fail')}\n\nDetalhes: ${errorMessage}`);
                        console.error(error);
                    }
                }}
                titleKey="admin_confirm_action_title"
            >
                {t('admin_delete_user_confirmation', { email: userToDelete?.email })}
            </ConfirmationModal>
            <GrantAccessModal
                isOpen={isGrantAccessModalOpen}
                onClose={() => setIsGrantAccessModalOpen(false)}
                onSubmit={handleGrantAccess}
            />
        </>
    );
};

export default UsersAdminTab;