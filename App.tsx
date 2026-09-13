import React, { useState } from 'react';
import { CarePassProvider, useCarePass } from './context/CarePassContext';
import { Navbar } from './components/Navbar';
import { ClinicPortal } from './components/doctor/ClinicPortal';
import { PatientApp } from './components/patient/PatientApp';
import { ItSpecsExplainer } from './components/specs/ItSpecsExplainer';
import { 
  Building2, 
  Smartphone, 
  Cpu, 
  CheckCircle, 
  Zap, 
  ShieldAlert, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectCarePass, 
    reportIncident, 
    currentCarepassId 
  } = useCarePass();

  const [activeScenarioToast, setActiveScenarioToast] = useState<string | null>(null);

  const triggerScenario = (scenarioNum: number) => {
    switch (scenarioNum) {
      case 1:
        // Test Kịch bản 1: Tạo phác đồ (Doctor Flow)
        setActiveTab('DOCTOR');
        setActiveScenarioToast('Kịch bản 1: Đang ở màn hình Bác sĩ, bạn có thể bấm "Kích hoạt CarePass" để sinh mã QR & Token.');
        break;
      case 2:
        // Test Kịch bản 2: Khách hàng nhận phác đồ (Patient Flow)
        selectCarePass('CP-1024');
        setActiveTab('PATIENT');
        setActiveScenarioToast('Kịch bản 2: Đã chuyển sang màn hình Bệnh nhân với mã CP-1024 (Nguyễn Thu Hà - Laser CO2).');
        break;
      case 3:
        // Test Kịch bản 3: Tuân thủ & Giãn cách (Adherence & Spacing)
        selectCarePass('CP-1024');
        setActiveTab('PATIENT');
        setActiveScenarioToast('Kịch bản 3: Bấm nút "Bắt đầu chờ 15 phút" ở bước bôi hoạt chất hoặc "Check-in" để tăng điểm thưởng!');
        break;
      case 4:
        // Test Kịch bản 4: Báo động SOS Kích ứng (Emergency Triage)
        selectCarePass('CP-9921');
        reportIncident(
          2,
          'Mặt đỏ rát diện rộng ở hai bên gò má và cánh mũi sau khi thoa serum mới, cảm giác nóng rát kéo dài.',
          'Hai bên má và rãnh cười'
        );
        setActiveTab('DOCTOR');
        setActiveScenarioToast('Kịch bản 4: Đã gửi tín hiệu SOS Cấp 2! Kiểm tra đồng hồ đếm ngược SLA 30 phút trên Bảng Bác sĩ.');
        break;
      case 5:
        // Test Kịch bản 5: Kiểm tra tương kỵ (Compatibility Checker)
        setActiveTab('PATIENT');
        setActiveScenarioToast('Kịch bản 5: Mở mục "Bộ Quét Tương Kỵ Mỹ Phẩm Có Sẵn" để thử BHA + Retinol hoặc B5 + Ceramide.');
        break;
      default:
        break;
    }

    setTimeout(() => setActiveScenarioToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Role Switcher Navbar */}
      <Navbar />

      {/* Quick Scenario Runner Bar for Evaluators (UAT Banner) */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-3 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-amber-400 font-bold">
              <Zap className="w-3.5 h-3.5 mr-1 fill-amber-400" />
              5 Kịch Bản Test Nhanh (UAT Evaluation):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => triggerScenario(1)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors border border-slate-700"
            >
              1. Tạo Phác Đồ (Bác Sĩ)
            </button>
            <button
              type="button"
              onClick={() => triggerScenario(2)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg text-[11px] font-medium transition-colors border border-slate-700"
            >
              2. Nhận Token CP-1024
            </button>
            <button
              type="button"
              onClick={() => triggerScenario(3)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-[11px] font-medium transition-colors border border-slate-700"
            >
              3. Giãn Cách 15p & Check-in
            </button>
            <button
              type="button"
              onClick={() => triggerScenario(4)}
              className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg text-[11px] font-medium transition-colors border border-rose-700/60 flex items-center"
            >
              <ShieldAlert className="w-3 h-3 mr-1 text-rose-400" />
              4. Báo Động SOS SLA 30p
            </button>
            <button
              type="button"
              onClick={() => triggerScenario(5)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-[11px] font-medium transition-colors border border-slate-700"
            >
              5. Quét Tương Kỵ Hoạt Chất
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Toast Info */}
      {activeScenarioToast && (
        <div className="bg-emerald-900 text-emerald-100 px-4 py-2 text-xs border-b border-emerald-700/50 flex items-center justify-between animate-in fade-in">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 w-full">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{activeScenarioToast}</span>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'DOCTOR' && <ClinicPortal />}
        {activeTab === 'PATIENT' && <PatientApp />}
        {activeTab === 'IT_SPECS' && <ItSpecsExplainer />}
      </main>

      {/* Global Medical Safety Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
              CP
            </div>
            <div>
              <span className="font-bold text-slate-200">CarePass Dermatology SaaS</span> • Bản quyền kỹ thuật số B2B2C
            </div>
          </div>
          <div className="text-[11px] text-slate-500 text-center sm:text-right max-w-lg">
            Khuyến cáo y khoa: CarePass hoạt động như công cụ hỗ trợ tuân thủ & cảnh báo sớm theo Quy tắc BR-005. Mọi điều chỉnh thuốc bôi bắt buộc thông qua chỉ định của Bác sĩ da liễu có chứng chỉ hành nghề.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CarePassProvider>
      <MainContent />
    </CarePassProvider>
  );
}
