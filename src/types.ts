export type UserRole = 'doctor' | 'paramedic' | 'patient';

export type Language = 'ar' | 'en';

export interface User {
  id: string;
  username: string;
  nameAr: string;
  nameEn: string;
  role: UserRole;
  qid: string; // Qatar Civil ID
  phone: string;
  avatar?: string;
}

export type TriagePriority = 'critical' | 'urgent' | 'stable';

export interface VitalSigns {
  bloodPressure: string; // e.g., "145/92"
  bloodSugar: number; // mg/dL e.g., 185
  oxygenSaturation: number; // % e.g., 91
  temperature: number; // °C e.g., 38.4
  heartRate: number; // bpm e.g., 118
  timestamp: string;
}

export interface FirstResponderReport {
  id: string;
  patientNameAr: string;
  patientNameEn: string;
  patientQid: string;
  patientAge: number;
  gender: 'male' | 'female';
  priority: TriagePriority;
  vitals: VitalSigns;
  chiefComplaintAr: string;
  chiefComplaintEn: string;
  responderNotesAr: string;
  responderNotesEn: string;
  requiresAmbulanceIntervention: boolean;
  paramedicName: string;
  doctorAssigned?: string;
  handedOverAt: string;
  status: 'pending' | 'in_progress' | 'completed' | 'transferred';
  locationName: string;
  audioUrl?: string;
}

export interface TrafficComplaint {
  id: string;
  plateNumber: string;
  violationTypeAr: string;
  violationTypeEn: string;
  imageUrl?: string;
  locationName: string;
  timestamp: string;
  status: 'submitted' | 'processing' | 'approved_traffic_dept';
  ticketId: string;
}

export interface QatarHospital {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'hospital' | 'health_center';
  lat: number;
  lng: number;
  availableBeds: number;
  emergencyDepartment: boolean;
  phone: string;
}

export interface AlertNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  type: 'emergency' | 'traffic' | 'ashghal' | 'info';
  read: boolean;
}

export interface SmartwatchState {
  connected: boolean;
  deviceName: string;
  batteryLevel: number;
  currentVitals: VitalSigns;
  isInDangerZone: boolean;
  dangerMessage?: string;
}
