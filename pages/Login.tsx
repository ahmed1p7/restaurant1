import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, KeyRound, Monitor, ChefHat, CupSoda, LogIn } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';

type RoleType = 'waiter' | 'admin' | 'screens';

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>('waiter');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const [screenLogin, setScreenLogin] = useState<'kitchen' | 'bar' | null>(null);
  const [screenCode, setScreenCode] = useState('');

  const handleWaiterAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let success = false;
    if (selectedRole === 'admin') {
      success = login('admin', password);
    } else if (selectedRole === 'waiter') {
      success = login(identifier);
    }
    
    if (!success) {
      setError('بيانات تسجيل الدخول غير صالحة.');
    }
  };

  const handleScreenLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let success = false;
    if (screenLogin === 'kitchen') {
        success = login('kitchen', screenCode);
    } else if (screenLogin === 'bar') {
        success = login('bar', screenCode);
    }
    
    if (!success) {
      setError(`الرمز غير صحيح لشاشة ${screenLogin === 'kitchen' ? 'المطبخ' : 'المشروبات'}.`);
    } else {
      setScreenLogin(null);
      setScreenCode('');
    }
  };

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setIdentifier('');
    setPassword('');
    setError('');
  }

  const RoleButton = ({ role, label, Icon }: { role: RoleType, label: string, Icon: React.ElementType }) => (
    <button
      type="button"
      onClick={() => handleRoleChange(role)}
      className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
        selectedRole === role
          ? 'bg-primary text-white shadow-lg scale-105'
          : 'bg-muted text-neutral-dark/80 hover:bg-neutral'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
  
  const InputField: React.FC<{id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, Icon: React.ElementType, disabled?: boolean}> = ({ id, type, placeholder, value, onChange, Icon, disabled = false }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-neutral-dark/40" />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full pl-10 pr-3 py-3 border border-neutral/30 rounded-lg shadow-sm bg-secondary placeholder-neutral-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-lg text-center"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary">
        <div className="grid md:grid-cols-2 h-screen">
            <div className="relative hidden md:flex flex-col justify-end p-12 bg-cover bg-center text-white" style={{ backgroundImage: "url('https://picsum.photos/seed/seaside-restaurant/1000/1200')"}}>
                <div className="absolute inset-0 bg-neutral-dark opacity-60"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold leading-tight">Welcome to SEA</h1>
                    <p className="mt-4 text-lg max-w-md opacity-90">
                        The heart of your restaurant's operations, reimagined for the coast.
                    </p>
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <img src="/icon.svg" alt="SEA Logo" className="mx-auto h-20 w-auto" />
                        <h2 className="mt-4 text-3xl font-bold text-neutral-dark">
                            تسجيل الدخول
                        </h2>
                        <p className="mt-2 text-neutral-dark/70">
                            اختر دورك للبدء
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-1.5 rounded-xl bg-muted">
                      <RoleButton role="admin" label="مشرف" Icon={KeyRound} />
                      <RoleButton role="waiter" label="نادل" Icon={User} />
                      <RoleButton role="screens" label="شاشات" Icon={Monitor} />
                    </div>

                    <div className="animate-fade-in">
                        {selectedRole !== 'screens' ? (
                            <form onSubmit={handleWaiterAdminSubmit} className="space-y-6">
                                {selectedRole === 'waiter' && (
                                    <InputField 
                                        id="waiterId"
                                        type="text"
                                        placeholder="رقم النادل (e.g., 101)"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        Icon={User}
                                    />
                                )}
                                {selectedRole === 'admin' && (
                                    <>
                                        <InputField 
                                            id="adminUser"
                                            type="text"
                                            placeholder=""
                                            value="admin"
                                            onChange={() => {}}
                                            Icon={User}
                                            disabled={true}
                                        />
                                        <InputField 
                                            id="password"
                                            type="password"
                                            placeholder="كلمة المرور"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            Icon={KeyRound}
                                        />
                                    </>
                                )}
                                {error && selectedRole !== 'screens' && <p className="text-sm text-danger text-center font-semibold">{error}</p>}
                                <Button type="submit" className="w-full !py-3 !text-base !font-bold" Icon={LogIn}>
                                    {selectedRole === 'waiter' ? 'تسجيل الدخول كنادل' : 'تسجيل الدخول كمشرف'}
                                </Button>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button onClick={() => setScreenLogin('kitchen')} className="text-center p-6 bg-screen-kitchen-light border-2 border-screen-kitchen-light hover:border-screen-kitchen rounded-xl space-y-2 transition-all duration-200 group">
                                    <ChefHat size={40} className="mx-auto text-screen-kitchen transition-transform group-hover:scale-110" />
                                    <h3 className="font-bold text-lg text-screen-kitchen-dark">شاشة المطبخ</h3>
                                </button>
                                <button onClick={() => setScreenLogin('bar')} className="text-center p-6 bg-screen-bar-light border-2 border-screen-bar-light hover:border-screen-bar rounded-xl space-y-2 transition-all duration-200 group">
                                    <CupSoda size={40} className="mx-auto text-screen-bar transition-transform group-hover:scale-110" />
                                    <h3 className="font-bold text-lg text-screen-bar-dark">شاشة المشروبات</h3>
                                </button>
                            </div>
                        )}
                    </div>
                     {selectedRole === 'waiter' && (
                        <div className="text-center text-xs text-neutral-dark/60">
                            <p>:للتجربة، استخدم</p>
                            <p>101, 102 :نادل</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <Modal 
            isOpen={!!screenLogin} 
            onClose={() => {
                setScreenLogin(null);
                setScreenCode('');
                setError('');
            }}
            title={`دخول شاشة ${screenLogin === 'kitchen' ? 'المطبخ' : 'المشروبات'}`}
        >
            <form onSubmit={handleScreenLoginSubmit} className="space-y-4">
                <p className="text-neutral-dark/80 text-center">أدخل الرمز الخاص بالشاشة.</p>
                <InputField
                    id="screenCode"
                    type="password"
                    placeholder="****"
                    value={screenCode}
                    onChange={(e) => setScreenCode(e.target.value)}
                    Icon={KeyRound}
                />
                {error && selectedRole === 'screens' && <p className="text-sm text-danger text-center font-semibold">{error}</p>}

                 <p className="text-center text-xs text-neutral-dark/60">
                    الرمز للتجربة: {screenLogin === 'kitchen' ? '111' : '222'}
                </p>
                <Button type="submit" className="w-full !py-3 !text-base">
                    دخول
                </Button>
            </form>
        </Modal>

        <style>{`
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
    </div>
  );
};

export default Login;