import React from 'react';
import { useCarePass } from '../context/CarePassContext';
import { 
  Building2, 
  Smartphone, 
  Cpu, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Activity,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    carepasses, 
    currentCarepassId, 
    selectCarePass, 
    activeSlaSeconds, 
    unresolvedIncidentsCount 
  } = useCarePass();

  const formatSla = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-teal-200">
                  CarePass
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  B2B2C MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Trợ lý số phục hồi da hậu khám da liễu</p>
            </div>
          </div>

          {/* Role Switcher Tabs (3 Tabs) */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              id="nav-tab-doctor"
              type="button"
              onClick={() => setActiveTab('DOCTOR')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'DOCTOR'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden md:inline">Bác sĩ / Phòng khám</span>
              <span className="md:hidden">Bác sĩ</span>
              {unresolvedIncidentsCount > 0 && (
                <span className="relative flex h-2.5 w-2.5 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </button>

            <button
              id="nav-tab-patient"
              type="button"
              onClick={() => setActiveTab('PATIENT')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'PATIENT'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Bệnh nhân / Khách hàng</span>
              <span className="md:hidden">Bệnh nhân</span>
            </button>

            <button
              id="nav-tab-specs"
              type="button"
              onClick={() => setActiveTab('IT_SPECS')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'IT_SPECS'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden md:inline">Kiến trúc IT & Specs</span>
              <span className="md:hidden">Luồng IT</span>
            </button>
          </nav>

          {/* Right Status & Active Patient Picker */}
          <div className="flex items-center space-x-3">
            {/* Live SLA Badge Alert if active incidents */}
            {unresolvedIncidentsCount > 0 && (
              <div 
                onClick={() => setActiveTab('DOCTOR')}
                className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-rose-950/80 border border-rose-600/50 text-rose-300 rounded-lg text-xs cursor-pointer hover:bg-rose-900/50 transition-colors animate-pulse"
                title="Bệnh nhân báo động kích ứng cấp độ 2/3 - Cần xử trí"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold">SLA Phản hồi:</span>
                <span className="font-mono font-bold text-rose-200 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatSla(activeSlaSeconds)}
                </span>
              </div>
            )}

            {/* Quick Switch Patient Selector */}
            <div className="relative group hidden sm:flex items-center">
              <div className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs transition-colors">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400">Đang chọn mã:</div>
                  <div className="font-mono font-bold text-emerald-300 flex items-center space-x-1">
                    <span>{currentCarepassId}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Patient Dropdown */}
              <div className="absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Chuyển hồ sơ bệnh nhân:
                </div>
                {carepasses.map((cp) => (
                  <button
                    key={cp.carepassId}
                    type="button"
                    onClick={() => selectCarePass(cp.carepassId)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      cp.carepassId === currentCarepassId
                        ? 'bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{cp.patientName}</div>
                      <div className="text-[10px] text-slate-400">{cp.diagnosisTitle.slice(0, 24)}...</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                        {cp.carepassId}
                      </span>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{cp.adherenceRate}% tuân thủ</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
