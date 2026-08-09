import React, { useState } from 'react';
import { User, UserRole, Language } from '../types';
import { t } from '../utils/language';
import { 
  UserCheck, 
  UserPlus, 
  X, 
  Shield, 
  Key, 
  User as UserIcon, 
  Phone, 
  CreditCard, 
  Stethoscope, 
  Ambulance, 
  HeartPulse,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  availableUsers: User[];
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  availableUsers,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Quick Login State
  const [loginRole, setLoginRole] = useState<UserRole>('doctor');
  const [usernameInput, setUsernameInput] = useState('سهم');
  const [passwordInput, setPasswordInput] = useState('123');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regQid, setRegQid] = useState('');
  const [regNameAr, setRegNameAr] = useState('');
  const [regNameEn, setRegNameEn] = useState('');
  const [regPhone, setRegPhone] = useState('+974 ');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('patient');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Find user matching role and username
    const match = availableUsers.find(
      (u) => u.role === loginRole && u.username === usernameInput
    );

    if (match && passwordInput === '123') {
      onLogin(match);
      onClose();
    } else {
      setLoginError(
        language === 'ar'
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة. استخدم اسم المستخدم: سهم / كلمة المرور: 123'
          : 'Invalid username or password. Default username: سهم / Password: 123'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regQid || !regNameAr || !regNameEn || !regPhone || !regUsername || !regPassword) {
      setRegError(
        language === 'ar'
          ? 'يرجى تعبئة جميع الحقول المطلوبة لتسجيل الحساب'
          : 'Please fill in all required registration fields'
      );
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: regUsername,
      nameAr: regNameAr,
      nameEn: regNameEn,
      role: regRole,
      qid: regQid,
      phone: regPhone,
    };

    onRegister(newUser);
    setRegSuccess(
      language === 'ar'
        ? 'تم إنشاء الحساب بنجاح! جارٍ الدخول إلى المنظومة...'
        : 'Account created successfully! Logging in...'
    );

    setTimeout(() => {
      onLogin(newUser);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-0.5 border border-emerald-500/40 shadow">
              <img src="/logo.png" alt="المستجيب الأول" className="w-full h-full object-contain rounded" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white leading-tight">
                المستجيب الأول - {activeTab === 'login' ? t('login', language) : t('register', language)}
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">منظومة سهم الاستجابية للطوارئ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition border-b-2 ${
              activeTab === 'login'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t('login', language)}</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition border-b-2 ${
              activeTab === 'register'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('register', language)}</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Quick Notice */}
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('quickLoginNotice', language)}</span>
              </div>

              {/* Select Role for Login */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {t('selectRole', language)}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('doctor');
                      setUsernameInput('سهم');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold ${
                      loginRole === 'doctor'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5 text-emerald-400" />
                    <span>{t('doctorRole', language)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('paramedic');
                      setUsernameInput('سهم');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold ${
                      loginRole === 'paramedic'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-md shadow-amber-950/40'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Ambulance className="w-5 h-5 text-amber-400" />
                    <span>{t('paramedicRole', language)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('patient');
                      setUsernameInput('سهم');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-bold ${
                      loginRole === 'patient'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-md shadow-rose-950/40'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <HeartPulse className="w-5 h-5 text-rose-400" />
                    <span>{t('patientRole', language)}</span>
                  </button>
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t('username', language)}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="سهم"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t('password', language)}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t('loginBtn', language)}</span>
              </button>
            </form>
          ) : (
            /* Register Form (Full user specs: QID, Name Ar, Name En, Phone, Username, Password) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              
              {/* Role Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t('selectRole', language)}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('doctor')}
                    className={`py-2 px-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1 ${
                      regRole === 'doctor'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{t('doctorRole', language)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('paramedic')}
                    className={`py-2 px-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1 ${
                      regRole === 'paramedic'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Ambulance className="w-3.5 h-3.5" />
                    <span>{t('paramedicRole', language)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('patient')}
                    className={`py-2 px-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1 ${
                      regRole === 'patient'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>{t('patientRole', language)}</span>
                  </button>
                </div>
              </div>

              {/* QID Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {t('qid', language)} *
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regQid}
                    onChange={(e) => setRegQid(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="28463400192"
                    required
                  />
                </div>
              </div>

              {/* Name Arabic */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {t('nameAr', language)} *
                </label>
                <input
                  type="text"
                  value={regNameAr}
                  onChange={(e) => setRegNameAr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="سهم محمد الهجري"
                  required
                />
              </div>

              {/* Name English */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {t('nameEn', language)} *
                </label>
                <input
                  type="text"
                  value={regNameEn}
                  onChange={(e) => setRegNameEn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Sahm Mohammed Al-Hajri"
                  required
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {t('phone', language)} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="+974 5512 3456"
                    required
                  />
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {t('username', language)} *
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="sahm_user"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {t('password', language)} *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>

              {regError && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300">
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('createAccountBtn', language)}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
