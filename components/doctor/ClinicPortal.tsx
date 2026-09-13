import React, { useState } from 'react';
import { useCarePass } from '../../context/CarePassContext';
import { CAREPASS_TEMPLATES, CLINIC_INFO } from '../../data/mockData';
import { 
  Users, 
  TrendingUp, 
  CalendarCheck, 
  AlertCircle, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  ShieldAlert, 
  Send,
  Eye,
  Check,
  Zap
} from 'lucide-react';

export const ClinicPortal: React.FC = () => {
  const { 
    carepasses, 
    currentCarepassId, 
    selectCarePass, 
    createCarePass, 
    incidents, 
    resolveIncident, 
    activeSlaSeconds, 
    setActiveTab 
  } = useCarePass();

  // Generator form state
  const [patientName, setPatientName] = useState('Nguyễn Thu Hà');
  const [patientPhone, setPatientPhone] = useState('0912 345 678');
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('LASER_CO2');
  const [createdCarePassToken, setCreatedCarePassToken] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState<'ALL' | 'ACTIVE' | 'WARNING'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateCarePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      showToast('Vui lòng nhập tên bệnh nhân');
      return;
    }
    const newCp = createCarePass(patientName, patientPhone, selectedTemplateKey);
    setCreatedCarePassToken(newCp.carepassId);
    setShowQrModal(true);
    showToast(`Đã kích hoạt CarePass ${newCp.carepassId} thành công cho bệnh nhân ${patientName}!`);
  };

  const formatSla = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // KPI Calculations
  const totalActiveCarePasses = 28 + (carepasses.length - 4);
  const avgAdherence = Math.round(
    carepasses.reduce((acc, curr) => acc + curr.adherenceRate, 0) / carepasses.length
  );
  const unresolvedIncidents = incidents.filter((i) => !i.isResolved);

  // Filtered patients table
  const filteredPatients = carepasses.filter((cp) => {
    const matchSearch =
      cp.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.carepassId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.patientPhone.includes(searchQuery);

    if (tableFilter === 'ACTIVE') return matchSearch && cp.status === 'ACTIVE';
    if (tableFilter === 'WARNING') return matchSearch && cp.status === 'WARNING_ALLERGY';
    return matchSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-300 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Clinic Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-slate-800 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                Clinic Command Center
              </span>
              <span className="text-xs text-slate-400">| {CLINIC_INFO.license}</span>
            </div>
            <h1 className="text-2xl font-bold mt-2 tracking-tight text-white">{CLINIC_INFO.name}</h1>
            <p className="text-sm text-slate-300 mt-1 flex items-center space-x-3">
              <span>Bác sĩ phụ trách: <strong>{CLINIC_INFO.doctorName}</strong></span>
              <span>•</span>
              <span>Hotline can thiệp: <strong className="text-emerald-400">{CLINIC_INFO.hotline}</strong></span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setPatientName('Nguyễn Thu Hà');
                setPatientPhone('0912 345 678');
                setSelectedTemplateKey('LASER_CO2');
                showToast('Đã nạp dữ liệu mẫu Kịch bản 1: Phục hồi sau Laser CO2');
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Nạp mẫu Laser CO2</span>
            </button>
            <button
              onClick={() => {
                selectCarePass('CP-1024');
                setActiveTab('PATIENT');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/30 flex items-center space-x-1.5 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Xem App Bệnh Nhân (CP-1024)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CarePass Đang Chạy</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-800">{totalActiveCarePasses}</span>
            <span className="text-xs text-slate-500">bệnh nhân</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center">
            <span className="text-emerald-500 mr-1">↑ +18%</span> so với tuần trước
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ Lệ Tuân Thủ Trung Bình</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-teal-700">{avgAdherence}%</span>
            <span className="text-xs text-slate-500">adherence rate</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Mục tiêu lâm sàng: <span className="font-semibold text-slate-700">≥ 80%</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ Lệ Tái Khám Dự Kiến</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-indigo-600">+45%</span>
            <span className="text-xs text-slate-500">so với quy trình giấy</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Nhờ cơ chế Gamification & Voucher
          </div>
        </div>

        {/* KPI 4: Emergency Alert Badge */}
        <div className={`p-5 rounded-2xl border transition-all ${
          unresolvedIncidents.length > 0 
            ? 'bg-rose-50 border-rose-200 shadow-sm' 
            : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Cảnh Báo Kích Ứng Cần Xử Trí</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-600">{unresolvedIncidents.length}</span>
            <span className="text-xs text-rose-700 font-medium">sự cố đang chờ</span>
          </div>
          <div className="mt-2 text-xs font-mono font-bold text-rose-700 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-rose-500 animate-spin" />
            <span>SLA đếm ngược: {formatSla(activeSlaSeconds)}</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: QUICK GENERATOR (LEFT) & EMERGENCY TRIAGE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. QUICK CAREPASS GENERATOR IN 30 SECONDS */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Bộ Tạo Phác Đồ Cấp Tốc trong 30s</h2>
                <p className="text-xs text-slate-500">Quick CarePass Generator cho Bác sĩ & KTV</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Chuẩn Da Liễu
            </span>
          </div>

          <form onSubmit={handleGenerateCarePass} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên bệnh nhân <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Thu Hà"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chọn loại phác đồ mẫu chuẩn (Template)
              </label>
              <div className="space-y-2 mt-2">
                {Object.entries(CAREPASS_TEMPLATES).map(([key, template]) => {
                  const isSelected = selectedTemplateKey === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedTemplateKey(key)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{template.title}</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {template.durationDays} ngày
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {key === 'LASER_CO2' && 'Serum B5, Kem phục hồi Ceramide, KCN vật lý, giãn cách 15 phút.'}
                          {key === 'PEEL_SKIN' && 'Nước muối sinh lý, HA đa tầng ngậm nước, Kem làm dịu Cicaplast.'}
                          {key === 'ACNE_TREATMENT' && 'Kháng sinh bôi sáng, Tretinoin 0.05% tối, kỹ thuật kem đệm buffer 15 phút.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Template Summary preview */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
              <div className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Cấu trúc cữ thuốc tự động thiết lập:</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {CAREPASS_TEMPLATES[selectedTemplateKey].routine.length} bước bôi
                </span>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                {CAREPASS_TEMPLATES[selectedTemplateKey].routine.slice(0, 3).map((item, i) => (
                  <li key={i}>
                    {item.session === 'MORNING' ? 'Sáng' : 'Tối'}: <span className="font-medium text-slate-800">{item.productName}</span> ({item.activeIngredient})
                    {item.waitMinutesAfter > 0 && <span className="text-emerald-700 font-semibold ml-1">[Chờ {item.waitMinutesAfter}p]</span>}
                  </li>
                ))}
                <li className="text-slate-400 italic">Và các bước tiếp theo trong phác đồ...</li>
              </ul>
            </div>

            <button
              type="submit"
              id="btn-generate-carepass"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-900/20 flex items-center justify-center space-x-2 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Kích hoạt CarePass & Xuất Mã QR (Zero-Friction)</span>
            </button>
          </form>
        </div>

        {/* 4. EMERGENCY TRIAGE MONITOR (TRUNG TÂM TIẾP NHẬN SỰ CỐ KÍCH ỨNG) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Trung Tâm Tiếp Nhận Sự Cố Kích Ứng</h2>
                  <p className="text-xs text-slate-500">Emergency Triage Monitor - Quy tắc cam kết phản hồi SLA 30 phút</p>
                </div>
              </div>

              {unresolvedIncidents.length > 0 && (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {formatSla(activeSlaSeconds)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {incidents.map((incident) => {
                const isLevel1 = incident.severityLevel === 1;
                const isLevel2 = incident.severityLevel === 2;
                const isLevel3 = incident.severityLevel === 3;

                return (
                  <div
                    key={incident.incidentId}
                    className={`p-4 rounded-xl border transition-all ${
                      incident.isResolved
                        ? 'bg-slate-50/70 border-slate-200 opacity-75'
                        : isLevel3
                        ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-500'
                        : isLevel2
                        ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400'
                        : 'bg-blue-50/60 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isLevel3
                              ? 'bg-rose-600 text-white'
                              : isLevel2
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {isLevel3 && 'CẤP ĐỘ 3 (NẶNG - CẤP CỨU)'}
                          {isLevel2 && 'CẤP ĐỘ 2 (VỪA - ĐỎ RÁT DIỆN RỘNG)'}
                          {isLevel1 && 'CẤP ĐỘ 1 (NHẸ - CHÂM CHÍCH)'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">{incident.incidentId}</span>
                      </div>

                      {incident.isResolved ? (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center">
                          <Check className="w-3.5 h-3.5 mr-1" /> Đã xử lý
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> Còn {formatSla(activeSlaSeconds)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="text-xs font-bold text-slate-900">
                        {incident.patientName} • <span className="font-mono text-slate-600">{incident.patientPhone}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Liệu trình: {incident.diagnosisTitle}
                      </p>
                      <div className="mt-2 bg-white/80 p-2.5 rounded-lg border border-slate-200/80 text-xs text-slate-800">
                        <strong className="text-slate-900">Triệu chứng:</strong> {incident.symptoms}
                        <div className="mt-1 text-slate-500 text-[11px]">
                          Vùng da: <span className="text-slate-700 font-medium">{incident.affectedArea}</span>
                        </div>
                      </div>

                      {incident.doctorNotes && (
                        <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200">
                          <strong>Ghi chú bác sĩ:</strong> {incident.doctorNotes}
                        </div>
                      )}
                    </div>

                    {!incident.isResolved && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                        <a
                          href={`tel:${incident.patientPhone}`}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>Gọi khẩn cấp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            resolveIncident(incident.incidentId, 'Đã gọi điện tư vấn, hướng dẫn đắp gạc lạnh & dừng retinol 48h.');
                            showToast(`Đã xác nhận xử lý thành công sự cố ${incident.incidentId}`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Xác nhận đã xử lý</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Tiêu chuẩn xử trí: Phản hồi &lt; 30 phút theo Quy tắc BR-005</span>
            <span className="font-semibold text-slate-700">Tự động kết nối hồ sơ</span>
          </div>
        </div>

      </div>

      {/* 3. LIVE ADHERENCE TABLE (DANH SÁCH BỆNH NHÂN & THEO DÕI TUÂN THỦ) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Danh Sách Bệnh Nhân & Theo Dõi Tuân Thủ Thực Tế</h2>
            <p className="text-xs text-slate-500">Live Adherence Table - Dữ liệu thực từ nhật ký bôi thuốc của bệnh nhân</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter buttons */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setTableFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  tableFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Tất cả ({carepasses.length})
              </button>
              <button
                type="button"
                onClick={() => setTableFilter('ACTIVE')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  tableFilter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                Ổn định
              </button>
              <button
                type="button"
                onClick={() => setTableFilter('WARNING')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  tableFilter === 'WARNING' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Báo động kích ứng
              </button>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, SĐT, mã CP..."
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Mã Token</th>
                <th className="py-3 px-4">Bệnh Nhân / SĐT</th>
                <th className="py-3 px-4">Phác Đồ Điều Trị</th>
                <th className="py-3 px-4">Tiến Độ Ngày</th>
                <th className="py-3 px-4">% Tuân Thủ (Adherence)</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.map((cp) => {
                const isSelected = cp.carepassId === currentCarepassId;
                const isWarning = cp.status === 'WARNING_ALLERGY';

                return (
                  <tr
                    key={cp.carepassId}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {cp.carepassId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{cp.patientName}</div>
                      <div className="text-[11px] text-slate-500">{cp.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{cp.diagnosisTitle}</div>
                      <div className="text-[10px] text-slate-500">Khởi tạo: {cp.startDate}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">Ngày {cp.currentDay}</span>
                      <span className="text-slate-400"> / {cp.totalDays}</span>
                    </td>
                    <td className="py-3 px-4 w-44">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cp.adherenceRate >= 80
                                ? 'bg-emerald-500'
                                : cp.adherenceRate >= 60
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${cp.adherenceRate}%` }}
                          />
                        </div>
                        <span className="font-bold font-mono text-slate-800 shrink-0">
                          {cp.adherenceRate}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {cp.points} điểm thưởng tích lũy
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {isWarning ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                          <AlertCircle className="w-3 h-3 mr-1" /> Có báo động kích ứng
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Ổn định
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          selectCarePass(cp.carepassId);
                          setActiveTab('PATIENT');
                        }}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Mở trên App</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Đã gửi tin nhắn Zalo ZNS nhắc nhở cữ tối cho ${cp.patientName} (${cp.patientPhone})`)}
                        className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium inline-flex items-center transition-colors"
                        title="Gửi nhắc nhở Zalo ZNS"
                      >
                        <Send className="w-3 h-3 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL QR CODE SIMULATION */}
      {showQrModal && createdCarePassToken && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Kích Hoạt CarePass Thành Công!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bệnh nhân quét mã QR hoặc mở link để nhận toàn bộ cữ chăm sóc cá nhân hóa:
            </p>

            {/* Simulated QR Code display */}
            <div className="my-5 p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl inline-block">
              <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-inner flex flex-col items-center justify-center border border-slate-200 mx-auto">
                {/* SVG QR Code Pattern Mockup */}
                <svg className="w-36 h-36 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="#059669" />

                  <rect x="65" y="5" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="#059669" />

                  <rect x="5" y="65" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="15" y="75" width="10" height="10" fill="#059669" />

                  {/* Center data pattern pixels */}
                  <rect x="42" y="10" width="8" height="8" />
                  <rect x="42" y="24" width="6" height="6" fill="#059669" />
                  <rect x="25" y="42" width="12" height="6" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#059669" />
                  <rect x="65" y="42" width="10" height="8" />
                  <rect x="45" y="65" width="12" height="10" />
                  <rect x="65" y="65" width="14" height="8" />
                  <rect x="85" y="45" width="6" height="16" />
                  <rect x="82" y="82" width="8" height="8" />
                </svg>
                <span className="font-mono text-xs font-bold text-emerald-700 mt-1 tracking-widest">
                  {createdCarePassToken}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Mã bảo mật: <strong>{createdCarePassToken}</strong></p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowQrModal(false);
                  selectCarePass(createdCarePassToken);
                  setActiveTab('PATIENT');
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-900/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Mở Trực Tiếp Trên Màn Hình Bệnh Nhân (Test Luồng)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
              >
                Đóng hộp thoại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
