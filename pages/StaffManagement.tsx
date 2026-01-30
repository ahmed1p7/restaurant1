
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role, type User } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, UserPlus, Edit, Trash2, Shield, Lock, Smartphone, User as UserIcon } from 'lucide-react';
import { uiTranslations } from '../translations';

const StaffManagement: React.FC = () => {
    const { allStaff, updateStaff } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);
    const lang = (localStorage.getItem('lang') as any) || 'ar';
    const t = uiTranslations[lang as keyof typeof uiTranslations];

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const staffData: User = {
            id: editingStaff?.id || Date.now(),
            name: formData.get('name') as string,
            pin: formData.get('pin') as string,
            role: formData.get('role') as Role,
            password: formData.get('password') as string || undefined,
            permissions: {
                canCancelOrder: formData.get('cancel') === 'on',
                canApplyDiscount: formData.get('discount') === 'on',
                canViewReports: formData.get('reports') === 'on',
            }
        };

        if (editingStaff) {
            updateStaff(allStaff.map(s => s.id === editingStaff.id ? staffData : s));
        } else {
            updateStaff([...allStaff, staffData]);
        }
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const getRoleLabel = (role: Role) => {
      switch(role) {
        case Role.ADMIN: return t.admin;
        case Role.WAITER: return t.waiter;
        case Role.KITCHEN: return t.kitchen;
        case Role.BAR: return t.bar;
        default: return role;
      }
    }

    return (
        <div className="space-y-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-primary-dark dark:text-white tracking-tighter">{t.staffManagement}</h1>
                    <p className="text-neutral-dark/40 dark:text-gray-400 font-bold">{t.manageStaffDesc}</p>
                </div>
                <Button Icon={UserPlus} onClick={() => { setEditingStaff(null); setIsModalOpen(true); }} className="py-4 px-8 rounded-2xl shadow-xl">{t.addStaff}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allStaff.map(member => (
                    <Card key={member.id} className="p-6 border-t-8 border-accent relative group overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-muted dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary-dark dark:text-white group-hover:bg-accent group-hover:text-white transition-all">
                                <UserIcon size={32} />
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${member.role === Role.ADMIN ? 'bg-primary text-white' : 'bg-muted dark:bg-gray-700 text-neutral-dark dark:text-gray-400'}`}>
                                    {getRoleLabel(member.role)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-1 text-right">
                            <h3 className="text-2xl font-black text-primary-dark dark:text-white">{member.name}</h3>
                            <div className="flex items-center gap-2 text-accent font-black">
                                <Lock size={14} /> {t.entryCode}: {member.pin}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-neutral/50 dark:border-gray-700 space-y-3 text-right">
                            <p className="text-[10px] font-black opacity-30 dark:text-gray-500 uppercase tracking-widest">{t.permissions}</p>
                            <div className="flex flex-wrap gap-2 justify-end">
                                {member.permissions.canCancelOrder && <span className="bg-red-50 dark:bg-red-900/20 text-danger text-[10px] px-2 py-1 rounded-lg font-bold">{t.allowCancel}</span>}
                                {member.permissions.canApplyDiscount && <span className="bg-green-50 dark:bg-green-900/20 text-green-600 text-[10px] px-2 py-1 rounded-lg font-bold">{t.allowDiscount}</span>}
                                {member.permissions.canViewReports && <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] px-2 py-1 rounded-lg font-bold">{t.allowReports}</span>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => { setEditingStaff(member); setIsModalOpen(true); }} className="p-3 bg-muted dark:bg-gray-800 rounded-xl hover:bg-primary hover:text-white transition-all dark:text-white"><Edit size={16}/></button>
                            <button onClick={() => updateStaff(allStaff.filter(s => s.id !== member.id))} className="p-3 bg-red-50 dark:bg-red-900/20 text-danger rounded-xl hover:bg-danger hover:text-white transition-all"><Trash2 size={16}/></button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? t.save : t.addStaff}>
                <form onSubmit={handleSave} className="space-y-6 py-2">
                    <div className="space-y-4 text-right">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-40 px-2 uppercase dark:text-gray-400">{t.fullName}</label>
                                <input name="name" defaultValue={editingStaff?.name} className="w-full p-4 bg-muted dark:bg-gray-800 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-40 px-2 uppercase dark:text-gray-400">{t.entryCode} (3 digits)</label>
                                <input name="pin" maxLength={3} defaultValue={editingStaff?.pin} className="w-full p-4 bg-muted dark:bg-gray-800 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black opacity-40 px-2 uppercase dark:text-gray-400">{t.role}</label>
                            <select name="role" defaultValue={editingStaff?.role || Role.WAITER} className="w-full p-4 bg-muted dark:bg-gray-800 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent appearance-none">
                                <option value={Role.WAITER}>{t.waiter}</option>
                                <option value={Role.ADMIN}>{t.admin}</option>
                                <option value={Role.KITCHEN}>{t.kitchen}</option>
                                <option value={Role.BAR}>{t.bar}</option>
                            </select>
                        </div>

                        <div className="space-y-3 bg-muted dark:bg-gray-800 p-6 rounded-[2rem]">
                            <p className="text-[10px] font-black opacity-40 dark:text-gray-500 uppercase tracking-widest mb-2">{t.permissions}</p>
                            <div className="space-y-2">
                                {[
                                    { id: 'cancel', label: t.allowCancel, key: 'canCancelOrder' },
                                    { id: 'discount', label: t.allowDiscount, key: 'canApplyDiscount' },
                                    { id: 'reports', label: t.allowReports, key: 'canViewReports' },
                                ].map(p => (
                                    <label key={p.id} className="flex items-center gap-3 cursor-pointer group justify-end">
                                        <span className="font-bold text-primary-dark/70 dark:text-gray-400 group-hover:text-primary-dark dark:group-hover:text-white">{p.label}</span>
                                        <input type="checkbox" name={p.id} defaultChecked={(editingStaff?.permissions as any)?.[p.key]} className="w-5 h-5 accent-accent" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black opacity-40 px-2 uppercase dark:text-gray-400">{t.passwordAdmin}</label>
                            <input name="password" type="password" defaultValue={editingStaff?.password} className="w-full p-4 bg-muted dark:bg-gray-800 dark:text-white rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full py-5 text-xl font-black rounded-2xl">{t.saveData}</Button>
                </form>
            </Modal>
        </div>
    );
};

export default StaffManagement;
