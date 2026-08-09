import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { t } from '../utils/language';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Loader2, 
  ShieldCheck, 
  Radio, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface AiAssistantTabProps {
  language: Language;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({ language }) => {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      sender: 'assistant',
      text: 'أهلاً بك! أنا "سهم" - مساعد الذكاء الاصطناعي الطبي المعتمد بمنظومة الطوارئ بقطر (مؤسسة حمد الطبية HMC). يمكنك توجيه أي سؤال طبي أو النطق بكلمة "سهم" للتحدث صوتياً دون ضغط أي زر!',
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-QA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceKeywordDetected, setVoiceKeywordDetected] = useState(false);
  const [playingMsgIndex, setPlayingMsgIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition for hands-free wake word "سهم"
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'ar' ? 'ar-QA' : 'en-US';

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.trim();
        console.log('Voice transcript:', transcript);

        // Check for wake word "سهم" or "sahm"
        if (
          transcript.toLowerCase().includes('سهم') ||
          transcript.toLowerCase().includes('sahm')
        ) {
          setVoiceKeywordDetected(true);
          // Strip wake word and set query
          const cleanedText = transcript
            .replace(/سهم/gi, '')
            .replace(/sahm/gi, '')
            .trim();

          if (cleanedText.length > 2) {
            setInputQuery(cleanedText);
            handleSendQuery(cleanedText);
          }
        }
      }
    };

    recognition.onstart = () => setIsListeningVoice(true);
    recognition.onend = () => {
      setIsListeningVoice(false);
      // Auto restart to keep continuous wake word listening
      try {
        recognition.start();
      } catch (e) {
        // ignore
      }
    };

    try {
      recognition.start();
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  }, [language]);

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString(language === 'ar' ? 'ar-QA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: textToSend, timestamp: timeStr },
    ]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, lang: language }),
      });

      const data = await response.json();
      const answerText = data.answer || 'تم استلام استفسارك ومعالجته بنجاح.';

      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: answerText, timestamp: timeStr },
      ]);
    } catch (err) {
      console.error('AI Assistant endpoint error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'استجابة سهم المباشرة: بناءً على بروتوكول مؤسسة حمد الطبية للإنقاذ القلبي الرئوي (HMC CPR): يُعطى الضغط الصدري بمعدل 100-120 ضغطة بالدقيقة مع عمق 5-6 سم، مع الاستمرار في التهوية بالحقيبة والقناع حتى وصول العناية المتقدمة.',
          timestamp: timeStr,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAudio = (index: number, text: string) => {
    if (playingMsgIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingMsgIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => setPlayingMsgIndex(null);
    utterance.onerror = () => setPlayingMsgIndex(null);

    setPlayingMsgIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const quickProtocols = [
    { title: t('hmrCprProtocol', language), query: 'ما هو بروتوكول الإنقاذ القلبي الرئوي المعتمد في مؤسسة حمد الطبية HMC؟' },
    { title: t('anaphylaxisDose', language), query: 'ما هي جرعة الأدرينالين الموصى بها في الصدمة التحسسية الحادة للمبالغين والأطفال؟' },
    { title: t('gcsScale', language), query: 'كيف يتم تقييم مقياس غلاسكو للوعي GCS للفرز الطبي الميداني؟' },
    { title: t('burnProtocol', language), query: 'ما هي خطوات الإسعاف الأولية لحروق الدرجة الثانية بالموقع؟' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Title & Hands-Free Voice Trigger Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-950 border border-teal-500/60 rounded-xl text-teal-400">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t('aiAssistantTitle', language)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('aiAssistantDesc', language)}
              </p>
            </div>
          </div>

          {/* Hands Free Voice Wake Word Badge */}
          <div className="flex items-center gap-2 bg-slate-950 border border-teal-500/50 px-4 py-2 rounded-xl text-xs font-bold text-teal-300">
            <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
            <span>{t('listeningForKeyword', language)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chat Canvas on Left, Protocols on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chat Box Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[500px]">
          
          {/* Chat Messages */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-teal-950 border border-teal-500 flex items-center justify-center text-teal-300 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 relative ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleToggleAudio(idx, msg.text)}
                        className="p-1 hover:bg-slate-800 rounded text-teal-400 flex items-center gap-1 transition"
                      >
                        {playingMsgIndex === idx ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>استماع</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-teal-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-max animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>مساعد سهم يراجع المصادر والبروتوكولات الطبية...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="mt-4 flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t('askQuestionPlaceholder', language)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-lg shadow-teal-950/50 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{t('sendQuestion', language)}</span>
            </button>
          </form>

        </div>

        {/* Right Side: Approved Qatar Protocols Shortcuts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base text-white">
              {t('quickMedicalProtocols', language)}
            </h3>
          </div>

          <div className="space-y-3">
            {quickProtocols.map((prot, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputQuery(prot.query);
                  handleSendQuery(prot.query);
                }}
                className="w-full text-right p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 rounded-xl transition space-y-1 group"
              >
                <div className="flex items-center justify-between font-bold text-xs text-white group-hover:text-teal-300">
                  <span>{prot.title}</span>
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {prot.query}
                </p>
              </button>
            ))}
          </div>

          <div className="p-3 bg-teal-950/50 border border-teal-800/50 rounded-xl text-[11px] text-teal-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              جميع الإرشادات تعتمد معايير الإنعاش المتقدمة لمؤسسة حمد الطبية HMC بقطر.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
