import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  language?: 'ar' | 'en';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  language = 'ar',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative overflow-hidden rounded-xl bg-white p-1 border border-emerald-500/30 shadow-md shadow-emerald-950/20 flex-shrink-0 ${sizeClasses[size]}`}>
        <img
          src="/logo.png"
          alt="المستجيب الأول - First Responder"
          className="w-full h-full object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none font-sans">
              {language === 'ar' ? 'المستجيب الأول' : 'First Responder'}
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
              قطر 🇶🇦
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold tracking-wide mt-0.5">
            {language === 'ar' ? 'منظومة سهم للطوارئ الطبية' : 'Sahm Emergency Medical System'}
          </span>
        </div>
      )}
    </div>
  );
};
