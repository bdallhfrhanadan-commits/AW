import React, { useState } from 'react';
import { TrafficComplaint, Language } from '../types';
import { t } from '../utils/language';
import { 
  ShieldAlert, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Car, 
  MapPin, 
  Send, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface TrafficComplaintsTabProps {
  complaints: TrafficComplaint[];
  onAddComplaint: (newComplaint: TrafficComplaint) => void;
  language: Language;
}

export const TrafficComplaintsTab: React.FC<TrafficComplaintsTabProps> = ({
  complaints,
  onAddComplaint,
  language,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedPlate, setExtractedPlate] = useState('');
  const [violationType, setViolationType] = useState('عرقلة سير سيارة الإسعاف طوارئ');
  const [locationName, setLocationName] = useState('طريق 22 فبراير - الدوحة، قطر');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Sample Car image for camera simulation
  const sampleCarImages = [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  ];

  // Handle Photo Select / Simulation
  const handleSelectSampleImage = async (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setExtractedPlate('');

    try {
      // Call Gemini OCR server endpoint
      const response = await fetch('/api/gemini/ocr-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageUrl }),
      });

      const data = await response.json();
      setExtractedPlate(data.extractedPlate || '549102 QTR');
    } catch (err) {
      console.error('OCR Plate extraction error:', err);
      setExtractedPlate('549102 QTR');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        handleSelectSampleImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedPlate) return;

    setIsSubmitting(true);

    const newComplaint: TrafficComplaint = {
      id: `complaint-${Date.now()}`,
      plateNumber: extractedPlate,
      violationTypeAr: violationType,
      violationTypeEn: 'Obstructing Ambulance Emergency Path',
      locationName,
      timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-QA' : 'en-US'),
      status: 'approved_traffic_dept',
      ticketId: `QTR-TRF-${Math.floor(10000 + Math.random() * 90000)}`,
      imageUrl: selectedImage || sampleCarImages[0],
    };

    setTimeout(() => {
      onAddComplaint(newComplaint);
      setIsSubmitting(false);
      setSubmitSuccessMsg(
        `${t('reportSubmittedSuccess', language)}: ${newComplaint.ticketId}`
      );

      // Reset form
      setSelectedImage(null);
      setExtractedPlate('');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Title & Description Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-950 border border-amber-600/60 rounded-xl text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t('trafficTitle', language)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('trafficDesc', language)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & AI OCR Form on Left, Log on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload & Form Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Camera className="w-5 h-5 text-amber-400" />
            <span>التقاط المخالفة وتحديد نوعها تلقائياً</span>
          </h3>

          {/* Image Selection Area */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              {t('uploadObstructionPhoto', language)}
            </label>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {sampleCarImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSampleImage(img)}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img
                      ? 'border-amber-500 shadow-md shadow-amber-950/50 scale-105'
                      : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Vehicle sample" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[9px] text-white px-1.5 py-0.5 rounded">
                    صورة {idx + 1}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-950/60">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs text-slate-300 font-bold block">
                اضغط هنا لالتقاط أو تحميل صورة من الكاميرا
              </span>
              <span className="text-[10px] text-slate-500">
                (سيقوم الذكاء الاصطناعي بقراءة أرقام لوحة السيارة فوراً)
              </span>
            </div>
          </div>

          {/* AI Extracted Plate Number Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {t('detectedPlateNumber', language)}
              </span>
              {isAnalyzing && (
                <span className="text-xs text-teal-400 flex items-center gap-1 font-semibold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  جارِ تحليل الصورة بالذكاء الاصطناعي...
                </span>
              )}
            </div>

            <div className="relative">
              <Car className="w-5 h-5 text-amber-400 absolute left-3 top-3" />
              <input
                type="text"
                value={extractedPlate}
                onChange={(e) => setExtractedPlate(e.target.value)}
                placeholder="مثال: 549102 QTR"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 pl-10 text-lg font-black tracking-widest text-amber-300 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
          </div>

          {/* Form inputs */}
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            
            {/* Violation Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('violationType', language)}
              </label>
              <select
                value={violationType}
                onChange={(e) => setViolationType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              >
                <option value="عرقلة سير سيارة الإسعاف طوارئ">
                  {t('violationObstruction', language)}
                </option>
                <option value="عدم إفساح الطريق للمركبة الطارئة">
                  {t('violationNoWay', language)}
                </option>
                <option value="استخدام مسار الطوارئ المخصص">
                  {t('violationEmergencyLane', language)}
                </option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                موقع الحادث بالدوحة
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            {submitSuccessMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{submitSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!extractedPlate || isSubmitting}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارِ الإرسال لإدارة المرور بقطر...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('sendTrafficReport', language)}</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Previous Complaints & Traffic Dept Transmission Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>سجل الشكاوى المرسلة لإدارة المرور</span>
            </h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-bold">
              {complaints.length} بلاغات
            </span>
          </div>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {complaints.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 font-mono bg-amber-950/80 border border-amber-800/80 px-2.5 py-0.5 rounded-md">
                    {item.plateNumber}
                  </span>

                  <span className="text-[10px] bg-emerald-950 border border-emerald-600/80 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    مستلمة بالمرور
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="Violation preview"
                      className="w-20 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                  )}
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-white">{item.violationTypeAr}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {item.locationName}
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      الرقم المرجعي: {item.ticketId} | {item.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
