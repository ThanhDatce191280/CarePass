import React, { createContext, useContext, useState, useEffect } from 'react';
import { CarePass, TriageIncident, TriageSeverity } from '../types';
import { INITIAL_CAREPASSES, INITIAL_INCIDENTS, CAREPASS_TEMPLATES, CLINIC_INFO } from '../data/mockData';
import { playChimeSound, playEmergencyAlertSound } from '../utils/audio';

interface CarePassContextType {
  carepasses: CarePass[];
  currentCarepassId: string;
  currentCarepass: CarePass | undefined;
  incidents: TriageIncident[];
  activeTab: 'DOCTOR' | 'PATIENT' | 'IT_SPECS';
  setActiveTab: (tab: 'DOCTOR' | 'PATIENT' | 'IT_SPECS') => void;
  selectCarePass: (id: string) => void;
  createCarePass: (patientName: string, patientPhone: string, templateKey: string) => CarePass;
  toggleItemCheckIn: (itemId: string) => void;
  reportIncident: (severity: TriageSeverity, symptoms: string, affectedArea: string) => TriageIncident;
  resolveIncident: (incidentId: string, notes?: string) => void;
  activeSlaSeconds: number;
  unresolvedIncidentsCount: number;
}

const CarePassContext = createContext<CarePassContextType | undefined>(undefined);

export const CarePassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carepasses, setCarepasses] = useState<CarePass[]>(INITIAL_CAREPASSES);
  const [currentCarepassId, setCurrentCarepassId] = useState<string>('CP-1024');
  const [incidents, setIncidents] = useState<TriageIncident[]>(INITIAL_INCIDENTS);
  const [activeTab, setActiveTab] = useState<'DOCTOR' | 'PATIENT' | 'IT_SPECS'>('DOCTOR');
  const [activeSlaSeconds, setActiveSlaSeconds] = useState<number>(24 * 60 + 18); // 24m 18s initial

  // Countdown timer for active incidents
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCarepass = carepasses.find((cp) => cp.carepassId === currentCarepassId) || carepasses[0];

  const selectCarePass = (id: string) => {
    setCurrentCarepassId(id);
  };

  const createCarePass = (patientName: string, patientPhone: string, templateKey: string): CarePass => {
    const template = CAREPASS_TEMPLATES[templateKey] || CAREPASS_TEMPLATES.LASER_CO2;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CP-${randomNum}`;

    const newCarepass: CarePass = {
      carepassId: newId,
      clinicId: CLINIC_INFO.id,
      clinicName: CLINIC_INFO.name,
      patientName,
      patientPhone,
      diagnosisCategory: template.category,
      diagnosisTitle: template.title,
      startDate: new Date().toISOString().split('T')[0],
      totalDays: template.durationDays,
      currentDay: 1,
      adherenceRate: 10,
      points: 20,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      routine: template.routine.map((item, idx) => ({
        ...item,
        itemId: `item-${newId}-${idx + 1}`,
        completed: false,
      })),
    };

    setCarepasses((prev) => [newCarepass, ...prev]);
    setCurrentCarepassId(newId);
    return newCarepass;
  };

  const toggleItemCheckIn = (itemId: string) => {
    setCarepasses((prevCarepasses) =>
      prevCarepasses.map((cp) => {
        if (cp.carepassId !== currentCarepassId) return cp;

        const updatedRoutine = cp.routine.map((item) => {
          if (item.itemId === itemId) {
            const nextCompleted = !item.completed;
            if (nextCompleted) {
              playChimeSound();
            }
            return {
              ...item,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : undefined,
            };
          }
          return item;
        });

        const completedCount = updatedRoutine.filter((i) => i.completed).length;
        const total = updatedRoutine.length;
        const calculatedRate = Math.round((completedCount / total) * 100);
        const pointsAdded = 20;

        return {
          ...cp,
          routine: updatedRoutine,
          adherenceRate: calculatedRate,
          points: cp.points + (updatedRoutine.find((i) => i.itemId === itemId)?.completed ? pointsAdded : -pointsAdded),
        };
      })
    );
  };

  const reportIncident = (severity: TriageSeverity, symptoms: string, affectedArea: string): TriageIncident => {
    const newIncidentId = `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident: TriageIncident = {
      incidentId: newIncidentId,
      carepassId: currentCarepass?.carepassId || 'CP-1024',
      patientName: currentCarepass?.patientName || 'Bệnh nhân',
      patientPhone: currentCarepass?.patientPhone || '0900000000',
      diagnosisTitle: currentCarepass?.diagnosisTitle || 'Phác đồ phục hồi',
      severityLevel: severity,
      symptoms,
      affectedArea,
      isResolved: false,
      slaMinutesRemaining: 30,
      createdAt: new Date().toISOString(),
    };

    setIncidents((prev) => [newIncident, ...prev]);

    if (severity >= 2) {
      setActiveSlaSeconds(30 * 60); // Reset countdown to 30 mins
      playEmergencyAlertSound();
      // Update CarePass status
      setCarepasses((prev) =>
        prev.map((cp) => (cp.carepassId === currentCarepassId ? { ...cp, status: 'WARNING_ALLERGY' } : cp))
      );
    }

    return newIncident;
  };

  const resolveIncident = (incidentId: string, notes?: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.incidentId === incidentId) {
          return {
            ...inc,
            isResolved: true,
            doctorNotes: notes || 'Đã liên hệ bệnh nhân qua hotline và hướng dẫn xử trí an toàn.',
            resolvedAt: new Date().toISOString(),
          };
        }
        return inc;
      })
    );

    // Check if carepass has other unresolved incidents
    const targetIncident = incidents.find((i) => i.incidentId === incidentId);
    if (targetIncident) {
      setCarepasses((prev) =>
        prev.map((cp) => (cp.carepassId === targetIncident.carepassId ? { ...cp, status: 'ACTIVE' } : cp))
      );
    }
  };

  const unresolvedIncidentsCount = incidents.filter((i) => !i.isResolved && i.severityLevel >= 2).length;

  return (
    <CarePassContext.Provider
      value={{
        carepasses,
        currentCarepassId,
        currentCarepass,
        incidents,
        activeTab,
        setActiveTab,
        selectCarePass,
        createCarePass,
        toggleItemCheckIn,
        reportIncident,
        resolveIncident,
        activeSlaSeconds,
        unresolvedIncidentsCount,
      }}
    >
      {children}
    </CarePassContext.Provider>
  );
};

export const useCarePass = () => {
  const context = useContext(CarePassContext);
  if (!context) {
    throw new Error('useCarePass must be used within a CarePassProvider');
  }
  return context;
};
