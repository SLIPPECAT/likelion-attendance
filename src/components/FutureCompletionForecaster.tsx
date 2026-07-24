import React, { useState } from 'react';
import {
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Zap,
  Sliders,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { AttendanceSummary } from '../types';

interface FutureCompletionForecasterProps {
  summary: AttendanceSummary;
}

export const FutureCompletionForecaster: React.FC<FutureCompletionForecasterProps> = ({
  summary,
}) => {
  // Default total target course training days (default: 111 days)
  const defaultTotalDays = Math.max(111, summary.totalDays);
  const [totalCourseDays, setTotalCourseDays] = useState<number>(defaultTotalDays);

  // Simulation controls for remaining days
  const [simulatedFutureAbsences, setSimulatedFutureAbsences] = useState<number>(0);
  const [simulatedFuturePartials, setSimulatedFuturePartials] = useState<number>(0);

  // PDF Current Stats
  const pdfDays = summary.totalDays;
  const currentEffectiveAttendance = summary.effectiveAttendanceDays;
  const currentPureAbsences = summary.pureAbsenceDays;
  const currentEffectiveAbsences = summary.totalEffectiveAbsences;
  const currentTotalPartials = summary.totalPartialAbsences;

  // Derived Future Course Metrics
  const remainingDays = Math.max(0, totalCourseDays - pdfDays);
  const targetRequiredAttendance = Math.ceil(totalCourseDays * 0.8);
  const targetMaxAllowedAbsences = Math.floor(totalCourseDays * 0.2);

  // Key Forecast 1: 100% Attendance in Remaining Days
  const maxPossibleAttendance = currentEffectiveAttendance + remainingDays;
  const maxPossibleRate =
    totalCourseDays > 0 ? Math.round((maxPossibleAttendance / totalCourseDays) * 1000) / 10 : 0;
  const isMaxPossiblePassed = maxPossibleAttendance >= targetRequiredAttendance;

  // Key Forecast 2: Remaining Absence Allowance
  const remainingAbsenceAllowance = targetMaxAllowedAbsences - currentEffectiveAbsences;

  // Key Forecast 3: Minimum Needed Attendance in Remaining Days
  const minAttendanceNeededInRemaining = Math.max(
    0,
    targetRequiredAttendance - currentEffectiveAttendance
  );

  // Simulation Calculations
  const totalSimulatedPartials = currentTotalPartials + simulatedFuturePartials;
  const simulatedConvertedAbsences = Math.floor(totalSimulatedPartials / 3);
  const simulatedTotalEffectiveAbsences =
    currentPureAbsences + simulatedFutureAbsences + simulatedConvertedAbsences;
  const simulatedFinalAttendance = Math.max(0, totalCourseDays - simulatedTotalEffectiveAbsences);
  const simulatedRate =
    totalCourseDays > 0
      ? Math.round((simulatedFinalAttendance / totalCourseDays) * 1000) / 10
      : 0;
  const isSimulatedPassed = simulatedFinalAttendance >= targetRequiredAttendance;

  // Preset Total Training Days handlers
  const handlePresetDays = (days: number) => {
    setTotalCourseDays(days);
    setSimulatedFutureAbsences(0);
    setSimulatedFuturePartials(0);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#ff6000] mb-1">
            <Calculator className="w-4 h-4 text-[#ff6000]" />
            <span>80% 수료 조건 예측 계산기</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            전체 교육일수({totalCourseDays}일) 기준 수료 예측 &amp; 시뮬레이션
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            PDF의 현재 누적 학습일({pdfDays}일) 이후 남은 기간({remainingDays}일) 동안의 출석 가능 여부 및 여유 일수를 산출합니다.
          </p>
        </div>

        {/* Total Course Days Setting Control */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col space-y-2 min-w-[260px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#ff6000]" />
              전체 과정 총 교육일수:
            </span>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min={pdfDays}
                max={300}
                value={totalCourseDays}
                onChange={(e) => setTotalCourseDays(Math.max(pdfDays, Number(e.target.value) || pdfDays))}
                className="w-16 px-2 py-0.5 bg-white border border-gray-200 rounded-lg text-right font-bold text-sm text-[#ff6000] focus:outline-none focus:border-[#ff6000]"
              />
              <span className="text-xs font-bold text-gray-800">일</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-1.5 pt-1 text-[11px]">
            <span className="text-gray-400 text-[10px]">빠른 설정:</span>
            <button
              type="button"
              onClick={() => handlePresetDays(111)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                totalCourseDays === 111
                  ? 'bg-[#ff6000] text-white border-[#ff6000]'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'
              }`}
            >
              111일 (기본)
            </button>
            <button
              type="button"
              onClick={() => handlePresetDays(120)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                totalCourseDays === 120
                  ? 'bg-[#ff6000] text-white border-[#ff6000]'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'
              }`}
            >
              120일
            </button>
            <button
              type="button"
              onClick={() => handlePresetDays(100)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                totalCourseDays === 100
                  ? 'bg-[#ff6000] text-white border-[#ff6000]'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'
              }`}
            >
              100일
            </button>
            <button
              type="button"
              onClick={() => handlePresetDays(pdfDays)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                totalCourseDays === pdfDays
                  ? 'bg-[#ff6000] text-white border-[#ff6000]'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'
              }`}
            >
              {pdfDays}일 (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Progress Timeline Pill */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff6000]" />
            <span className="text-gray-600">PDF 진행일:</span>
            <span className="font-bold text-gray-900 text-sm">{pdfDays}일</span>
          </div>
          <span className="text-gray-300">+</span>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-600">남은 교육일:</span>
            <span className="font-bold text-emerald-600 text-sm">{remainingDays}일</span>
          </div>
          <span className="text-gray-300">=</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">총 과정:</span>
            <span className="font-bold text-[#ff6000] text-sm">{totalCourseDays}일</span>
          </div>
        </div>

        <div className="text-gray-600 text-[11px] bg-white px-3 py-1.5 rounded-full border border-gray-200">
          80% 최소 필수 출석: <strong className="text-gray-900">{targetRequiredAttendance}일</strong> | 최대 허용 총 결석: <strong className="text-rose-600">{targetMaxAllowedAbsences}일</strong>
        </div>
      </div>

      {/* 3 Major Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 100% Attendance Scenario */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>남은 {remainingDays}일 전일 출석 시</span>
            <Zap className="w-4 h-4 text-[#ff6000]" />
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {maxPossibleRate}%
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              인정 출석 <strong className="text-emerald-600">{maxPossibleAttendance}일</strong> / {totalCourseDays}일
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[11px] text-gray-500">수료 가능 여부:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isMaxPossiblePassed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isMaxPossiblePassed ? '수료 가능 (PASS)' : '수료 불가 (FAIL)'}
            </span>
          </div>
        </div>

        {/* Card 2: Remaining Absence Allowance */}
        <div className={`border rounded-2xl p-5 space-y-2 relative overflow-hidden ${
          remainingAbsenceAllowance >= 0
            ? 'bg-emerald-50/50 border-emerald-200'
            : 'bg-rose-50/50 border-rose-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={remainingAbsenceAllowance >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
              추가 결석 가능 여유 일수
            </span>
            <ShieldCheck className={`w-4 h-4 ${remainingAbsenceAllowance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
          </div>

          <div>
            <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              remainingAbsenceAllowance >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {remainingAbsenceAllowance >= 0 ? `${remainingAbsenceAllowance}일 여유` : `${Math.abs(remainingAbsenceAllowance)}일 초과`}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              총 허용 결석({targetMaxAllowedAbsences}일) - 현재 결석({currentEffectiveAbsences}일)
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-600">
            {remainingAbsenceAllowance >= 0 ? (
              <span>
                남은 {remainingDays}일 중 <strong className="text-emerald-700 font-bold">{remainingAbsenceAllowance}일 이하 결석</strong> 시 80% 수료 유지
              </span>
            ) : (
              <span className="text-rose-700">
                이미 총 허용 결석 일수를 {Math.abs(remainingAbsenceAllowance)}일 초과하여 수료가 어렵습니다.
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Minimum Needed Attendance in Remaining Days */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>수료(80%) 최소 필요 출석일</span>
            <Target className="w-4 h-4 text-[#ff6000]" />
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#ff6000] tracking-tight">
              {minAttendanceNeededInRemaining}일 필수
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              남은 {remainingDays}일 중 최소 필요 출석일
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-600">
            {minAttendanceNeededInRemaining <= remainingDays ? (
              <span>
                남은 {remainingDays}일 중 최소 <strong className="text-gray-900 font-bold">{minAttendanceNeededInRemaining}일 이상 출석</strong> 필요
              </span>
            ) : (
              <span className="text-rose-600">
                남은 일수를 모두 출석해도 수료 기준을 충족할 수 없습니다.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Future Attendance Simulator */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
          <Sliders className="w-4 h-4 text-[#ff6000]" />
          <h4 className="font-bold text-gray-900 text-sm sm:text-base">
            남은 기간({remainingDays}일) 출결 시뮬레이터
          </h4>
          <span className="text-xs text-gray-500">
            (향후 예상 결석/지각 건수를 조절해보세요)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Future Absences */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-700 font-medium">
                향후 예상 결석 일수:
              </span>
              <span className="text-rose-700 font-bold text-sm bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {simulatedFutureAbsences}일 결석
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={remainingDays}
              value={simulatedFutureAbsences}
              onChange={(e) => setSimulatedFutureAbsences(Number(e.target.value))}
              className="w-full accent-[#ff6000] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0일 (전일 출석)</span>
              <span>{Math.floor(remainingDays / 2)}일</span>
              <span>{remainingDays}일 (전일 결석)</span>
            </div>
          </div>

          {/* Slider 2: Future Partials */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-700 font-medium">
                향후 예상 지각·조퇴·외출 횟수:
              </span>
              <span className="text-[#ff6000] font-bold text-sm bg-[#fff7ed] px-2.5 py-0.5 rounded-full border border-[#ffedd5]">
                {simulatedFuturePartials}회 누적
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={simulatedFuturePartials}
              onChange={(e) => setSimulatedFuturePartials(Number(e.target.value))}
              className="w-full accent-[#ff6000] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0회</span>
              <span>3회 (+1일 결석)</span>
              <span>6회 (+2일 결석)</span>
              <span>15회</span>
            </div>
          </div>
        </div>

        {/* Simulation Live Result Box */}
        <div
          className={`rounded-2xl p-5 border transition-all ${
            isSimulatedPassed
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-rose-50 border-rose-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                  isSimulatedPassed
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-rose-100 text-rose-700 border border-rose-300'
                }`}
              >
                {isSimulatedPassed ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  시뮬레이션 예상 결과
                </div>
                <div className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <span>최종 예상 출석률: <strong className={isSimulatedPassed ? 'text-emerald-700' : 'text-rose-700'}>{simulatedRate}%</strong></span>
                  <span className="text-xs text-gray-500 font-normal">
                    ({simulatedFinalAttendance}일 / {totalCourseDays}일)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  isSimulatedPassed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {isSimulatedPassed ? '80% 수료 충족' : '80% 수료 미달'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed breakdown of simulation */}
          <div className="mt-3 pt-3 border-t border-gray-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-gray-600">
            <div>
              <span className="text-gray-500 text-[10px] block font-sans">예상 총 결석</span>
              <strong className="text-rose-600">{simulatedTotalEffectiveAbsences}일</strong>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block font-sans">순수 결석 합계</span>
              <span>{currentPureAbsences + simulatedFutureAbsences}일</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block font-sans">지각/조퇴/외출 누적</span>
              <span>{totalSimulatedPartials}회</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block font-sans">지각 환산 결석</span>
              <span>+{simulatedConvertedAbsences}일</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


