import React from 'react';
import { User, SmartwatchState, Language } from '../types';
import { t } from '../utils/language';
import { emergencyAlarm } from '../utils/emergencySound';
import { 
  HeartPulse, 
  Activity, 
  Watch, 
  AlertTriangle, 
  Phone, 
  Shield, 
  User as UserIcon, 
  FileText, 
  CheckCircle2,
  MapPin,
  Volume2,
  VolumeX,
  Vibrate
} from 'lucide-react';

interface PatientViewTabProps {
  currentUser: User | null;
  smartwatch: SmartwatchState;
  language: Language;
  onTriggerSos: () => void;
  isAmbulanceEnRoute: boolean;
}

export const PatientViewTab: React.FC<PatientViewTabProps> = ({
  currentUser,
  smartwatch,
  language,
  onTriggerSos,
  isAmbulanceEnRoute,
}) => {
  const handleSosClick = () => {
    emergencyAlarm.startAlarm();
    onTriggerSos();
  };

  const handleStopAlarm = () => {
    emergencyAlarm.stopAlarm();
  };
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Patient Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950 border border-rose-500/60 rounded-xl text-rose-400">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t('patientFileTitle', language)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {currentUser ? (language === 'ar' ? currentUser.nameAr : currentUser.nameEn) : 'سهم المريض القحطاني'} | QID: {currentUser?.qid || '27863400512'}
              </p>
            </div>
          </div>

          {/* Emergency SOS Button */}
          <div className="flex items-center gap-3">
            <button
              id="emergency-sos-btn"
              onClick={handleSosClick}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm transition shadow-xl shadow-rose-950/60 flex items-center gap-2 animate-bounce"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>{t('emergencySosBtn', language)}</span>
            </button>

            <button
              onClick={handleStopAlarm}
              title="إيقاف صفارة الإنذار والهزاز"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition border border-slate-700 flex items-center gap-1.5"
            >
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">إيقاف الصوت والهزاز</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Patient Vitals From Smartwatch + Detailed Medical File */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Vitals pulled from Smartwatch */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Watch className="w-5 h-5 text-rose-400" />
              <span>{t('patientVitalsFromWatch', language)}</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ساعة متصلة
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 block">{t('heartRate', language)}</span>
              <span className="text-2xl font-black text-rose-300 block">
                {smartwatch.currentVitals.heartRate} bpm
              </span>
              <span className="text-[10px] text-emerald-400">مستقر وفي النطاق</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 block">{t('bloodPressure', language)}</span>
              <span className="text-2xl font-black text-teal-300 block">
                {smartwatch.currentVitals.bloodPressure}
              </span>
              <span className="text-[10px] text-slate-400">متابعة طبيعية</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 block">{t('oxygenSaturation', language)}</span>
              <span className="text-2xl font-black text-cyan-300 block">
                {smartwatch.currentVitals.oxygenSaturation}%
              </span>
              <span className="text-[10px] text-slate-400">طبيعي</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 block">{t('bloodSugar', language)}</span>
              <span className="text-2xl font-black text-amber-300 block">
                {smartwatch.currentVitals.bloodSugar} mg/dL
              </span>
              <span className="text-[10px] text-slate-400">بعد الوجبة</span>
            </div>

          </div>
        </div>

        {/* Detailed Medical Health Record (الملف الطبي المفصل) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              الملف الطبي التفصيلي والتاريخ المرضي
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
              <span className="text-slate-400 font-bold">فصيلة الدم (Blood Group):</span>
              <span className="text-rose-400 font-black">O+ مثبتة</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
              <span className="text-slate-400 font-bold">الأمراض المزمنة:</span>
              <span className="text-slate-200">ارتفاع ضغط الدم الشرياني، سكري النوع الثاني</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
              <span className="text-slate-400 font-bold">الحساسية الأدوية (Allergies):</span>
              <span className="text-emerald-400 font-bold">لا يوجد حساسيات دوائية مسجلة</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
              <span className="text-slate-400 font-bold">جهة المتابعة الصحية:</span>
              <span className="text-slate-200">مؤسسة حمد الطبية - قسم الطوارئ والقلب</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
              <span className="text-slate-400 font-bold">رقم طوارئ الأقارب:</span>
              <span className="text-amber-300 font-mono font-bold">+974 5512 9900</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
