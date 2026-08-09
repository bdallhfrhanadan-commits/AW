import React, { useState, useEffect } from 'react';
import { QatarHospital, Language } from '../types';
import { t } from '../utils/language';
import { 
  MapPin, 
  Hospital, 
  Ambulance, 
  CheckCircle2, 
  Send, 
  Radio, 
  Navigation, 
  Zap, 
  Building2, 
  Phone, 
  BedDouble, 
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

interface QatarMapTabProps {
  hospitals: QatarHospital[];
  language: Language;
  onSendAshghalAlert: () => void;
}

export const QatarMapTab: React.FC<QatarMapTabProps> = ({
  hospitals,
  language,
  onSendAshghalAlert,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<QatarHospital | null>(hospitals[0] || null);
  const [isGreenWaveActive, setIsGreenWaveActive] = useState(true);
  const [ashghalSentMsg, setAshghalSentMsg] = useState('');
  
  // Simulated Ambulance GPS position along Qatar emergency corridor
  const [ambulanceProgress, setAmbulanceProgress] = useState(35); // 0 to 100%
  const [isTrackingActive, setIsTrackingActive] = useState(true);

  // Animated GPS progression simulation
  useEffect(() => {
    if (!isTrackingActive) return;
    const interval = setInterval(() => {
      setAmbulanceProgress((prev) => (prev >= 100 ? 5 : prev + 2.5));
    }, 1500);
    return () => clearInterval(interval);
  }, [isTrackingActive]);

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAshghalDispatch = () => {
    onSendAshghalAlert();
    setAshghalSentMsg(t('ashghalSentMsg', language));
    setTimeout(() => setAshghalSentMsg(''), 5000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Banner & Control Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute left-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950 border border-emerald-500/60 rounded-xl text-emerald-400">
              <Navigation className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t('qatarMapTitle', language)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('qatarMapDesc', language)}
              </p>
            </div>
          </div>

          {/* Green Wave & Ashghal Direct Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Green Wave Signal Toggle */}
            <button
              onClick={() => setIsGreenWaveActive(!isGreenWaveActive)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 border ${
                isGreenWaveActive
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Zap className={`w-4 h-4 ${isGreenWaveActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{t('greenWaveActive', language)}</span>
            </button>

            {/* Send Ashghal Alert Button */}
            <button
              id="send-ashghal-alert-btn"
              onClick={handleAshghalDispatch}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-teal-950/50 flex items-center gap-2"
            >
              <Radio className="w-4 h-4 animate-ping" />
              <span>{t('sendAshghalMsg', language)}</span>
            </button>

          </div>
        </div>

        {ashghalSentMsg && (
          <div className="mt-4 p-3 bg-emerald-950 border border-emerald-600 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{ashghalSentMsg}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map Canvas + Qatar Hospitals List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Simulated Map Canvas with Route & Green Signals */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          
          {/* Map Controls Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Ambulance className="w-4 h-4" />
              <span>{t('trackAmbulance', language)} (كود الإسعاف: Sahm-04)</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                إشارات خضراء مفتوحة
              </span>
              <span className="text-slate-400 font-mono">
                السرعة: 85 km/h
              </span>
            </div>
          </div>

          {/* Map Display Box */}
          <div className="relative w-full h-[460px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
            
            {/* Map Background Grid graphic */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Qatar Outline Graphic Context */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2 text-[11px] text-slate-300 font-bold">
              📍 خريطة قطر التفاعلية للطوارئ
            </div>

            {/* Traffic Signal Lights Along Emergency Corridor */}
            <div className="absolute top-1/2 left-12 right-12 -translate-y-1/2 flex justify-between items-center z-10 pointer-events-none">
              {[1, 2, 3, 4, 5].map((sig) => (
                <div key={sig} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-10 rounded-lg bg-slate-950 border border-slate-800 p-1 flex flex-col justify-between items-center shadow-lg ${isGreenWaveActive ? 'border-emerald-500' : ''}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className={`w-2.5 h-2.5 rounded-full ${isGreenWaveActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-rose-600'}`} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">إشارة {sig}</span>
                </div>
              ))}
            </div>

            {/* Emergency Route Line Graphic */}
            <div className="absolute top-1/2 left-12 right-12 h-2 bg-slate-800 rounded-full -translate-y-1/2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${ambulanceProgress}%` }}
              />
            </div>

            {/* Moving Ambulance Marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-500"
              style={{ left: `calc(${ambulanceProgress}% - 20px)` }}
            >
              <div className="p-2.5 bg-emerald-600 text-white rounded-full shadow-2xl border-2 border-white animate-bounce flex items-center justify-center">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="bg-slate-900 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500 mt-1 whitespace-nowrap shadow-md">
                سيارة إسعاف سهم
              </div>
            </div>

            {/* Hospitals Markers on Map */}
            <div className="relative z-10 flex items-end justify-between mt-auto">
              {hospitals.slice(0, 4).map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHospital(h)}
                  className={`p-2.5 rounded-xl border text-right transition flex items-center gap-2 ${
                    selectedHospital?.id === h.id
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-lg'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Hospital className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-[11px]">
                    <span className="font-bold block">{language === 'ar' ? h.nameAr : h.nameEn}</span>
                    <span className="text-[9px] text-slate-500">أسرة المتاحة: {h.availableBeds}</span>
                  </div>
                </button>
              ))}
            </div>

          </div>

          {/* Hospital Details Bar */}
          {selectedHospital && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">
                  {language === 'ar' ? selectedHospital.nameAr : selectedHospital.nameEn}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    {selectedHospital.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                    أسرة الطوارئ المتاحة: {selectedHospital.availableBeds}
                  </span>
                </p>
              </div>

              <a
                href={`tel:${selectedHospital.phone}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>الاتصال بالطوارئ</span>
              </a>
            </div>
          )}

        </div>

        {/* Right Side: List of Qatar Hospitals & Search Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>{t('allHospitals', language)}</span>
            </h3>
            <span className="text-xs text-slate-400">{filteredHospitals.length} موقع</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchHospital', language)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 pl-9 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Hospitals List */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredHospitals.map((h) => (
              <div
                key={h.id}
                onClick={() => setSelectedHospital(h)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  selectedHospital?.id === h.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-white">
                      {language === 'ar' ? h.nameAr : h.nameEn}
                    </h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{h.type === 'hospital' ? 'مستشفى عام' : 'مركز صحي PHCC'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{h.phone}</span>
                    </p>
                  </div>

                  <span className="bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                    {h.availableBeds} أسرة
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
