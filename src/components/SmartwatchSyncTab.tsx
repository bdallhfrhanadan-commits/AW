import React, { useState, useEffect } from 'react';
import { SmartwatchState, Language } from '../types';
import { t } from '../utils/language';
import { emergencyAlarm } from '../utils/emergencySound';
import { 
  Watch, 
  Activity, 
  AlertOctagon, 
  BatteryCharging, 
  CheckCircle2, 
  Heart, 
  Radio, 
  Ambulance, 
  PhoneCall, 
  Bell, 
  X, 
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  Vibrate
} from 'lucide-react';

interface SmartwatchSyncTabProps {
  smartwatch: SmartwatchState;
  onSimulateDangerZone: () => void;
  onDispatchEmergency: () => void;
  language: Language;
}

export const SmartwatchSyncTab: React.FC<SmartwatchSyncTabProps> = ({
  smartwatch,
  onSimulateDangerZone,
  onDispatchEmergency,
  language,
}) => {
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const [isAutoDispatched, setIsAutoDispatched] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Monitor danger zone state changes and launch alarm sound + phone vibration
  useEffect(() => {
    if (smartwatch.isInDangerZone) {
      setShowDangerModal(true);
      setCountdownSeconds(10);
      setIsAutoDispatched(false);
      setIsMuted(false);
      // Trigger Siren Sound and Phone Vibration
      emergencyAlarm.startAlarm();
    }
  }, [smartwatch.isInDangerZone]);

  // Handle siren mute/unmute
  const toggleMuteAlarm = () => {
    if (isMuted) {
      emergencyAlarm.startAlarm();
      setIsMuted(false);
    } else {
      emergencyAlarm.stopAlarm();
      setIsMuted(true);
    }
  };

  // Countdown timer for unresponded smartwatch cardiac alarm
  useEffect(() => {
    let interval: any;
    if (showDangerModal && countdownSeconds > 0) {
      interval = setInterval(() => {
        setCountdownSeconds((prev) => prev - 1);
      }, 1000);
    } else if (showDangerModal && countdownSeconds === 0 && !isAutoDispatched) {
      // Auto dispatch first responder & ambulance if patient does not respond
      setIsAutoDispatched(true);
      onDispatchEmergency();
    }
    return () => clearInterval(interval);
  }, [showDangerModal, countdownSeconds, isAutoDispatched, onDispatchEmergency]);

  const handlePatientImOk = () => {
    emergencyAlarm.stopAlarm();
    setShowDangerModal(false);
    setIsAutoDispatched(false);
  };

  const handleImmediateDispatch = () => {
    setIsAutoDispatched(true);
    onDispatchEmergency();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Smartwatch Banner & Connection Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Dark Purple/Burgundy Circle Glow on Left */}
        <div className="absolute -left-12 -bottom-12 w-72 h-72 bg-purple-950/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 p-3 bg-rose-950/80 border border-rose-500/40 rounded-2xl flex items-center justify-center text-rose-500 shrink-0 shadow-inner">
              <Watch className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {language === 'ar' ? 'اقتران الساعة الذكية والإنذار الحيوي الذكي' : t('smartwatchTitle', language)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {language === 'ar' ? 'مراقبة العلامات الحيوية بشكل مستمر وإرسال إنذار طارئ فور دخول نبضات القلب لحارة الخطر أو التوقف' : t('smartwatchDesc', language)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <span className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              <span>{language === 'ar' ? 'متصل بالساعة الذكية (Apple Watch / Galaxy Watch)' : t('watchStatusConnected', language)}</span>
            </span>

            <span className="bg-slate-800/90 text-slate-200 text-xs sm:text-sm px-3.5 py-2 rounded-xl font-bold border border-slate-700 flex items-center gap-1.5 shadow-sm">
              <BatteryCharging className="w-4 h-4 text-amber-400" />
              <span>{smartwatch.batteryLevel}%</span>
            </span>
          </div>

        </div>
      </div>

      {/* Main Grid: Live Watch Vitals + Danger Simulation Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Vitals Monitor Display */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>العلامات الحيوية المستمرة من الساعة الذكية</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              تحديث تلقائي: {smartwatch.currentVitals.timestamp}
            </span>
          </div>

          {/* Vitals Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Heart Rate */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-semibold">
                <span>نبضات القلب</span>
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 animate-pulse" />
              </div>
              <div className="pt-1">
                <span className="text-3xl sm:text-4xl font-black text-rose-300 tracking-tight block">
                  {smartwatch.currentVitals.heartRate}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">bpm (نبضة/دقيقة)</span>
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-semibold">
                <span>ضغط الدم</span>
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
              <div className="pt-1">
                <span className="text-2xl sm:text-3xl font-black text-teal-300 tracking-tight block">
                  {smartwatch.currentVitals.bloodPressure}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">mmHg</span>
              </div>
            </div>

            {/* SpO2 */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-semibold">
                <span>مستوى الأكسجين</span>
                <Radio className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="pt-1">
                <span className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-tight block">
                  {smartwatch.currentVitals.oxygenSaturation}%
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">SpO2</span>
              </div>
            </div>

            {/* Blood Sugar */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-semibold">
                <span>مسار السكر</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="pt-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight block">
                  {smartwatch.currentVitals.bloodSugar}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">mg/dL</span>
              </div>
            </div>

          </div>

          {/* ECG Waveform Animation Graphic */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              تخطيط القلب المباشر (ECG Stream)
            </span>
            <div className="h-20 bg-slate-900 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden relative">
              <div className="w-full h-1 bg-rose-500/30 absolute" />
              <div className="flex items-center justify-around w-full text-rose-500 font-mono text-xs opacity-80 animate-pulse">
                <span>/\_/\____/\_</span>
                <span>/\_/\____/\_</span>
                <span>/\_/\____/\_</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Emergency Danger Test Simulation Trigger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400 border-b border-slate-800 pb-3">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
              <h3 className="font-bold text-base text-white">
                تجربة خوارزمية إنذار الخطر القلبي
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              عند دخول نبضات القلب لحارة الخطر الشديد أو التوقف المفاجئ، يتم إرسال إشعار فوري لحساب المريض مع عد تنازلي (10 ثوانٍ). وفي حال عدم استجابة المريض، تحرك سيارة الإسعاف والمستجيب الأول تلقائياً.
            </p>
          </div>

          <button
            id="simulate-danger-btn"
            onClick={onSimulateDangerZone}
            className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm transition shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2"
          >
            <AlertOctagon className="w-5 h-5" />
            <span>{t('simulateHeartAttack', language)}</span>
          </button>
        </div>

      </div>

      {/* EMERGENCY SMARTWATCH PATIENT ALERT MODAL (عند دخول نبضات القلب لحارة الخطر) */}
      {showDangerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden text-white p-6 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-rose-950 border-2 border-rose-500 flex items-center justify-center mx-auto text-rose-400 animate-bounce">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-rose-300">
                {t('dangerModalTitle', language)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-bold">
                {t('dangerModalMsg', language)}
              </p>
            </div>

            {/* Siren & Vibration Status Banner */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${!isMuted ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
                <span>{isMuted ? 'صفارة الإنذار مكتومة' : 'صفارة الإنذار تعمل (صوت مرتفع)'}</span>
              </span>

              <span className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/50 text-rose-300 animate-pulse">
                <Vibrate className="w-3.5 h-3.5 text-rose-400" />
                <span>اهتزاز الهاتف مفعّل (الهزاز)</span>
              </span>

              <button
                onClick={toggleMuteAlarm}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition flex items-center gap-1"
              >
                {isMuted ? '🔊 تشغيل الصوت' : '🔇 كتم الصوت'}
              </button>
            </div>

            {!isAutoDispatched ? (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-400">
                  {t('autoDispatchCountDown', language)}
                </p>
                <span className="text-4xl font-black text-rose-400 font-mono block animate-pulse">
                  {countdownSeconds} {t('seconds', language)}
                </span>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950 border border-emerald-600 rounded-xl space-y-2 text-emerald-300 text-xs font-bold">
                <Ambulance className="w-6 h-6 mx-auto animate-pulse text-emerald-400" />
                <p>تم تحريك سيارة الإسعاف والمستجيب الأول فوراً إلى موقعك بالدوحة!</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handlePatientImOk}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition border border-slate-700"
              >
                {t('patientImOk', language)}
              </button>

              <button
                onClick={handleImmediateDispatch}
                className="py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs transition shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1.5"
              >
                <Ambulance className="w-4 h-4" />
                <span>{t('dispatchFirstResponseNow', language)}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
