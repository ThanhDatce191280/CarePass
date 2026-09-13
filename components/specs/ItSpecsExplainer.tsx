import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  FileCode, 
  Network, 
  Workflow
} from 'lucide-react';

export const ItSpecsExplainer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ARCHITECTURE' | 'WORKFLOWS' | 'DATA_MODEL'>('ARCHITECTURE');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sqlSchemaCode = `-- 1. Bảng Phòng khám Da liễu Đối tác (Clinics)
CREATE TABLE clinics (
    clinic_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hotline VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Hồ sơ CarePass Kỹ thuật số (B2B2C Pass)
CREATE TABLE carepasses (
    carepass_id VARCHAR(36) PRIMARY KEY, -- Ví dụ: 'CP-1024'
    clinic_id VARCHAR(36) REFERENCES clinics(clinic_id),
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    diagnosis_category VARCHAR(50), -- POST_LASER, POST_PEEL, ACNE_TREATMENT
    diagnosis_title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    duration_days INT DEFAULT 14,
    adherence_rate NUMERIC(5,2) DEFAULT 0.0,
    points INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, WARNING_ALLERGY, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Chi tiết Cữ bôi & Thời gian Giãn cách (Routine Items)
CREATE TABLE routine_items (
    item_id VARCHAR(36) PRIMARY KEY,
    carepass_id VARCHAR(36) REFERENCES carepasses(carepass_id),
    session VARCHAR(10) NOT NULL, -- 'MORNING', 'EVENING'
    step_order INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    active_ingredient VARCHAR(150), -- e.g. 'Vitamin B5 5%', 'Tretinoin 0.05%'
    dosage_instruction TEXT NOT NULL,
    wait_minutes_after INT DEFAULT 0, -- Smart Spacing Timer (e.g. 15 mins)
    notes TEXT
);

-- 4. Bảng Nhật ký Điểm danh Tuân thủ Thực tế (Adherence Logs)
CREATE TABLE adherence_logs (
    log_id VARCHAR(36) PRIMARY KEY,
    carepass_id VARCHAR(36) REFERENCES carepasses(carepass_id),
    item_id VARCHAR(36) REFERENCES routine_items(item_id),
    logged_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED'
);

-- 5. Bảng Phân luồng Sự cố Kích ứng (Emergency Triage Incidents)
CREATE TABLE triage_incidents (
    incident_id VARCHAR(36) PRIMARY KEY, -- Ví dụ: 'INC-2026-089'
    carepass_id VARCHAR(36) REFERENCES carepasses(carepass_id),
    severity_level INT NOT NULL, -- 1 (MILD), 2 (MODERATE - SLA 30m), 3 (SEVERE)
    symptoms TEXT NOT NULL,
    affected_area VARCHAR(255),
    photo_hash VARCHAR(255),
    doctor_notes TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    sla_expire_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  const jsonPayloadCode = `{
  "carepass_token": "CP-1024",
  "clinic": {
    "clinic_id": "CLINIC-VN-001",
    "name": "Phòng Khám Da Liễu Thẩm Mỹ MedSkin DermaCare",
    "hotline": "1900 6868",
    "emergency": "0908 123 456"
  },
  "patient": {
    "name": "Nguyễn Thu Hà",
    "phone": "0912 345 678",
    "treatment_day": 5,
    "total_days": 14,
    "adherence_rate": 85.0,
    "gamification_points": 120
  },
  "routine_schedule": {
    "morning_routine": [
      {
        "step": 1,
        "product": "Nước muối sinh lý NaCl 0.9%",
        "active_ingredient": "Sodium Chloride 0.9%",
        "dosage": "Thấm gạc vô khuẩn, chấm nhẹ nhàng toàn mặt",
        "spacing_wait_minutes": 5,
        "completed": true
      },
      {
        "step": 2,
        "product": "Serum B5 Panthenol Phục hồi biểu bì",
        "active_ingredient": "Vitamin B5 5% + HA",
        "dosage": "4-5 giọt vỗ đều thẩm thấu",
        "spacing_wait_minutes": 15,
        "completed": true
      },
      {
        "step": 3,
        "product": "Kem phục hồi bảo vệ Ceramide",
        "active_ingredient": "Ceramide NP + Madecassoside",
        "dosage": "1 lượng bằng hạt đậu",
        "spacing_wait_minutes": 10,
        "completed": false
      }
    ],
    "evening_routine": [
      {
        "step": 1,
        "product": "Xịt khoáng làm dịu vô khuẩn",
        "spacing_wait_minutes": 5,
        "completed": false
      },
      {
        "step": 2,
        "product": "Kem dưỡng khóa ẩm màng Ceramide Đậm đặc",
        "spacing_wait_minutes": 0,
        "completed": false
      }
    ]
  },
  "triage_sla_policy": {
    "max_response_minutes": 30,
    "escalation_channel": ["Zalo ZNS", "Clinic Portal Urgent Queue", "Direct VoIP Call"]
  }
}`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-900/50 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
                IT Architecture & API Specs
              </span>
              <span className="text-xs text-slate-400">| SPEC-CAREPASS-MVP-2026</span>
            </div>
            <h1 className="text-2xl font-bold mt-2 text-white">Kiến Trúc Kỹ Thuật & Luồng Tương Tác IT</h1>
            <p className="text-sm text-indigo-200/80 mt-1">
              Chi tiết thiết kế hệ thống B2B2C, luồng đồng bộ thời gian thực giữa Doctor Portal và Patient Mobile App.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 bg-indigo-900/60 border border-indigo-700/60 rounded-xl text-xs font-mono text-indigo-200">
              SLA Engine: &lt; 30 mins
            </span>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl max-w-md">
        <button
          type="button"
          onClick={() => setActiveSubTab('ARCHITECTURE')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'ARCHITECTURE' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Sơ Đồ Kiến Trúc</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('WORKFLOWS')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'WORKFLOWS' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>5 Luồng Kỹ Thuật</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('DATA_MODEL')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'DATA_MODEL' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Model (SQL/JSON)</span>
        </button>
      </div>

      {/* SUB-TAB 1: ARCHITECTURE DIAGRAM */}
      {activeSubTab === 'ARCHITECTURE' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Sơ Đồ Kiến Trúc Hệ Thống Tổng Thể (System Topology)
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Mô hình Client Tier $\leftrightarrow$ API Gateway $\leftrightarrow$ Application Services $\leftrightarrow$ Storage & External APIs
            </p>

            {/* Visual Box Architecture Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              
              {/* Tier 1: Client Tier */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>1. CLIENT TIER</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <strong className="text-emerald-700">Clinic Web Portal</strong>
                  <p className="text-[11px] text-slate-500">React SPA / Web Admin cho Bác sĩ & KTV</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <strong className="text-teal-700">Patient CarePass App</strong>
                  <p className="text-[11px] text-slate-500">Zalo Mini App / Mobile Web PWA Zero-Friction</p>
                </div>
              </div>

              {/* Tier 2: Gateway & Security */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-indigo-200 space-y-3">
                <div className="font-bold text-indigo-900 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>2. GATEWAY & AUTH</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <strong className="text-indigo-700">API Gateway</strong>
                  <p className="text-[11px] text-slate-500">Reverse Proxy, Rate Limiting, SSL Offloading</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <strong className="text-indigo-700">RBAC Auth Layer</strong>
                  <p className="text-[11px] text-slate-500">JWT Token: Clinic Admin, Doctor, Patient Claim</p>
                </div>
              </div>

              {/* Tier 3: Core Application Services */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-amber-200 space-y-3">
                <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>3. APPLICATION SERVICES</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                  <strong className="text-slate-800 text-[11px]">CarePass Engine</strong>
                  <p className="text-[10px] text-slate-500">Quản lý Phác đồ mẫu & Tạo Token</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                  <strong className="text-slate-800 text-[11px]">Smart Scheduler</strong>
                  <p className="text-[10px] text-slate-500">Tính toán Spacing Timer 15m & ZNS</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                  <strong className="text-slate-800 text-[11px]">Conflict Checker KG</strong>
                  <p className="text-[10px] text-slate-500">Knowledge Graph 5.000+ hoạt chất</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                  <strong className="text-rose-700 text-[11px]">Incident Triage & SLA</strong>
                  <p className="text-[10px] text-slate-500">Khẩn cấp 30 phút, Webhooks & SMS</p>
                </div>
              </div>

              {/* Tier 4: Storage & External */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>4. STORAGE & INTEGRATIONS</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <strong className="text-blue-700">PostgreSQL DB</strong>
                  <p className="text-[11px] text-slate-500">Clinics, Patients, CarePasses, Adherence Logs</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <strong className="text-blue-700">Redis & Message Queue</strong>
                  <p className="text-[11px] text-slate-500">Push Notifications, Active Timers Queue</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <strong className="text-emerald-700">Zalo ZNS & Shopee Mall</strong>
                  <p className="text-[11px] text-slate-500">SMS Gateway & Affiliate Commerce API</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 5 TECHNICAL WORKFLOWS */}
      {activeSubTab === 'WORKFLOWS' && (
        <div className="space-y-4">
          
          {/* Workflow 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-sm font-bold text-slate-900">
                Luồng 1: Bác sĩ khởi tạo CarePass & Kích hoạt qua QR Code (Zero-Friction Onboarding)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-8">
              1. Bác sĩ mở Web Portal chọn template phác đồ (Laser CO2, Peel, Mụn) $\rightarrow$ 
              2. Nhập tên bệnh nhân, SĐT $\rightarrow$ 
              3. API sinh mã Token duy nhất (ví dụ <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">CP-1024</code>) và hiển thị QR Code động $\rightarrow$ 
              4. Bệnh nhân quét mã QR bằng Camera/Zalo mở ngay Web App cá nhân hóa không cần tải ứng dụng nặng.
            </p>
          </div>

          {/* Workflow 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-sm font-bold text-slate-900">
                Luồng 2: Lập lịch nhắc thông minh & Kiểm tra giãn cách (Smart Spacing Rules)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-8">
              Khi phát hiện 2 hoạt chất cần thời gian ổn định pH (như Retinol/Treatment và Kem khóa ẩm B5), Smart Scheduler tự động gắn đồng hồ đếm ngược 15 phút. Khi kết thúc 15 phút, hệ thống phát âm thanh Web Audio + thông báo visual nhắc thoa tiếp kem dưỡng.
            </p>
          </div>

          {/* Workflow 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold">3</span>
              <h3 className="text-sm font-bold text-slate-900">
                Luồng 3: Bệnh nhân Check-in tuân thủ & Cơ chế Gamification
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-8">
              Bệnh nhân bấm Check-in từng bước $\rightarrow$ Hệ thống ghi nhận <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Adherence_Log</code> với timestamp $\rightarrow$ Tự động cập nhật thanh % tuân thủ và cộng +20 điểm thưởng. Đạt mốc mở khóa voucher giảm 15% buổi tái khám tiếp theo.
            </p>
          </div>

          {/* Workflow 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-bold">4</span>
              <h3 className="text-sm font-bold text-slate-900">
                Luồng 4: Phân luồng sự cố kích ứng khẩn cấp (Emergency SLA Triage 30 phút)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-8">
              Bệnh nhân bấm SOS $\rightarrow$ Chọn mức độ (Cấp 1 sơ cứu tại chỗ; Cấp 2 đỏ rát gửi tín hiệu về Doctor Dashboard khởi động SLA 30 phút; Cấp 3 sưng phù bật còi báo động đỏ, cung cấp hotline trực tiếp và bản đồ Bệnh viện Da liễu).
            </p>
          </div>

          {/* Workflow 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">5</span>
              <h3 className="text-sm font-bold text-slate-900">
                Luồng 5: High-Intent Commerce & Tái nạp thông minh (Replenishment)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-8">
              Gợi ý sản phẩm phục hồi chính hãng chuẩn y khoa tương thích 100% với đơn bác sĩ. Gắn nhãn Shopee Mall / LazMall chính hãng kèm mã giảm giá độc quyền <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-emerald-700">CAREPASS15</code>.
            </p>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: DATA MODEL (SQL & JSON) */}
      {activeSubTab === 'DATA_MODEL' && (
        <div className="space-y-6">
          
          {/* SQL DDL Schema */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400">PostgreSQL DDL Schema (schema.sql)</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(sqlSchemaCode, 'sql')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
              >
                {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sql' ? 'Đã sao chép' : 'Sao chép SQL'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 leading-relaxed">
              <code>{sqlSchemaCode}</code>
            </pre>
          </div>

          {/* JSON API Payload */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-indigo-400">CarePass Sync Payload (carepass.json)</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(jsonPayloadCode, 'json')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
              >
                {copiedSection === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'json' ? 'Đã sao chép' : 'Sao chép JSON'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-indigo-200 overflow-x-auto p-2 leading-relaxed">
              <code>{jsonPayloadCode}</code>
            </pre>
          </div>

        </div>
      )}
    </div>
  );
};
