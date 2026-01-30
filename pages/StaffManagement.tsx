
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role, type User } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
// Added User as UserIcon from lucide-react to avoid conflict with the User type
import { Plus, UserPlus, Edit, Trash2, Shield, Lock, Smartphone, User as UserIcon } from 'lucide-react';

const StaffManagement: React.FC = () => {
    const { allStaff, updateStaff } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);

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

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-primary-dark tracking-tighter">إدارة الطاقم</h1>
                    <p className="text-neutral-dark/40 font-bold">إدارة الموظفين والرموز السرية والصلاحيات</p>
                </div>
                <Button Icon={UserPlus} onClick={() => { setEditingStaff(null); setIsModalOpen(true); }} className="py-4 px-8 rounded-2xl shadow-xl">إضافة موظف</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allStaff.map(member => (
                    <Card key={member.id} className="p-6 border-t-8 border-accent relative group overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary-dark group-hover:bg-accent group-hover:text-white transition-all">
                                {/* Fixed: Use UserIcon instead of User to refer to the component from lucide-react */}
                                <UserIcon size={32} />
                            </div>
                            <div className="text-left">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${member.role === Role.ADMIN ? 'bg-primary text-white' : member.role === Role.WAITER ? 'bg-muted text-neutral-dark' : 'bg-muted text-neutral-dark'}`}>
                                    {member.role === Role.ADMIN ? 'مشرف' : member.role === Role.WAITER ? 'نادل' : 'شاشة'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-primary-dark">{member.name}</h3>
                            <div className="flex items-center gap-2 text-accent font-black">
                                <Lock size={14} /> رمز الدخول: {member.pin}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-neutral/50 space-y-3">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">الصلاحيات الممنوحة</p>
                            <div className="flex flex-wrap gap-2">
                                {member.permissions.canCancelOrder && <span className="bg-red-50 text-danger text-[10px] px-2 py-1 rounded-lg font-bold">إلغاء الطلبات</span>}
                                {member.permissions.canApplyDiscount && <span className="bg-green-50 text-green-600 text-[10px] px-2 py-1 rounded-lg font-bold">عمل خصومات</span>}
                                {member.permissions.canViewReports && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-lg font-bold">رؤية التقارير</span>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => { setEditingStaff(member); setIsModalOpen(true); }} className="p-3 bg-muted rounded-xl hover:bg-primary hover:text-white transition-all"><Edit size={16}/></button>
                            <button onClick={() => updateStaff(allStaff.filter(s => s.id !== member.id))} className="p-3 bg-red-50 text-danger rounded-xl hover:bg-danger hover:text-white transition-all"><Trash2 size={16}/></button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}>
                <form onSubmit={handleSave} className="space-y-6 py-2">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-40 px-2 uppercase">الاسم الكامل</label>
                                <input name="name" defaultValue={editingStaff?.name} className="w-full p-4 bg-muted rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-40 px-2 uppercase">PIN (3 أرقام)</label>
                                <input name="pin" maxLength={3} defaultValue={editingStaff?.pin} className="w-full p-4 bg-muted rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black opacity-40 px-2 uppercase">الدور الوظيفي</label>
                            <select name="role" defaultValue={editingStaff?.role || Role.WAITER} className="w-full p-4 bg-muted rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent appearance-none">
                                <option value={Role.WAITER}>نادل (Waiter)</option>
                                <option value={Role.ADMIN}>مشرف (Admin)</option>
                                <option value={Role.KITCHEN}>مطبخ (Kitchen)</option>
                                <option value={Role.BAR}>بار (Bar)</option>
                            </select>
                        </div>

                        <div className="space-y-3 bg-muted p-6 rounded-[2rem]">
                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">إعدادات الصلاحيات</p>
                            <div className="space-y-2">
                                {[
                                    { id: 'cancel', label: 'السماح بإلغاء الطلبات', key: 'canCancelOrder' },
                                    { id: 'discount', label: 'السماح بعمل خصومات', key: 'canApplyDiscount' },
                                    { id: 'reports', label: 'السماح برؤية التقارير', key: 'canViewReports' },
                                ].map(p => (
                                    <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name={p.id} defaultChecked={(editingStaff?.permissions as any)?.[p.key]} className="w-5 h-5 accent-accent" />
                                        <span className="font-bold text-primary-dark/70 group-hover:text-primary-dark">{p.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black opacity-40 px-2 uppercase">كلمة المرور (للمشرف فقط)</label>
                            <input name="password" type="password" defaultValue={editingStaff?.password} className="w-full p-4 bg-muted rounded-2xl font-black outline-none border-2 border-transparent focus:border-accent" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full py-5 text-xl font-black rounded-2xl">حفظ البيانات</Button>
                </form>
            </Modal>
        </div>
    );
};

export default StaffManagement;
