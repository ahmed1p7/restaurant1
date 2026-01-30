
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Delete, Lock, User, KeyRound, ArrowRight, Settings, Moon, Sun, Globe, Check } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';

// نصوص الترجمة لواجهة تسجيل الدخول
const translations = {
  ar: {
    title: 'ياقوت',
    subtitle: 'نظام إدارة المطاعم',
    enterPin: 'أدخل الرمز السري',
    wrongPin: 'الرمز السري غير صحيح',
    welcomeAdmin: 'مرحباً بالمدير',
    enterPassword: 'يرجى إدخال كلمة المرور للمتابعة',
    adminLogin: 'دخول للمشرف',
    back: 'رجوع',
    settings: 'إعدادات العرض',
    theme: 'المظهر',
    language: 'اللغة',
    light: 'فاتح',
    dark: 'داكن',
    save: 'حفظ التغييرات'
  },
  it: {
    title: 'Yakoot',
    subtitle: 'Sistema di Gestione Ristorante',
    enterPin: 'Inserisci il PIN',
    wrongPin: 'PIN errato',
    welcomeAdmin: 'Benvenuto Admin',
    enterPassword: 'Inserisci la password per continuare',
    adminLogin: 'Accesso Admin',
    back: 'Indietro',
    settings: 'Impostazioni di Visualizzazione',
    theme: 'Tema',
    language: 'Lingua',
    light: 'Chiaro',
    dark: 'Scuro',
    save: 'Salva Modifiche'
  },
  en: {
    title: 'Yakoot',
    subtitle: 'Restaurant Management System',
    enterPin: 'Enter PIN',
    wrongPin: 'Wrong PIN',
    welcomeAdmin: 'Welcome Admin',
    enterPassword: 'Please enter password to continue',
    adminLogin: 'Admin Login',
    back: 'Back',
    settings: 'Display Settings',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    save: 'Save Changes'
  }
};

const Login: React.FC = () => {
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // لغة التطبيق والمظهر
  const [lang, setLang] = useState<'ar' | 'it' | 'en'>((localStorage.getItem('lang') as any) || 'ar');
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

  const { login } = useAuth();
  const t = translations[lang];

  useEffect(() => {
    // تحديث الثيم في الـ DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 3) {
        setError('');
        const newPin = pin + num;
        setPin(newPin);
        if (newPin.length === 3) {
            handleLogin(newPin);
        }
    }
  };

  const handleLogin = (finalPin: string, finalPass?: string) => {
    const result = login(finalPin, finalPass);
    if (!result.success) {
        if (result.requiresPassword) {
            setNeedsPassword(true);
        } else {
            setError(t.wrongPin);
            setPin('');
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary dark:bg-primary-dark p-4 font-sans transition-colors duration-500" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* أيقونة الإعدادات */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-6 left-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all border border-white/10 z-50"
      >
        <Settings size={24} />
      </button>

      <div className="bg-white dark:bg-dark-card rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border-[12px] border-primary-dark dark:border-black transition-colors duration-500">
        <div className="p-10 text-center bg-primary-dark dark:bg-black text-white space-y-4">
          <h1 className="text-5xl font-black tracking-tighter text-accent italic">{t.title}</h1>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.4em]">{t.subtitle}</p>
        </div>

        <div className="p-8 space-y-8">
          {!needsPassword ? (
            <div className="space-y-8">
              <div className="flex justify-center gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-14 h-14 rounded-2xl border-4 transition-all duration-300 flex items-center justify-center ${pin.length > i ? 'bg-accent border-accent scale-110 shadow-lg shadow-accent/40' : 'bg-muted dark:bg-gray-800 border-neutral dark:border-gray-700 opacity-50'}`}>
                        {pin.length > i && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                ))}
              </div>

              {error && <p className="text-center text-danger font-black text-sm animate-bounce">{error}</p>}

              <div className="grid grid-cols-3 gap-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
                    <button
                        key={key}
                        onClick={() => {
                            if (key === 'C') setPin('');
                            else if (key === '⌫') setPin(pin.slice(0, -1));
                            else handleKeyPress(key);
                        }}
                        className={`h-20 rounded-3xl text-2xl font-black transition-all active:scale-90 flex items-center justify-center ${key === 'C' ? 'bg-muted dark:bg-gray-800 text-danger' : key === '⌫' ? 'bg-muted dark:bg-gray-800 text-primary dark:text-accent' : 'bg-muted dark:bg-gray-800 text-primary-dark dark:text-gray-200 hover:bg-neutral dark:hover:bg-gray-700'}`}
                    >
                        {key === '⌫' ? <Delete size={24} /> : key}
                    </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
                <div className="text-center">
                    <p className="font-black text-primary-dark dark:text-white text-lg">{t.welcomeAdmin}</p>
                    <p className="text-sm opacity-50 dark:text-gray-400">{t.enterPassword}</p>
                </div>
                <div className="relative">
                    <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-dark/30 dark:text-white/20" />
                    <input 
                        type="password" 
                        autoFocus
                        className="w-full pr-12 pl-4 py-5 bg-muted dark:bg-gray-800 rounded-2xl font-black border-2 border-transparent focus:border-accent outline-none text-center text-2xl dark:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin(pin, password)}
                    />
                </div>
                <Button className="w-full py-5 text-xl font-black rounded-2xl" onClick={() => handleLogin(pin, password)}>
                    {t.adminLogin} <ArrowRight size={20} className={lang === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} />
                </Button>
                <button onClick={() => { setNeedsPassword(false); setPin(''); setPassword(''); }} className="w-full text-center text-danger font-bold text-sm">{t.back}</button>
            </div>
          )}
        </div>
      </div>

      {/* نافذة الإعدادات */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t.settings}>
        <div className="space-y-8 py-4">
          {/* قسم المظهر */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-primary-dark dark:text-white uppercase text-xs tracking-widest opacity-40">
              <Sun size={14} /> {t.theme}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-accent bg-accent/5 text-primary-dark' : 'border-neutral dark:border-gray-700 opacity-50'}`}
              >
                <Sun size={24} />
                <span className="font-bold">{t.light}</span>
                {theme === 'light' && <Check size={16} className="text-accent" />}
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-accent bg-accent/5 text-primary-dark dark:text-accent' : 'border-neutral dark:border-gray-700 opacity-50'}`}
              >
                <Moon size={24} />
                <span className="font-bold">{t.dark}</span>
                {theme === 'dark' && <Check size={16} className="text-accent" />}
              </button>
            </div>
          </section>

          {/* قسم اللغة */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-primary-dark dark:text-white uppercase text-xs tracking-widest opacity-40">
              <Globe size={14} /> {t.language}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'ar', label: 'العربية', native: 'العربية' },
                { id: 'it', label: 'الإيطالية', native: 'Italiano' },
                { id: 'en', label: 'الإنجليزية', native: 'English' }
              ].map((l) => (
                <button 
                  key={l.id}
                  onClick={() => setLang(l.id as any)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${lang === l.id ? 'border-accent bg-accent/5 text-primary-dark dark:text-accent font-black' : 'border-neutral dark:border-gray-700 opacity-50 text-neutral-dark dark:text-gray-300 font-bold'}`}
                >
                  <div className="flex flex-col text-right">
                    <span>{l.label}</span>
                    <span className="text-[10px] opacity-40">{l.native}</span>
                  </div>
                  {lang === l.id && <Check size={20} />}
                </button>
              ))}
            </div>
          </section>

          <Button className="w-full py-4 rounded-2xl font-black" onClick={() => setIsSettingsOpen(false)}>
            {t.save}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
