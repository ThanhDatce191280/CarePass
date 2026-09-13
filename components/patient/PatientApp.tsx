import React, { useState, useEffect } from 'react';
import { useCarePass } from '../../context/CarePassContext';
import { INGREDIENT_CONFLICT_DB, AFFILIATE_PRODUCTS, CLINIC_INFO } from '../../data/mockData';
import { playChimeSound, playEmergencyAlertSound } from '../../utils/audio';
import { TriageSeverity } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Flame, 
  HeartHandshake, 
  Info, 
  Search, 
  Tag, 
  ArrowRight 
} from 'lucide-react';

export const PatientApp: React.FC = () => {
  const { 
    currentCarepass, 
    toggleItemCheckIn, 
    reportIncident, 
    selectCarePass, 
    carepasses, 
    setActiveTab 
  } = useCarePass();

  // Active routine session tab
  const [activeSession, setActiveSession] = useState<'MORNING' | 'EVENING'>('MORNING');
  
  // Smart Spacing Timer state
  const [timerItemId, setTimerItemId] = useState<string | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState<number>(15 * 60); // 15 mins default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [fastTestMode, setFastTestMode] = useState<boolean>(true); // Fast 15s test mode by default for demo
  const [timerFinishedAlert, setTimerFinishedAlert] = useState<boolean>(false);

  // Ingredient Conflict Checker state
  const [ing1, setIng1] = useState<string>('BHA');
  const [ing2, setIng2] = useState<string>('RETINOL');
  const [conflictResult, setConflictResult] = useState<any>(null);

  // SOS Triage Modal state
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [selectedSeverity, setSelectedSeverity] = useState<TriageSeverity>(2);
  const [symptomsText, setSymptomsText] = useState('Da ửng đỏ rát, cảm giác nóng châm chích kéo dài sau khi bôi');
  const [affectedArea, setAffectedArea] = useState('Hai bên má và cánh mũi');
  const [sosSubmitted, setSosSubmitted] = useState<boolean>(false);

  // Gamification Reward Modal
  const [showVoucherModal, setShowVoucherModal] = useState<boolean>(false);
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false);

  // CarePass Token input switcher
  const [inputToken, setInputToken] = useState('');
  const [tokenInputOpen, setTokenInputOpen] = useState(false);

  // Run Spacing Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerSecondsLeft === 0 && timerItemId) {
      setIsTimerRunning(false);
      setTimerFinishedAlert(true);
      playChimeSound();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, timerItemId]);

  const startSpacingTimer = (itemId: string, minutes: number) => {
    const totalSecs = fastTestMode ? 15 : minutes * 60; // 15 seconds demo or full minutes
    setTimerItemId(itemId);
    setTimerTotalSeconds(totalSecs);
    setTimerSecondsLeft(totalSecs);
    setIsTimerRunning(true);
    setTimerFinishedAlert(false);
  };

  const checkConflict = () => {
    const direct = INGREDIENT_CONFLICT_DB[ing1]?.[ing2];
    const reverse = INGREDIENT_CONFLICT_DB[ing2]?.[ing1];
    const res = direct || reverse;

    if (res) {
      setConflictResult(res);
    } else if (ing1 === ing2) {
      setConflictResult({
        status: 'WARNING',
        statusText: 'CẢNH BÁO: TRÙNG LẶP HOẠT CHẤT CÙNG NHÓM',
        title: `${ing1} + ${ing2}`,
        mechanism: 'Dùng lặp lại 2 sản phẩm chứa cùng hoạt chất đặc trị có thể gây quá liều nồng độ cho phép.',
        clinicalAdvice: 'Bác sĩ khuyến cáo chỉ nên chọn 1 sản phẩm nồng độ phù hợp trong một chu kỳ chăm sóc.',
        badgeColor: 'bg-amber-500 text-white',
      });
    } else {
      setConflictResult({
        status: 'SAFE',
        statusText: 'TƯƠNG THÍCH AN TOÀN - CHƯA PHÁT HIỆN TƯƠNG KỴ ĐẶC HIỆU',
        title: `${ing1} + ${ing2}`,
        mechanism: 'Hai hoạt chất này có cơ chế hoạt động tương hỗ, không triệt tiêu hoặc gây phản ứng sinh hóa bất lợi.',
        clinicalAdvice: 'Có thể sử dụng chung. Lưu ý thoa từ kết cấu lỏng đến đặc (Lỏng trước - Đặc sau).',
        badgeColor: 'bg-emerald-500 text-white',
      });
    }
  };

  useEffect(() => {
    checkConflict();
  }, [ing1, ing2]);

  const handleSosSubmit = () => {
    reportIncident(selectedSeverity, symptomsText, affectedArea);
    setSosSubmitted(true);
    if (selectedSeverity >= 2) {
      playEmergencyAlertSound();
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  const carepass = currentCarepass || carepasses[0];
  const routineList = carepass.routine.filter((r) => r.session === activeSession);

  return (
    <div className="flex justify-center items-start py-4 px-2 sm:px-4">
      {/* MOBILE DEVICE FRAME MOCKUP */}
      <div className="w-full max-w-md bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 relative">
        
        {/* Phone Notch / Dynamic Island */}
        <div className="relative mx-auto w-32 h-5 bg-slate-900 rounded-b-2xl flex items-center justify-center mb-1 z-30">
          <div className="w-12 h-3.5 bg-black rounded-full flex items-center justify-end pr-2 space-x-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 py-1 text-slate-400 text-[11px] font-mono">
          <span>09:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px]">5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Screen Content Inner Container (Scrollable) */}
        <div className="bg-slate-50 rounded-[34px] overflow-y-auto max-h-[820px] pb-24 text-slate-900 relative shadow-inner">

          {/* 1. HEADER THẺ CAREPASS */}
          <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 p-5 text-white rounded-b-[28px] shadow-lg relative overflow-hidden">
            {/* Ambient medical wave */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            {/* Clinic Logo & Patient Info */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5 text-emerald-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{CLINIC_INFO.name.split(' ')[0]} {CLINIC_INFO.name.split(' ')[1]} Clinic</span>
                </div>
                <h1 className="text-xl font-bold mt-1 text-white flex items-center space-x-2">
                  <span>{carepass.patientName}</span>
                </h1>
                <p className="text-xs text-emerald-100/80 font-medium mt-0.5">
                  {carepass.diagnosisTitle}
                </p>
              </div>

              {/* Token Badge */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setTokenInputOpen(!tokenInputOpen)}
                  className="bg-black/30 hover:bg-black/40 border border-white/20 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-emerald-300 transition-colors"
                  title="Nhấn để đổi mã CarePass"
                >
                  {carepass.carepassId}
                </button>
                <div className="text-[10px] text-emerald-200 mt-1">
                  Ngày <strong className="text-white">{carepass.currentDay}</strong> / {carepass.totalDays}
                </div>
              </div>
            </div>

            {/* Token Switcher Input Box */}
            {tokenInputOpen && (
              <div className="mt-3 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs animate-in fade-in">
                <div className="text-[11px] text-emerald-200 mb-1 font-medium">Nhập mã CarePass khác:</div>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: CP-1024"
                    className="flex-1 px-2.5 py-1.5 bg-black/40 text-white placeholder-white/40 border border-white/20 rounded-lg text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (carepasses.some((c) => c.carepassId === inputToken)) {
                        selectCarePass(inputToken);
                        setTokenInputOpen(false);
                      } else {
                        alert('Không tìm thấy mã CarePass này! Hãy thử CP-1024 hoặc CP-9921.');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400"
                  >
                    Tải
                  </button>
                </div>
              </div>
            )}

            {/* Adherence Meter & Gamification Points */}
            <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-emerald-100 flex items-center">
                  <Award className="w-4 h-4 mr-1 text-amber-300" />
                  Tiến Độ Tuân Thủ Chuẩn
                </span>
                <span className="font-mono font-bold text-white text-sm">{carepass.adherenceRate}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-200 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${carepass.adherenceRate}%` }}
                />
              </div>

              {/* Gamification Points Badge */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Điểm thưởng: <strong className="text-white font-mono">{carepass.points} pts</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVoucherModal(true)}
                  className="text-[11px] font-semibold text-emerald-300 hover:text-white underline flex items-center"
                >
                  <span>Đổi Voucher 15%</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>

          </div>

          {/* QUICK CONTROLS & TIMELINE SESSION SELECTOR */}
          <div className="p-4 space-y-4">
            
            {/* Session Tabs: Sáng / Tối */}
            <div className="flex bg-slate-200/80 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveSession('MORNING')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  activeSession === 'MORNING'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>☀️ Cữ Bôi Buổi Sáng</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-mono">
                  {carepass.routine.filter((r) => r.session === 'MORNING').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSession('EVENING')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  activeSession === 'EVENING'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🌙 Cữ Bôi Buổi Tối</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full font-mono">
                  {carepass.routine.filter((r) => r.session === 'EVENING').length}
                </span>
              </button>
            </div>

            {/* Smart Spacing Timer Completed Alert (Visual Toast) */}
            {timerFinishedAlert && (
              <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg border border-emerald-500 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-white text-sm">Đã đủ thời gian thẩm thấu hoạt chất!</div>
                    <p className="text-emerald-100 mt-0.5">
                      Lớp da đã sẵn sàng. Hãy thoa tiếp <strong>Kem dưỡng khóa ẩm / Ceramide</strong> để bảo vệ màng biểu bì!
                    </p>
                    <button
                      type="button"
                      onClick={() => setTimerFinishedAlert(false)}
                      className="mt-2 px-3 py-1 bg-white text-emerald-800 font-bold rounded-lg text-xs"
                    >
                      Đã hiểu & Tiếp tục bước sau
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Demo Helper Switch for Reviewers */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-medium">Chế độ Test Đồng Hồ Giãn Cách:</span>
              <button
                type="button"
                onClick={() => setFastTestMode(!fastTestMode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  fastTestMode
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {fastTestMode ? '⚡ Test nhanh 15 giây' : '⏱️ Chạy thực 15 phút'}
              </button>
            </div>

            {/* 2. TIMELINE CỮ BÔI THUỐC THÔNG MINH */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trình tự bôi chuẩn y khoa ({activeSession === 'MORNING' ? 'Sáng' : 'Tối'}):
                </h3>
                <span className="text-[11px] text-slate-500">Bấm check-in nhận +20đ</span>
              </div>

              {routineList.map((step, idx) => {
                const isTimerActiveForThis = timerItemId === step.itemId && isTimerRunning;
                const progressPct =
                  timerTotalSeconds > 0
                    ? Math.round(((timerTotalSeconds - timerSecondsLeft) / timerTotalSeconds) * 100)
                    : 0;

                return (
                  <div
                    key={step.itemId}
                    className={`bg-white rounded-2xl p-4 border transition-all shadow-sm ${
                      step.completed
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Step order & Title */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            step.completed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {step.stepOrder}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {step.productName}
                          </h4>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                            Hoạt chất: {step.activeIngredient}
                          </span>
                        </div>
                      </div>

                      {/* Check-in button */}
                      <button
                        type="button"
                        onClick={() => toggleItemCheckIn(step.itemId)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                          step.completed
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{step.completed ? 'Đã xong' : 'Check-in'}</span>
                      </button>
                    </div>

                    {/* Dosage & Notes */}
                    <div className="mt-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                      <div>
                        <strong className="text-slate-800">Liều lượng:</strong> {step.dosageInstruction}
                      </div>
                      {step.notes && (
                        <div className="text-[11px] text-slate-500 italic">
                          💡 Lưu ý BS: {step.notes}
                        </div>
                      )}
                    </div>

                    {/* Smart Spacing Timer Block if step has waitMinutesAfter > 0 */}
                    {step.waitMinutesAfter > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        {isTimerActiveForThis ? (
                          /* Active Timer View */
                          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold text-amber-900 flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 animate-spin" />
                                Đang đếm ngược giãn cách ({fastTestMode ? '15s test' : `${step.waitMinutesAfter} phút`}):
                              </span>
                              <span className="font-mono font-extrabold text-amber-700 text-sm">
                                {Math.floor(timerSecondsLeft / 60)}:
                                {(timerSecondsLeft % 60).toString().padStart(2, '0')}
                              </span>
                            </div>

                            {/* Timer progress bar */}
                            <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden mb-2">
                              <div
                                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-amber-800">Chờ hoạt chất thẩm thấu</span>
                              <button
                                type="button"
                                onClick={() => setIsTimerRunning(false)}
                                className="text-amber-900 underline font-semibold"
                              >
                                Tạm dừng
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Trigger Spacing Timer button */
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1 text-emerald-600" />
                              Giãn cách y khoa: <strong>{step.waitMinutesAfter} phút</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => startSpacingTimer(step.itemId, step.waitMinutesAfter)}
                              className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                            >
                              <Play className="w-3 h-3 text-teal-600 fill-teal-600" />
                              <span>Bắt đầu chờ {step.waitMinutesAfter} phút</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3. BỘ QUÉT TƯƠNG KỴ MỸ PHẨM CÓ SẴN (INGREDIENT CONFLICT CHECKER) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Bộ Quét Tương Kỵ Mỹ Phẩm Có Sẵn
                  </h3>
                </div>
                <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                  Knowledge Graph AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Kiểm tra an toàn trước khi dùng chung mỹ phẩm cá nhân với phác đồ điều trị:
              </p>

              {/* Selector for 2 ingredients */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Mỹ phẩm / Hoạt chất 1:</label>
                  <select
                    value={ing1}
                    onChange={(e) => setIng1(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="BHA">BHA (Salicylic Acid 2%)</option>
                    <option value="RETINOL">Retinol / Tretinoin</option>
                    <option value="VITAMIN_C">Vitamin C (L-Ascorbic Acid)</option>
                    <option value="B5">Serum B5 (Panthenol)</option>
                    <option value="CERAMIDE">Kem Ceramide Phục hồi</option>
                    <option value="HA">Hyaluronic Acid đa tầng</option>
                    <option value="BENZOYL_PEROXIDE">Benzoyl Peroxide 5%</option>
                    <option value="NIACINAMIDE">Niacinamide 10%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Mỹ phẩm / Hoạt chất 2:</label>
                  <select
                    value={ing2}
                    onChange={(e) => setIng2(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="RETINOL">Retinol / Tretinoin</option>
                    <option value="BHA">BHA (Salicylic Acid 2%)</option>
                    <option value="VITAMIN_C">Vitamin C (L-Ascorbic Acid)</option>
                    <option value="B5">Serum B5 (Panthenol)</option>
                    <option value="CERAMIDE">Kem Ceramide Phục hồi</option>
                    <option value="HA">Hyaluronic Acid đa tầng</option>
                    <option value="BENZOYL_PEROXIDE">Benzoyl Peroxide 5%</option>
                    <option value="NIACINAMIDE">Niacinamide 10%</option>
                  </select>
                </div>
              </div>

              {/* Quick Sample Buttons */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="text-slate-400 self-center">Thử nhanh:</span>
                <button
                  type="button"
                  onClick={() => { setIng1('BHA'); setIng2('RETINOL'); }}
                  className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-medium"
                >
                  BHA + Retinol (Đỏ)
                </button>
                <button
                  type="button"
                  onClick={() => { setIng1('VITAMIN_C'); setIng2('NIACINAMIDE'); }}
                  className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-medium"
                >
                  Vit C + Niacinamide (Vàng)
                </button>
                <button
                  type="button"
                  onClick={() => { setIng1('B5'); setIng2('CERAMIDE'); }}
                  className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-medium"
                >
                  B5 + Ceramide (Xanh)
                </button>
              </div>

              {/* Conflict Checker Result Card */}
              {conflictResult && (
                <div className={`p-3.5 rounded-xl border text-xs ${
                  conflictResult.status === 'DANGER'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : conflictResult.status === 'WARNING'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${conflictResult.badgeColor}`}>
                      {conflictResult.status === 'DANGER' && 'ĐỎ: XUNG ĐỘT NGUY HIỂM'}
                      {conflictResult.status === 'WARNING' && 'VÀNG: CẦN GIÃN CÁCH / CHIA SÁNG TỐI'}
                      {conflictResult.status === 'SAFE' && 'XANH: TƯƠNG THÍCH AN TOÀN TUYỆT ĐỐI'}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 mt-2 text-xs">
                    {conflictResult.title}
                  </div>

                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                    <strong>Cơ chế dược học:</strong> {conflictResult.mechanism}
                  </p>

                  <div className="mt-2 text-[11px] font-medium bg-white/70 p-2 rounded-lg border border-slate-200/60 text-slate-800">
                    🧑‍⚕️ {conflictResult.clinicalAdvice}
                  </div>
                </div>
              )}
            </div>

            {/* 5. KÊNH MỸ PHẨM PHỤC HỒI CHÍNH HÃNG (HIGH-INTENT COMMERCE) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    Mỹ Phẩm Phục Hồi Tương Thích 100%
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Chuẩn Phòng Khám
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sản phẩm được bác sĩ chỉ định phù hợp trực tiếp với liệu trình của bạn:
              </p>

              {/* Exclusive Voucher Ribbon */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-2.5 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold">Mã Voucher độc quyền: <span className="font-mono text-amber-300">CAREPASS15</span></div>
                  <div className="text-[10px] text-emerald-100">Giảm ngay 15% tại Shopee Mall & LazMall</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyVoucherCode('CAREPASS15')}
                  className="px-2.5 py-1 bg-white text-emerald-800 font-bold rounded-lg text-xs hover:bg-emerald-50 flex items-center space-x-1"
                >
                  {copiedVoucher ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVoucher ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              {/* Products List */}
              <div className="space-y-2.5">
                {AFFILIATE_PRODUCTS.slice(0, 2).map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 transition-colors"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {prod.badge}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                        {prod.name}
                      </h4>
                      <div className="flex items-baseline space-x-1.5 mt-0.5">
                        <span className="text-xs font-bold text-emerald-700">{prod.price}</span>
                        <span className="text-[10px] text-slate-400 line-through">{prod.originalPrice}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Mở link liên kết Shopee Mall chính hãng với mã giảm giá CAREPASS15 đã được áp dụng cho: ${prod.name}`)}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Re-examination appointment booking */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => alert('Đã gửi yêu cầu đặt lịch tái khám định kỳ tới MedSkin Clinic. Trợ lý bác sĩ sẽ liên hệ xác nhận trong 15 phút!')}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đặt Lịch Tái Khám Định Kỳ (Nhận Ưu Đãi -15%)</span>
                </button>
              </div>
            </div>

          </div>

          {/* 4. NÚT BÁO ĐỘNG KÍCH ỨNG KHẨN CẤP (SOS INCIDENT TRIAGE) FLOATING */}
          <div className="sticky bottom-3 px-4 z-40">
            <button
              type="button"
              id="btn-patient-sos"
              onClick={() => {
                setShowSosModal(true);
                setSosSubmitted(false);
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold rounded-2xl text-xs shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all border border-rose-400/30 animate-pulse"
            >
              <ShieldAlert className="w-4 h-4 text-white shrink-0" />
              <span>BÁO ĐỘNG KÍCH ỨNG KHẨN CẤP (SOS TRIAGE)</span>
            </button>
          </div>

        </div>

        {/* Phone Bottom Bar Indicator */}
        <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-2 mb-1" />

      </div>

      {/* SOS TRIAGE MODAL (3 CẤP ĐỘ) */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left max-h-[90vh] overflow-y-auto">
            
            {!sosSubmitted ? (
              <div>
                <div className="flex items-center space-x-2 text-rose-600 mb-2">
                  <ShieldAlert className="w-6 h-6" />
                  <h3 className="text-base font-bold text-slate-900">
                    Phân Luồng Sự Cố Kích Ứng (Incident Triage)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Hệ thống phân luồng y tế khẩn cấp 3 cấp độ theo chuẩn Da liễu (SLA cam kết 30 phút). Vui lòng chọn mức độ biểu hiện:
                </p>

                {/* 3 Levels Selector */}
                <div className="space-y-2.5 mb-4">
                  {/* Level 1 */}
                  <div
                    onClick={() => setSelectedSeverity(1)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedSeverity === 1
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">Cấp độ 1: Châm chích nhẹ & Khô căng</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">MILD</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Ngứa râm ran nhẹ, bong vảy tế bào chết li ti, không sưng viêm phù nề.
                    </p>
                  </div>

                  {/* Level 2 */}
                  <div
                    onClick={() => setSelectedSeverity(2)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedSeverity === 2
                        ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950">Cấp độ 2: Đỏ rát lan rộng & Nóng bừng</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">MODERATE - SLA 30P</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Vùng da ửng đỏ rõ rệt sau khi bôi thuốc, cảm giác nóng rát kéo dài &gt; 30 phút. Gửi tín hiệu khẩn cấp về Dashboard Bác sĩ!
                    </p>
                  </div>

                  {/* Level 3 */}
                  <div
                    onClick={() => setSelectedSeverity(3)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedSeverity === 3
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900">Cấp độ 3: Sưng phù, bọng nước & Bỏng rát</span>
                      <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">SEVERE - CẤP CỨU</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Phù nề mí mắt/mặt, nổi nốt phỏng rộp hoặc chảy dịch. Cần gọi Hotline cấp cứu ngay lập tức!
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả triệu chứng cụ thể:</label>
                    <textarea
                      rows={2}
                      value={symptomsText}
                      onChange={(e) => setSymptomsText(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vùng da bị ảnh hưởng:</label>
                    <input
                      type="text"
                      value={affectedArea}
                      onChange={(e) => setAffectedArea(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowSosModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSosSubmit}
                    className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 shadow-md shadow-rose-900/20"
                  >
                    Gửi Tín Hiệu SOS
                  </button>
                </div>
              </div>
            ) : (
              /* Submission Result Guide by Level */
              <div>
                {selectedSeverity === 1 && (
                  <div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 text-center">Hướng Dẫn Sơ Cứu Tại Chỗ (Cấp 1)</h3>
                    <p className="text-xs text-slate-500 text-center mb-4">
                      Phản ứng châm chích nhẹ thường gặp ở giai đoạn đầu thích ứng:
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 space-y-2 mb-4">
                      <div className="font-bold">Các bước sơ cứu ngay:</div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Rửa lại mặt bằng nước muối sinh lý NaCl 0.9% mát để trôi bớt thuốc tồn dư.</li>
                        <li>Đắp gạc y tế ngâm nước sạch mát trong 10 phút để hạ nhiệt da.</li>
                        <li>Thoa một lớp dày kem phục hồi B5 / Ceramide làm dịu.</li>
                        <li>Tạm ngưng hoạt chất đặc trị (Retinoid/Acid) trong 48 giờ tới.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {selectedSeverity === 2 && (
                  <div>
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 text-center">Đã Kích Hoạt SLA 30 Phút Của Bác Sĩ</h3>
                    <p className="text-xs text-slate-500 text-center mb-4">
                      Tín hiệu đã được đẩy lên Bảng điều khiển của Phòng khám. Bác sĩ hoặc Trợ lý chuyên môn sẽ gọi lại cho bạn trong vòng 30 phút!
                    </p>
                    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-950 space-y-2 mb-4">
                      <div className="font-bold flex items-center justify-between">
                        <span>Đồng hồ SLA phản hồi:</span>
                        <span className="font-mono font-bold text-amber-700">&lt; 30:00</span>
                      </div>
                      <p className="text-[11px]">
                        Trong lúc chờ đợi: <strong>Ngừng ngay mọi sản phẩm treatment</strong>, thấm khô da và đắp gạc lạnh.
                      </p>
                    </div>
                  </div>
                )}

                {selectedSeverity === 3 && (
                  <div>
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-rose-700 text-center">CẢNH BÁO ĐỎ CẤP CỨU DA LIỄU</h3>
                    <p className="text-xs text-slate-500 text-center mb-4">
                      Dấu hiệu sưng phù hoặc bóng nước cấp tính cần can thiệp y tế trực tiếp ngay lập tức!
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <a
                        href={`tel:${CLINIC_INFO.emergencyPhone}`}
                        className="w-full py-3 bg-rose-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/30"
                      >
                        <Phone className="w-4 h-4" />
                        <span>GỌI HOTLINE KHẨN CẤP: {CLINIC_INFO.emergencyPhone}</span>
                      </a>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-700">
                        <div className="font-bold flex items-center text-slate-900 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 mr-1" />
                          <span>Bệnh viện Da Liễu TP.HCM / Hà Nội gần nhất:</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Địa chỉ: Số 2 Nguyễn Thông, Phường Võ Thị Sáu, Quận 3, TP.HCM (Cấp cứu 24/7).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSosModal(false);
                      setActiveTab('DOCTOR');
                    }}
                    className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Xem Ngay Trên Bảng Bác Sĩ
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSosModal(false)}
                    className="py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* GAMIFICATION REWARD VOUCHER MODAL */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Đổi Voucher Tái Khám 15%</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bạn đang có <strong className="text-emerald-700">{carepass.points} điểm thưởng</strong> tích lũy nhờ tuân thủ đều đặn!
            </p>

            <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Mã Giảm Giá 15% Khám Lại:</span>
              <div className="text-xl font-mono font-extrabold text-amber-700 mt-1">
                TK-CAREPASS15
              </div>
              <p className="text-[10px] text-amber-800 mt-1">Áp dụng cho buổi tái khám tiếp theo tại {CLINIC_INFO.name}</p>
            </div>

            <button
              type="button"
              onClick={() => copyVoucherCode('TK-CAREPASS15')}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 mb-2 shadow-sm"
            >
              {copiedVoucher ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedVoucher ? 'Đã sao chép mã!' : 'Sao chép mã voucher'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowVoucherModal(false)}
              className="w-full py-2 bg-slate-100 text-slate-600 font-medium rounded-xl text-xs hover:bg-slate-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
