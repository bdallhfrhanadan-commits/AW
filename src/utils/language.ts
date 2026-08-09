import { Language } from '../types';

export const translations = {
  ar: {
    appTitle: 'منظومة سهم',
    subTitle: 'المستجيب الأول للطوارئ الطبية',
    doctorRole: 'طبيب استشاري',
    paramedicRole: 'مسعف - مستجيب أول',
    patientRole: 'حساب المريض',
    switchLanguage: 'English',
    notifications: 'الإشعارات',
    noNotifications: 'لا توجد إشعارات جديدة',
    markAllAsRead: 'تحديد الكل كمقروء',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    
    // Auth & Form fields
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    qid: 'رقم البطاقة الشخصية (QID)',
    nameAr: 'الاسم الكامل باللغة العربية',
    nameEn: 'الاسم الكامل باللغة الإنجليزية',
    phone: 'رقم الهاتف (قطري)',
    selectRole: 'اختر نوع الحساب',
    createAccountBtn: 'تأكيد إنشاء الحساب',
    quickLoginNotice: 'حسابات الدخول الافتراضية المتاحة (اسم المستخدم: سهم / كلمة المرور: 123)',
    loginBtn: 'دخول النظام',
    
    // Navigation Tabs
    tabDashboard: 'الصفحة الرئيسية والتقارير',
    tabComplaints: 'الشكاوى والمخالفات المرورية',
    tabMaps: 'الخرائط وتتبع الإسعاف',
    tabAiAssistant: 'المساعد الذكي "سهم"',
    tabSmartwatch: 'الاقتران بالساعة الذكية',
    tabPatientFile: 'ملفي الطبي والحالة',
    
    // Dashboard
    handedOverCases: 'الحالات المسلمة والملف الصحي التفصيلي',
    priorityCritical: 'حرج للغاية (أولوية قصوى)',
    priorityUrgent: 'عاجل (أولوية متوسطة)',
    priorityStable: 'مستقر (أولوية عادية)',
    vitalSigns: 'العلامات الحيوية الحالية',
    bloodPressure: 'ضغط الدم',
    bloodSugar: 'مسار السكر',
    oxygenSaturation: 'مستوى الأكسجين',
    temperature: 'الحرارة',
    heartRate: 'نبضات القلب',
    
    firstResponderReport: 'تقرير المستجيب الأول',
    ambulanceInterventionNeeded: '🚨 يحتاج تدخل إسعافي عاجل',
    ambulanceInterventionNotNeeded: '✅ الحالة تحت السيطرة بالموقع',
    playAudioReport: 'استماع للتقرير صوتیًا',
    stopAudioReport: 'إيقاف الصوتي',
    
    completionRate: 'نسبة إنجاز الحالات الاستجابة',
    completionRateSub: 'معدل كفاءة الاستجابة السريعة اليوم',
    avgResponseTime: 'متوسط زمن الوصول: 4.2 دقيقة',
    completedCasesToday: 'حالة مكتملة اليوم: 18 حالة',
    
    videoCallDoctorParamedic: 'اتصال فيديو مباشر عبر Google Meet بين الطبيب والمسعف',
    startVideoCall: 'بدء مكالمة فيديو طبية طارئة',
    endCall: 'إنهاء المكالمة',
    doctorInstructions: 'تعليمات الطبيب المباشرة للمسعف',

    // Traffic Complaints
    trafficTitle: 'قسم الشكاوى ومخالفات عرقلة سيارة الإسعاف',
    trafficDesc: 'الالتقاط التلقائي للوحة المركبة المعرقلة بالذكاء الاصطناعي والإرسال المباشر لإدارة المرور بقطر',
    uploadObstructionPhoto: 'تحميل / التقاط صورة المركبة المعرقلة',
    detectedPlateNumber: 'أرقام لوحة السيارة المستخرجة آلياً',
    violationType: 'نوع المخالفة',
    violationObstruction: 'عرقلة مسار سيارة الإسعاف طوارئ',
    violationNoWay: 'عدم إفساح الطريق للمركبة المسرعة',
    violationEmergencyLane: 'استخدام مسار الطوارئ المخصص',
    sendTrafficReport: 'إرسال التقرير فوراً إلى إدارة المرور',
    reportSubmittedSuccess: 'تم إرسال المخالفة بنجاح إلى إدارة المرور بقطر وحفظها تحت الرقم المرجعي',
    
    // Maps & Ashghal
    qatarMapTitle: 'شبكة المستشفيات والمراكز الصحية وتتبع الإسعاف',
    qatarMapDesc: 'تتبع المستجيب الأول والتحكم الذكي بالإشارات الضوئية بالتنسيق مع هيئة الأشغال العامة',
    searchHospital: 'البحث عن مستشفى أو مركز صحي...',
    allHospitals: 'جميع مستشفيات قطر',
    emergencyBeds: 'أسرة الطوارئ المتاحة',
    trackAmbulance: 'تتبع حركة سيارة الإسعاف بالميدان',
    greenWaveActive: 'نظام الموجة الخضراء مفعّل (فتح جميع الإشارات تلقائياً)',
    sendAshghalMsg: 'إرسال إشعار فوري لهيئة الأشغال العامة (أشغال)',
    ashghalSentMsg: 'تم إرسال طلب تفريغ المسار الطارئ إلى هيئة الأشغال العامة بنجاح',
    
    // AI Assistant
    aiAssistantTitle: 'مساعد الذكاء الاصطناعي "سهم" للمصادر الطبية بقطر',
    aiAssistantDesc: 'يعمل بالصوت التلقائي بنطق كلمة "سهم" بدون ضغط أي زر. مدعوم ببروتوكولات مؤسسة حمد الطبية وزارة الصحة العامة',
    listeningForKeyword: '🎧 يستمع الآن... انطق كلمة "سهم" لسؤاله مباشرة',
    speechRecognitionSupported: 'خاصية الاستجابة الصوتية بكلمة "سهم" نشطة',
    askQuestionPlaceholder: 'اكتب سؤالك الطبي أو انطق "سهم"...',
    sendQuestion: 'إرسال',
    quickMedicalProtocols: 'المصادر الطبية السريعة بقطر',
    hmrCprProtocol: 'بروتوكول الإنقاذ القلبي الرئوي HMC CPR',
    anaphylaxisDose: 'جرعات الأدرينالين بالصدمة التحسسية',
    gcsScale: 'تقييم مقياس غلاسكو للوعي GCS',
    burnProtocol: 'بروتوكول التعامل مع الحروق الطارئ',

    // Smartwatch & Danger
    smartwatchTitle: 'اقتران الساعة الذكية والإنذار الحيوي الذكي',
    smartwatchDesc: 'مراقبة العلامات الحيوية بشكل مستمر وإرسال إنذار طارئ فور دخول نبضات القلب لحارة الخطر أو التوقف',
    watchStatusConnected: 'متصل بالساعة الذكية (Apple Watch / Galaxy Watch)',
    simulateHeartAttack: '⚠️ محاكاة دخول حالة نبضات القلب في حارة الخطر / التوقف',
    dangerModalTitle: '⚠️ إنذار حيوي حاد من الساعة الذكية!',
    dangerModalMsg: 'تم اكتشاف تسارع خطير في نبضات القلب أو اشتباه توقف قلبي! هل أنت بخير؟',
    patientImOk: 'أنا بخير (إلغاء الإنذار)',
    dispatchFirstResponseNow: 'طلب استجابة فورية (إرسال الإسعاف الآن)',
    autoDispatchCountDown: 'سيتم إرسال المستجيب الأول وسيارة الإسعاف تلقائياً خلال',
    seconds: 'ثوانٍ',
    
    // Patient View
    patientFileTitle: 'الملف الطبي الشخصي والحالة الصحية الآن',
    patientVitalsFromWatch: 'العلامات الحيوية المأخوذة فوراً من الساعة الذكية',
    emergencySosBtn: '🚨 طلب استغاثة طارئة SOS',
    ambulanceEnRoute: 'سيارة الإسعاف والمستجيب الأول في الطريق إليك الآن',
  },
  en: {
    appTitle: 'Sahm System',
    subTitle: 'First Responder Medical System',
    doctorRole: 'Consultant Doctor',
    paramedicRole: 'Paramedic - First Responder',
    patientRole: 'Patient Account',
    switchLanguage: 'العربية',
    notifications: 'Notifications',
    noNotifications: 'No new notifications',
    markAllAsRead: 'Mark all as read',
    logout: 'Logout',
    login: 'Login',
    register: 'Create New Account',
    
    // Auth & Form fields
    username: 'Username',
    password: 'Password',
    qid: 'Qatar Civil ID (QID)',
    nameAr: 'Full Name in Arabic',
    nameEn: 'Full Name in English',
    phone: 'Phone Number (Qatar)',
    selectRole: 'Select Account Role',
    createAccountBtn: 'Confirm Create Account',
    quickLoginNotice: 'Default System Logins Available (Username: سهم / Password: 123)',
    loginBtn: 'System Access',
    
    // Navigation Tabs
    tabDashboard: 'Main Dashboard & Reports',
    tabComplaints: 'Traffic Obstruction Complaints',
    tabMaps: 'Qatar Maps & Ambulance Tracking',
    tabAiAssistant: 'AI Assistant "Sahm"',
    tabSmartwatch: 'Smartwatch Pairing & Vitals',
    tabPatientFile: 'My Health File & Vitals',
    
    // Dashboard
    handedOverCases: 'Handed-Over Cases & Detailed Health File',
    priorityCritical: 'Critical (Priority 1)',
    priorityUrgent: 'Urgent (Priority 2)',
    priorityStable: 'Stable (Priority 3)',
    vitalSigns: 'Current Vital Signs',
    bloodPressure: 'Blood Pressure',
    bloodSugar: 'Blood Sugar',
    oxygenSaturation: 'Oxygen Level',
    temperature: 'Temperature',
    heartRate: 'Heart Rate',
    
    firstResponderReport: 'First Responder Report',
    ambulanceInterventionNeeded: '🚨 Urgent Ambulance Intervention Required',
    ambulanceInterventionNotNeeded: '✅ Controlled on Scene',
    playAudioReport: 'Play Report Audio',
    stopAudioReport: 'Stop Audio',
    
    completionRate: 'Response Case Completion Rate',
    completionRateSub: 'Today Rapid Response Efficiency Rate',
    avgResponseTime: 'Avg Response Time: 4.2 mins',
    completedCasesToday: 'Completed Cases Today: 18',
    
    videoCallDoctorParamedic: 'Direct Video Consultation via Google Meet',
    startVideoCall: 'Start Emergency Medical Video Call',
    endCall: 'End Call',
    doctorInstructions: 'Direct Doctor Instructions to Paramedic',

    // Traffic Complaints
    trafficTitle: 'Obstruction Complaints & Traffic Violations',
    trafficDesc: 'AI automatic plate number extraction and direct transmission to Qatar Traffic Dept',
    uploadObstructionPhoto: 'Upload / Capture Obstructing Vehicle Image',
    detectedPlateNumber: 'Extracted License Plate Numbers',
    violationType: 'Violation Type',
    violationObstruction: 'Obstructing Ambulance Route',
    violationNoWay: 'Failing to Yield for Emergency Vehicle',
    violationEmergencyLane: 'Illegal Use of Emergency Shoulder Lane',
    sendTrafficReport: 'Send Report Immediately to Traffic Dept',
    reportSubmittedSuccess: 'Violation submitted successfully to Qatar Traffic Department under Ticket Reference',
    
    // Maps & Ashghal
    qatarMapTitle: 'Qatar Hospitals Network & Ambulance Tracking',
    qatarMapDesc: 'First responder tracking & smart traffic lights green wave in coordination with Ashghal',
    searchHospital: 'Search hospital or health center...',
    allHospitals: 'All Qatar Hospitals',
    emergencyBeds: 'Available Emergency Beds',
    trackAmbulance: 'Track Active Ambulance in Field',
    greenWaveActive: 'Green Wave System Active (All Signals Set to Green)',
    sendAshghalMsg: 'Send Instant Dispatch Alert to Ashghal Authority',
    ashghalSentMsg: 'Emergency corridor request dispatched successfully to Ashghal Public Works Authority',
    
    // AI Assistant
    aiAssistantTitle: 'AI Medical Assistant "Sahm" for Qatar Protocols',
    aiAssistantDesc: 'Hands-free voice trigger activated by saying "Sahm" without clicking any button. Powered by HMC & MoPH Qatar standards.',
    listeningForKeyword: '🎧 Listening... Say "Sahm" to trigger question',
    speechRecognitionSupported: 'Voice trigger for keyword "Sahm" is active',
    askQuestionPlaceholder: 'Type medical query or say "Sahm"...',
    sendQuestion: 'Send',
    quickMedicalProtocols: 'Quick Qatar Medical References',
    hmrCprProtocol: 'HMC CPR Guidelines',
    anaphylaxisDose: 'Anaphylaxis Adrenaline Dosage',
    gcsScale: 'Glasgow Coma Scale Assessment',
    burnProtocol: 'Emergency Burn Protocol',

    // Smartwatch & Danger
    smartwatchTitle: 'Smartwatch Sync & Vital Danger Alerts',
    smartwatchDesc: 'Continuous vitals monitoring & automatic emergency alerts when cardiac danger or arrest occurs',
    watchStatusConnected: 'Connected to Smartwatch (Apple Watch / Galaxy Watch)',
    simulateHeartAttack: '⚠️ Simulate Heart Rate Danger Zone / Cardiac Arrest',
    dangerModalTitle: '⚠️ Severe Vital Alert from Smartwatch!',
    dangerModalMsg: 'Dangerous tachycardia or suspected cardiac arrest detected! Are you OK?',
    patientImOk: "I'm OK (Cancel Alarm)",
    dispatchFirstResponseNow: 'Request Immediate Response (Dispatch Ambulance Now)',
    autoDispatchCountDown: 'First responder and ambulance will auto-dispatch in',
    seconds: 'seconds',
    
    // Patient View
    patientFileTitle: 'Personal Medical Record & Current Health Status',
    patientVitalsFromWatch: 'Live Vitals Pulled from Smartwatch',
    emergencySosBtn: '🚨 Emergency SOS Distress Call',
    ambulanceEnRoute: 'Ambulance & First Responder are on the way to your location',
  }
};

export function t(key: keyof typeof translations['ar'], lang: Language): string {
  return translations[lang][key] || translations['ar'][key] || key;
}
