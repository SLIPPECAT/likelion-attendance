import React, { useState } from 'react';
import {
  CalendarCheck,
  CalendarX,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Scale,
  Sparkles,
  Shield,
  Zap,
  Share2,
} from 'lucide-react';
import { AttendanceSummary } from '../types';
import { ShareCardModal } from './ShareCardModal';

interface AttendanceSummaryProps {
  summary: AttendanceSummary;
}

export type GradeType = '멋' | '쟁' | '이' | '사' | '자';

interface GradeDefinition {
  grade: GradeType;
  title: string;
  range: string;
  description: string;
  minRate: number;
  activeColor: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
}

export const ATTENDANCE_GRADES: GradeDefinition[] = [
  {
    grade: '멋',
    title: '최우수 개근',
    range: '98% ~ 100%',
    description: '완벽에 가까운 열정! 멋쟁이사자부트캠프 대표 개근 수강생입니다.',
    minRate: 98,
    activeColor: 'bg-[#ff6000] text-white border-[#ff6000] shadow-xs',
    badgeBg: 'bg-[#fff7ed]',
    borderColor: 'border-[#ffedd5]',
    textColor: 'text-[#ff6000]',
  },
  {
    grade: '쟁',
    title: '우수 출결',
    range: '90% ~ 97.9%',
    description: '성실하고 안정적입니다. 매우 훌륭한 학습 태도를 유지 중입니다.',
    minRate: 90,
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
    badgeBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  {
    grade: '이',
    title: '수료 안전',
    range: '80% ~ 89.9%',
    description: '수료 기준(80%)을 안정적으로 충족하는 양호한 출결 상태입니다.',
    minRate: 80,
    activeColor: 'bg-blue-600 text-white border-blue-600 shadow-xs',
    badgeBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    grade: '사',
    title: '주의/경고',
    range: '70% ~ 79.9%',
    description: '수료 기준 미달 위험! 세심한 지각 및 결석 관리가 필요합니다.',
    minRate: 70,
    activeColor: 'bg-amber-500 text-white border-amber-500 shadow-xs',
    badgeBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
  },
  {
    grade: '자',
    title: '위험/초과',
    range: '0% ~ 69.9%',
    description: '수료 기준에 크게 미달하는 위험군입니다. 추가 결석을 철저히 방지하세요.',
    minRate: 0,
    activeColor: 'bg-rose-600 text-white border-rose-600 shadow-xs',
    badgeBg: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800',
  },
];

export function getGradeInfo(rate: number): GradeDefinition {
  if (rate >= 98) return ATTENDANCE_GRADES[0];
  if (rate >= 90) return ATTENDANCE_GRADES[1];
  if (rate >= 80) return ATTENDANCE_GRADES[2];
  if (rate >= 70) return ATTENDANCE_GRADES[3];
  return ATTENDANCE_GRADES[4];
}

export const AttendanceSummaryView: React.FC<AttendanceSummaryProps> = ({ summary }) => {
  const {
    studentName,
    courseName,
    period,
    cohort,
    totalDays,
    pureAttendanceDays,
    pureAbsenceDays,
    lateCount,
    earlyLeaveCount,
    outingCount,
    lateAndOutingCount,
    totalPartialAbsences,
    convertedAbsenceDays,
    remainingPartialAbsences,
    totalEffectiveAbsences,
    effectiveAttendanceDays,
    attendanceRate,
    isPassed,
    requiredAttendanceDays,
    marginAbsenceDays,
  } = summary;

  const currentGrade = getGradeInfo(attendanceRate);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Student & Course Header Card with Grade Badge */}
      <div className="promo-tile relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#ff6000] mb-1">
              <span>{cohort || '멋쟁이사자부트캠프'}</span>
              <span>•</span>
              <span>{period || '출결 기간'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {studentName} <span className="text-sm font-normal text-gray-500">수강생</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1 font-medium">{courseName}</p>
          </div>

          {/* Completion Status & Grade Badge */}
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="shrink-0 w-11 h-11 rounded-2xl border border-hairline bg-white hover:bg-surface-warm flex items-center justify-center text-gray-600 hover:text-accent transition-colors cursor-pointer"
              title="출결 카드 공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Grade Tile Badge */}
            <div className={`p-3 sm:p-4 rounded-2xl border flex items-center space-x-3 ${currentGrade.badgeBg} ${currentGrade.borderColor}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-xs ${currentGrade.activeColor}`}>
                {currentGrade.grade}
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  멋사 출결 등급
                </div>
                <div className={`text-base font-extrabold ${currentGrade.textColor}`}>
                  {currentGrade.title} ({currentGrade.grade}등급)
                </div>
                <div className="text-[11px] text-gray-600">
                  출석률 <strong className="font-bold">{attendanceRate}%</strong>
                </div>
              </div>
            </div>

            {/* Pass/Fail Status Badge */}
            <div
              className={`px-4 py-3 rounded-2xl border flex items-center space-x-3 ${
                isPassed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {isPassed ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  80% 수료 여부
                </div>
                <div className="text-sm sm:text-base font-bold tracking-tight text-gray-900">
                  {isPassed ? '수료 충족 (PASS)' : '수료 미달 (FAIL)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 멋·쟁·이·사·자 5Grade Roadmap Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#ff6000]" />
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
              멋쟁이사자부트캠프 출결 5단계 등급 시스템 ('멋·쟁·이·사·자')
            </h4>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline">
            출석률 구간별 5단계 등급 칭호
          </span>
        </div>

        {/* 5 Grade Tiles Roadmap */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {ATTENDANCE_GRADES.map((g) => {
            const isCurrent = g.grade === currentGrade.grade;
            return (
              <div
                key={g.grade}
                className={`relative rounded-xl p-3 border transition-all text-center flex flex-col items-center justify-between ${
                  isCurrent
                    ? `${g.badgeBg} ${g.borderColor} ring-2 ring-[#ff6000]/30 shadow-xs`
                    : 'bg-gray-50/70 border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 bg-[#ff6000] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                    MY
                  </span>
                )}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg mb-1 ${
                    isCurrent ? g.activeColor : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {g.grade}
                </div>
                <div className="text-xs font-bold text-gray-900">{g.title}</div>
                <div className="text-[10px] text-gray-500 font-medium mt-0.5">{g.range}</div>
              </div>
            );
          })}
        </div>

        {/* Current Grade Highlight Description */}
        <div className={`rounded-xl p-3.5 border flex items-center space-x-3 text-xs ${currentGrade.badgeBg} ${currentGrade.borderColor}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${currentGrade.activeColor}`}>
            {currentGrade.grade}
          </div>
          <div>
            <span className={`font-bold ${currentGrade.textColor}`}>
              [{currentGrade.grade} 등급 - {currentGrade.title}]
            </span>{' '}
            <span className="text-gray-700">{currentGrade.description}</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Days */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
            <span>총 진행 교육일</span>
            <CalendarCheck className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalDays}일</div>
          <p className="text-[11px] text-gray-500 mt-1">출석부 진행 일수</p>
        </div>

        {/* Pure Attendance */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold mb-2">
            <span>순수 출석일</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
            {pureAttendanceDays}일
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">정상 출석 건수</p>
        </div>

        {/* Pure Absences */}
        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 text-xs font-semibold mb-2">
            <span>순수 결석일</span>
            <CalendarX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600">{pureAbsenceDays}일</div>
          <p className="text-[11px] text-rose-600 mt-1">전일 결석 건수</p>
        </div>

        {/* Late / Early Leave / Outing Count */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#ff6000] text-xs font-semibold mb-2">
            <span>지각·조퇴·외출</span>
            <Clock className="w-4 h-4 text-[#ff6000]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#ff6000]">
            {totalPartialAbsences}회
          </div>
          <p className="text-[11px] text-gray-600 mt-1">
            지각 {lateCount} · 조퇴 {earlyLeaveCount} · 외출 {outingCount}
            {lateAndOutingCount > 0 ? ` · 중복${lateAndOutingCount}` : ''}
          </p>
        </div>
      </div>

      {/* Deep Analysis Grid: 3-Tardy Penalty Rule & 80% Threshold Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Rule Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#fff7ed] border border-[#ffedd5] flex items-center justify-center text-[#ff6000]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                지각·조퇴·외출 3회 = 결석 1회 처리
              </h4>
              <p className="text-xs text-gray-500">누적 3회마다 결석 1일 차감 환산</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
              <span>총 지각/조퇴/외출 누적:</span>
              <span className="text-[#ff6000] font-bold text-sm">{totalPartialAbsences}회</span>
            </div>

            {/* Formula display */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-gray-700">
                <span>• 누적 건수:</span>
                <span className="text-gray-900 font-bold">{totalPartialAbsences}회</span>
              </div>
              <div className="flex justify-between text-gray-700 pt-1 border-t border-gray-100">
                <span>• 결석 환산 ({totalPartialAbsences} ÷ 3):</span>
                <span className="text-rose-600 font-bold">
                  +{convertedAbsenceDays}일 결석 추가
                </span>
              </div>
              <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-100">
                <span>• 환산 후 잔여 건수:</span>
                <span className="text-[#ff6000] font-bold">
                  {remainingPartialAbsences}회 (1회 추가 시 결석 1일 차감)
                </span>
              </div>
            </div>

            {/* Visual Penalty Gauge towards next converted absence */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                <span>다음 결석 1회 추가까지</span>
                <span className="font-bold text-[#ff6000]">
                  {remainingPartialAbsences} / 3회 (남은 허용 {3 - remainingPartialAbsences}회)
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden p-0.5 relative">
                <div
                  className="bg-[#ff6000] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(remainingPartialAbsences / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
              <span className="text-gray-600">최종 인정한 총 결석일수:</span>
              <span className="font-bold text-rose-600 text-sm">
                순수 {pureAbsenceDays}일 + 환산 {convertedAbsenceDays}일 = {totalEffectiveAbsences}일
              </span>
            </div>
          </div>
        </div>

        {/* 2. Rule Card: 80% 출석률 수료 기준 판정 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                80% 출석률 수료 기준
              </h4>
              <p className="text-xs text-gray-500">부트캠프 수료 최소 출석률 조건</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs text-gray-500 block">현재 출석률</span>
                <span
                  className={`text-3xl font-extrabold ${
                    isPassed ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {attendanceRate}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">인정 출석 / 총 진행일</span>
                <span className="text-sm font-bold text-gray-900">
                  {effectiveAttendanceDays}일 / {totalDays}일
                </span>
              </div>
            </div>

            {/* Attendance Rate Progress Bar vs 80% Threshold */}
            <div className="relative pt-2">
              <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-1">
                <span>0%</span>
                <span className="text-rose-600 font-bold">수료 마지노선 (80%)</span>
                <span>100%</span>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden p-0.5 relative">
                {/* 80% Marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-600 z-10"
                  style={{ left: '80%' }}
                />

                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isPassed ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, attendanceRate)}%` }}
                />
              </div>
            </div>

            {/* Analysis details */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                <span className="text-gray-500 block text-[11px]">80% 최소 필요일수</span>
                <span className="text-gray-900 font-bold text-sm">
                  {requiredAttendanceDays}일
                </span>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                <span className="text-gray-500 block text-[11px]">현재 기준 여유 결석</span>
                <span
                  className={`font-bold text-sm ${
                    marginAbsenceDays > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {marginAbsenceDays}일 남음
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isShareOpen && (
        <ShareCardModal summary={summary} onClose={() => setIsShareOpen(false)} />
      )}
    </div>
  );
};




