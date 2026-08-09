import React, { useState } from 'react';
import { 
  User, 
  Language, 
  FirstResponderReport, 
  TrafficComplaint, 
  AlertNotification, 
  SmartwatchState 
} from './types';
import { 
  initialUsers, 
  initialPatientCases, 
  qatarHospitals, 
  initialTrafficComplaints, 
  initialNotifications, 
  initialSmartwatchState 
} from './data/mockData';
import { t } from './utils/language';
import { HeaderNavbar } from './components/HeaderNavbar';
import { AuthModal } from './components/AuthModal';
import { HandedOverCasesTab } from './components/HandedOverCasesTab';
import { TrafficComplaintsTab } from './components/TrafficComplaintsTab';
import { QatarMapTab } from './components/QatarMapTab';
import { AiAssistantTab } from './components/AiAssistantTab';
import { SmartwatchSyncTab } from './components/SmartwatchSyncTab';
import { PatientViewTab } from './components/PatientViewTab';

import { 
  Activity, 
  ShieldAlert, 
  Navigation, 
  Bot, 
  Watch, 
  HeartPulse, 
  Sparkles,
  Shield,
  PhoneCall
} from 'lucide-react';

export default function App() {
  // Application State
  const [language, setLanguage] = useState<Language>('ar');
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]); // Default to Doctor
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Auto switch away from restricted tabs when user is a patient
  React.useEffect(() => {
    if (currentUser?.role === 'patient' && (activeTab === 'maps' || activeTab === 'aiAssistant')) {
      setActiveTab('patientFile');
    }
  }, [currentUser?.role, activeTab]);

  // Core Data State
  const [cases, setCases] = useState<FirstResponderReport[]>(initialPatientCases);
  const [complaints, setComplaints] = useState<TrafficComplaint[]>(initialTrafficComplaints);
  const [notifications, setNotifications] = useState<AlertNotification[]>(initialNotifications);
  const [smartwatch, setSmartwatch] = useState<SmartwatchState>(initialSmartwatchState);
  const [isAmbulanceEnRoute, setIsAmbulanceEnRoute] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Set appropriate default tab based on role
    if (user.role === 'patient') {
      setActiveTab('patientFile');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleRegister = (newUser: User) => {
    setAllUsers((prev) => [...prev, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAddComplaint = (newComplaint: TrafficComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);

    // Add notification
    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      titleAr: '🚔 إدارة المرور بقطر',
      titleEn: '🚔 Qatar Traffic Dept',
      messageAr: `تم توثيق مخالفة عرقلة الإسعاف برقم المرجع: ${newComplaint.ticketId}`,
      messageEn: `Ambulance obstruction recorded under ticket: ${newComplaint.ticketId}`,
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-QA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'traffic',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSendAshghalAlert = () => {
    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      titleAr: '🟢 هيئة الأشغال العامة (أشغال)',
      titleEn: '🟢 Ashghal Public Works Authority',
      messageAr: 'تم تلقي إشعار المسار الطارئ، وتأمين الموجة الخضراء بجميع الإشارات الضوئية',
      messageEn: 'Emergency route alert acknowledged, green wave secured across traffic lights',
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-QA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'ashghal',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSimulateDangerZone = () => {
    setSmartwatch((prev) => ({
      ...prev,
      isInDangerZone: true,
      currentVitals: {
        ...prev.currentVitals,
        heartRate: 182, // Dangerous Tachycardia
        bloodPressure: '185/115',
      },
    }));
  };

  const handleDispatchEmergency = () => {
    setIsAmbulanceEnRoute(true);
    setSmartwatch((prev) => ({ ...prev, isInDangerZone: false }));

    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      titleAr: '🚨 تحريك المستجيب الأول وسيارة الإسعاف',
      titleEn: '🚨 First Responder & Ambulance Dispatched',
      messageAr: 'تم إرسال طاقم المستجيب الأول وسيارة الإسعاف فوراً لموقع المريض بعد إنذار الساعة الذكية',
      messageEn: 'First responder and ambulance dispatched immediately following smartwatch alert',
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-QA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'emergency',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white"
    >
      {/* Top Header Navigation Bar */}
      <HeaderNavbar
        currentUser={currentUser}
        language={language}
        onLanguageToggle={handleLanguageToggle}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Tab Navigation Buttons */}
      <nav className="bg-slate-900/90 border-b border-slate-800 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            
            {/* Tab 1: Dashboard */}
            <button
              id="tab-dashboard-btn"
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition border ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t('tabDashboard', language)}</span>
            </button>

            {/* Tab 2: Traffic Complaints */}
            <button
              id="tab-complaints-btn"
              onClick={() => setActiveTab('complaints')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition border ${
                activeTab === 'complaints'
                  ? 'bg-amber-600 text-slate-950 border-amber-500 shadow-lg shadow-amber-950/40 font-black'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('tabComplaints', language)}</span>
            </button>

            {/* Tab 3: Qatar Maps (Hidden for patient role) */}
            {currentUser?.role !== 'patient' && (
              <button
                id="tab-maps-btn"
                onClick={() => setActiveTab('maps')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition border ${
                  activeTab === 'maps'
                    ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-900/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>{t('tabMaps', language)}</span>
              </button>
            )}

            {/* Tab 4: AI Assistant "سهم" (Hidden for patient role) */}
            {currentUser?.role !== 'patient' && (
              <button
                id="tab-ai-btn"
                onClick={() => setActiveTab('aiAssistant')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition border ${
                  activeTab === 'aiAssistant'
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-900/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>{t('tabAiAssistant', language)}</span>
              </button>
            )}

            {/* Tab 5: Smartwatch Sync */}
            <button
              id="tab-smartwatch-btn"
              onClick={() => setActiveTab('smartwatch')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition border ${
                activeTab === 'smartwatch'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <Watch className="w-4 h-4 text-rose-300" />
              <span>{t('tabSmartwatch', language)}</span>
            </button>

            {/* Tab 6: Patient Medical Record */}
            <button
              id="tab-patient-btn"
              onClick={() => setActiveTab('patientFile')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition border ${
                activeTab === 'patientFile'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>{t('tabPatientFile', language)}</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Active Tab Content Render */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <HandedOverCasesTab
            cases={cases}
            language={language}
            userRole={currentUser?.role || 'doctor'}
            userName={currentUser ? (language === 'ar' ? currentUser.nameAr : currentUser.nameEn) : 'د. سهم العلي'}
          />
        )}

        {activeTab === 'complaints' && (
          <TrafficComplaintsTab
            complaints={complaints}
            onAddComplaint={handleAddComplaint}
            language={language}
          />
        )}

        {activeTab === 'maps' && (
          <QatarMapTab
            hospitals={qatarHospitals}
            language={language}
            onSendAshghalAlert={handleSendAshghalAlert}
          />
        )}

        {activeTab === 'aiAssistant' && (
          <AiAssistantTab language={language} />
        )}

        {activeTab === 'smartwatch' && (
          <SmartwatchSyncTab
            smartwatch={smartwatch}
            onSimulateDangerZone={handleSimulateDangerZone}
            onDispatchEmergency={handleDispatchEmergency}
            language={language}
          />
        )}

        {activeTab === 'patientFile' && (
          <PatientViewTab
            currentUser={currentUser}
            smartwatch={smartwatch}
            language={language}
            onTriggerSos={handleDispatchEmergency}
            isAmbulanceEnRoute={isAmbulanceEnRoute}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        availableUsers={allUsers}
        language={language}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>منظومة سهم - المستجيب الأول للطوارئ الطبية والتتبع الذكي بقطر 🇶🇦</p>
        <p className="text-[10px] text-slate-600 mt-1">مؤسسة حمد الطبية | إدارة المرور | هيئة الأشغال العامة (أشغال)</p>
      </footer>
    </div>
  );
}
