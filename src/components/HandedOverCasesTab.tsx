import React, { useState } from 'react';
import { FirstResponderReport, Language, UserRole } from '../types';
import { t } from '../utils/language';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Video, 
  VideoOff, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Award, 
  TrendingUp, 
  PhoneCall, 
  Mic, 
  MicOff, 
  Send,
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface HandedOverCasesTabProps {
  cases: FirstResponderReport[];
  language: Language;
  userRole: UserRole;
  userName: string;
}

export const HandedOverCasesTab: React.FC<HandedOverCasesTabProps> = ({
  cases,
  language,
  userRole,
  userName,
}) => {
  const [playingCaseId, setPlayingCaseId] = useState<string | null>(null);
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesisUtterance | null>(null);

  // Video Call State (Google Meet direct Doctor-Paramedic Link)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [activeCallCase, setActiveCallCase] = useState<FirstResponderReport | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [doctorInstructionsInput, setDoctorInstructionsInput] = useState('');
  const [callNotes, setCallNotes] = useState<string[]>([
    'تم تلقي الإشارة الحيوية المباشرة من موقع الحادث بالدوحة.',
    'تأكيد إعطاء حقنة أدرينالين 0.5mg عضل واستمرار الضغط السلبي.',
  ]);

  // Sort cases by priority: critical -> urgent -> stable
  const priorityMap = { critical: 1, urgent: 2, stable: 3 };
  const sortedCases = [...cases].sort(
    (a, b) => priorityMap[a.priority] - priorityMap[b.priority]
  );

  // Speech Output Handler for Audio Playback of Reports
  const handleToggleAudioReport = (report: FirstResponderReport) => {
    if (playingCaseId === report.id) {
      window.speechSynthesis.cancel();
      setPlayingCaseId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const reportText = language === 'ar'
      ? `تقرير المستجيب الأول للحالة ${report.patientNameAr}. عمر المريض ${report.patientAge} سنة. العلامات الحيوية: ضغط الدم ${report.vitals.bloodPressure}، السكر ${report.vitals.bloodSugar}، الأكسجين ${report.vitals.oxygenSaturation} بالمئة، الحرارة ${report.vitals.temperature} درجات، نبضات القلب ${report.vitals.heartRate}. الشكوى الرئيسية: ${report.chiefComplaintAr}. الملاحظات: ${report.responderNotesAr}. حالة التدخل: ${report.requiresAmbulanceIntervention ? 'يحتاج تدخل إسعافي عاجل' : 'الحالة مستقرة بالموقع'}.`
      : `First responder report for patient ${report.patientNameEn}. Age ${report.patientAge}. Vital signs: Blood pressure ${report.vitals.bloodPressure}, Blood sugar ${report.vitals.bloodSugar}, Oxygen ${report.vitals.oxygenSaturation} percent, Temperature ${report.vitals.temperature} Celsius, Heart rate ${report.vitals.heartRate}. Chief complaint: ${report.chiefComplaintEn}. Notes: ${report.responderNotesEn}. Status: ${report.requiresAmbulanceIntervention ? 'Urgent ambulance intervention required' : 'Controlled on scene'}.`;

    const utterance = new SpeechSynthesisUtterance(reportText);
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setPlayingCaseId(null);
    utterance.onerror = () => setPlayingCaseId(null);

    setSpeechSynth(utterance);
    setPlayingCaseId(report.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorInstructionsInput.trim()) return;
    setCallNotes((prev) => [...prev, `[${userName}]: ${doctorInstructionsInput}`]);
    setDoctorInstructionsInput('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner & KPI Achievement Stats (نسبة الإنجاز) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Achievement Card (نسبة الإنجاز) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  {t('completionRate', language)}
                </h3>
                <p className="text-xs text-slate-400">
                  {t('completionRateSub', language)}
                </p>
              </div>
            </div>
            <span className="text-2xl font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-1 rounded-xl">
              94.8%
            </span>
          </div>

          {/* Progress Bar & Sub Metrics */}
          <div className="space-y-3">
            <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-2.5 rounded-full w-[94.8%] shadow-sm shadow-emerald-500/50 animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                  زمن الاستجابة
                </span>
                <span className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  4.2 دقيقة
                </span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                  حالات مكتملة
                </span>
                <span className="text-sm font-bold text-teal-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  18 حالة اليوم
                </span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                  تقييم الأداء
                </span>
                <span className="text-sm font-bold text-cyan-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  ممتاز (أعلاها)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Google Meet Video Call Quick Launch Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-800/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Video className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Google Meet Consultation
              </span>
            </div>
            <h4 className="text-base font-bold text-white mb-2 leading-snug">
              {t('videoCallDoctorParamedic', language)}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              تواصل مرئي ومباشر بالصوت والصورة ونقل المؤشرات الحيوية فوراً من موقع الحادث للمستشفى.
            </p>
          </div>

          <button
            id="start-video-call-btn"
            onClick={() => {
              setActiveCallCase(sortedCases[0] || null);
              setIsVideoCallActive(true);
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>{t('startVideoCall', language)}</span>
          </button>
        </div>

      </div>

      {/* Main Cases Section - Handed Over Cases sorted by priority */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {t('handedOverCases', language)}
              </h2>
              <p className="text-xs text-slate-400">
                مرتبة آلياً حسب أولوية الفرز الطبي (Priority Triage)
              </p>
            </div>
          </div>

          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-bold border border-slate-700">
            {cases.length} حالات مسجلة
          </span>
        </div>

        {/* List of Patient Case Cards */}
        <div className="space-y-6">
          {sortedCases.map((item) => {
            const isPlaying = playingCaseId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-slate-900 border rounded-2xl p-6 transition shadow-xl relative overflow-hidden ${
                  item.priority === 'critical'
                    ? 'border-rose-600/70 shadow-rose-950/20'
                    : item.priority === 'urgent'
                    ? 'border-amber-500/60 shadow-amber-950/20'
                    : 'border-emerald-600/50 shadow-emerald-950/20'
                }`}
              >
                {/* Priority Ribbon Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        item.priority === 'critical'
                          ? 'bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse'
                          : item.priority === 'urgent'
                          ? 'bg-amber-950/90 text-amber-300 border-amber-500'
                          : 'bg-emerald-950/90 text-emerald-300 border-emerald-600'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {item.priority === 'critical'
                        ? t('priorityCritical', language)
                        : item.priority === 'urgent'
                        ? t('priorityUrgent', language)
                        : t('priorityStable', language)}
                    </span>

                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.handedOverAt}
                    </span>
                  </div>

                  {/* Audio Readout & Video Call Launch for Case */}
                  <div className="flex items-center gap-2">
                    
                    {/* Audio Playback Button */}
                    <button
                      id={`audio-play-${item.id}`}
                      onClick={() => handleToggleAudioReport(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                        isPlaying
                          ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-slate-700'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4 text-white" />
                          <span>{t('stopAudioReport', language)}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-teal-400" />
                          <span>{t('playAudioReport', language)}</span>
                        </>
                      )}
                    </button>

                    {/* Launch Direct Call Button */}
                    <button
                      onClick={() => {
                        setActiveCallCase(item);
                        setIsVideoCallActive(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Meet Call</span>
                    </button>
                  </div>
                </div>

                {/* Patient Information & Vitals First Section */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Patient Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                        <User className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">
                          {language === 'ar' ? item.patientNameAr : item.patientNameEn}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          QID: {item.patientQid} | {item.patientAge} سنة | {item.gender === 'male' ? 'ذكر' : 'أنثى'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item.locationName}</span>
                    </p>
                  </div>

                  {/* Vitals Signs Card (عرض العلامات الحيوية أولاً) */}
                  <div className="md:col-span-2 bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Activity className="w-4 h-4" />
                        {t('vitalSigns', language)} (مأخوذة فورياً)
                      </span>
                      <span className="text-[10px] text-slate-500">{item.vitals.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                      
                      {/* BP */}
                      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {t('bloodPressure', language)}
                        </span>
                        <span className="text-sm font-black text-rose-300">
                          {item.vitals.bloodPressure}
                        </span>
                        <span className="text-[9px] text-slate-500 block">mmHg</span>
                      </div>

                      {/* Sugar */}
                      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {t('bloodSugar', language)}
                        </span>
                        <span className="text-sm font-black text-amber-300">
                          {item.vitals.bloodSugar}
                        </span>
                        <span className="text-[9px] text-slate-500 block">mg/dL</span>
                      </div>

                      {/* SpO2 */}
                      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {t('oxygenSaturation', language)}
                        </span>
                        <span className="text-sm font-black text-cyan-300">
                          {item.vitals.oxygenSaturation}%
                        </span>
                        <span className="text-[9px] text-slate-500 block">SpO2</span>
                      </div>

                      {/* Temp */}
                      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {t('temperature', language)}
                        </span>
                        <span className="text-sm font-black text-orange-300">
                          {item.vitals.temperature}°C
                        </span>
                        <span className="text-[9px] text-slate-500 block">الحرارة</span>
                      </div>

                      {/* HR */}
                      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {t('heartRate', language)}
                        </span>
                        <span className="text-sm font-black text-emerald-300">
                          {item.vitals.heartRate}
                        </span>
                        <span className="text-[9px] text-slate-500 block">bpm</span>
                      </div>

                    </div>
                  </div>

                </div>

                {/* First Responder Report Box (تقرير المستجيب الأول) */}
                <div className="mt-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>{t('firstResponderReport', language)}</span>
                      <span className="text-[10px] text-slate-400">({item.paramedicName})</span>
                    </div>

                    {/* Urgent Ambulance Intervention Indicator (تقرير التدخل الإسعافي) */}
                    <div className="flex items-center gap-1.5">
                      {item.requiresAmbulanceIntervention ? (
                        <span className="bg-rose-950/80 border border-rose-600 text-rose-300 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {t('ambulanceInterventionNeeded', language)}
                        </span>
                      ) : (
                        <span className="bg-emerald-950/80 border border-emerald-600 text-emerald-300 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t('ambulanceInterventionNotNeeded', language)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">الشكوى رئيسية:</span>
                    <p className="text-xs text-white font-medium leading-relaxed">
                      {language === 'ar' ? item.chiefComplaintAr : item.chiefComplaintEn}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">ملاحظات المسعف والإجراءات:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'ar' ? item.responderNotesAr : item.responderNotesEn}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Google Meet Video Consultation Call Modal Screen */}
      {isVideoCallActive && activeCallCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden text-white flex flex-col max-h-[90vh]">
            
            {/* Meet Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-sm sm:text-base">
                  Google Meet Direct Medical Call | {language === 'ar' ? activeCallCase.patientNameAr : activeCallCase.patientNameEn}
                </span>
              </div>
              <button
                onClick={() => setIsVideoCallActive(false)}
                className="p-1.5 bg-rose-900/60 hover:bg-rose-800 rounded-xl text-rose-200 text-xs font-bold transition flex items-center gap-1"
              >
                <PhoneCall className="w-4 h-4 rotate-135" />
                <span>{t('endCall', language)}</span>
              </button>
            </div>

            {/* Video Canvas & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 p-4 gap-4 overflow-y-auto">
              
              {/* Main Video Stream Simulator */}
              <div className="lg:col-span-2 space-y-3">
                <div className="relative aspect-video bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center group">
                  {/* Doctor/Paramedic simulated view */}
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80" 
                    alt="Emergency Field Video"
                    className="w-full h-full object-cover opacity-80" 
                  />

                  {/* On Screen Vitals Overlay */}
                  <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 rounded-lg p-2 text-[10px] space-y-1">
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <Activity className="w-3 h-3 animate-pulse" />
                      <span>نبضات القلب: {activeCallCase.vitals.heartRate} bpm</span>
                    </div>
                    <div className="text-cyan-400">
                      الأكسجين: {activeCallCase.vitals.oxygenSaturation}% SpO2
                    </div>
                    <div className="text-rose-400">
                      ضغط الدم: {activeCallCase.vitals.bloodPressure}
                    </div>
                  </div>

                  {/* Doctor PIP */}
                  <div className="absolute bottom-3 right-3 w-32 aspect-video bg-slate-900 border-2 border-emerald-500 rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80" 
                      alt="Doctor PIP"
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[8px] text-white px-1 rounded">
                      د. سهم العلي
                    </span>
                  </div>
                </div>

                {/* Call Control Buttons */}
                <div className="flex items-center justify-center gap-4 py-2 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-3 rounded-full transition ${
                      isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    className={`p-3 rounded-full transition ${
                      isCameraOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsVideoCallActive(false)}
                    className="p-3 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition shadow-lg shadow-rose-900/50"
                  >
                    <PhoneCall className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Side: Doctor Direct Instructions & Tele-Notes Board */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[360px]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3 border-b border-slate-800 pb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{t('doctorInstructions', language)}</span>
                  </div>

                  <div className="space-y-2 text-xs max-h-52 overflow-y-auto pr-1">
                    {callNotes.map((note, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 text-[11px] leading-relaxed">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendInstruction} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={doctorInstructionsInput}
                    onChange={(e) => setDoctorInstructionsInput(e.target.value)}
                    placeholder="اكتب توجيهات الطبيب للمسعف..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
