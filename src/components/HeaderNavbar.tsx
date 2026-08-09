import React, { useState } from 'react';
import { User, Language, AlertNotification } from '../types';
import { t } from '../utils/language';
import { 
  Activity, 
  Bell, 
  Globe, 
  LogOut, 
  Shield, 
  UserCheck, 
  Ambulance, 
  Stethoscope, 
  HeartPulse, 
  CheckCircle2,
  X
} from 'lucide-react';

interface HeaderNavbarProps {
  currentUser: User | null;
  language: Language;
  onLanguageToggle: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  notifications: AlertNotification[];
  onMarkNotificationsRead: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentUser,
  language,
  onLanguageToggle,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationsRead,
  activeTab,
  setActiveTab,
}) => {
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'paramedic':
        return <Ambulance className="w-4 h-4 text-amber-600" />;
      case 'patient':
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      default:
        return <Shield className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'doctor':
        return t('doctorRole', language);
      case 'paramedic':
        return t('paramedicRole', language);
      case 'patient':
        return t('patientRole', language);
      default:
        return '';
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-14 h-14 rounded-xl bg-white p-1 border border-emerald-500/30 shadow-lg shadow-emerald-950/40 flex items-center justify-center transition group-hover:scale-105 shrink-0">
              <img 
                src="/logo.png" 
                alt="المستجيب الأول" 
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans flex items-center gap-2">
                  <span>المستجيب الأول</span>
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  قطر 🇶🇦
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold tracking-wide">
                منظومة سهم المتقدمة للطوارئ الاستجابية
              </p>
            </div>
          </div>

          {/* Right Controls: Notifications, Language, User Account */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={onLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition border border-slate-700"
              title="تغيير اللغة / Switch Language"
            >
              <Globe className="w-4 h-4 text-teal-400" />
              <span>{t('switchLanguage', language)}</span>
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => {
                  setShowNotificationsModal(!showNotificationsModal);
                  if (unreadCount > 0) onMarkNotificationsRead();
                }}
                className="relative p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
                title={t('notifications', language)}
              >
                <Bell className="w-5 h-5 text-amber-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Modal */}
              {showNotificationsModal && (
                <div className="absolute left-0 sm:right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 text-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span>{t('notifications', language)}</span>
                    </div>
                    <button 
                      onClick={() => setShowNotificationsModal(false)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">
                        {t('noNotifications', language)}
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id}
                          className={`p-3 rounded-lg text-xs border transition ${
                            n.read 
                              ? 'bg-slate-950/60 border-slate-800 text-slate-400' 
                              : 'bg-emerald-950/30 border-emerald-800/50 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span>{language === 'ar' ? n.titleAr : n.titleEn}</span>
                            <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                          </div>
                          <p className="leading-relaxed">
                            {language === 'ar' ? n.messageAr : n.messageEn}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <button
                      onClick={onMarkNotificationsRead}
                      className="mt-3 w-full py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('markAllAsRead', language)}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* User Account Info / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-white">
                    {language === 'ar' ? currentUser.nameAr : currentUser.nameEn}
                  </span>
                  <div className="flex items-center gap-1 justify-end">
                    {getRoleIcon(currentUser.role)}
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-300 text-xs">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    currentUser.nameEn.charAt(0)
                  )}
                </div>

                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition"
                  title={t('logout', language)}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-open-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-900/40"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t('login', language)}</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
