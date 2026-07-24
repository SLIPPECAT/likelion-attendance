export type AttendanceStatus =
  | '출석'
  | '결석'
  | '지각'
  | '조퇴'
  | '외출'
  | '지각&외출'
  | '공가/휴가';

export interface AttendanceRecord {
  id: string;
  date: string; // e.g. "3월 25일" or "2026-03-25"
  month?: string; // e.g. "2026년 3월"
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceSummary {
  studentName: string;
  courseName: string;
  period: string;
  cohort: string;
  totalDays: number; // 총 교육일수
  pureAttendanceDays: number; // 순수 출석일수
  pureAbsenceDays: number; // 순수 결석일수
  lateCount: number; // 지각 건수
  earlyLeaveCount: number; // 조퇴 건수
  outingCount: number; // 외출 건수
  lateAndOutingCount: number; // 지각&외출 건수
  totalPartialAbsences: number; // 지각 + 조퇴 + 외출 총 합계 건수
  convertedAbsenceDays: number; // 3회당 결석 1회 차감 (Math.floor(totalPartialAbsences / 3))
  remainingPartialAbsences: number; // 결석 1회 변환 후 남은 건수 (totalPartialAbsences % 3)
  totalEffectiveAbsences: number; // 최종 결석일수 = pureAbsenceDays + convertedAbsenceDays
  effectiveAttendanceDays: number; // 최종 인정 출석일수 = pureAttendanceDays - convertedAbsenceDays
  attendanceRate: number; // 최종 인정 출석률 (%)
  isPassed: boolean; // attendanceRate >= 80% (수료 기준 충족 여부)
  requiredAttendanceDays: number; // 80% 수료 기준 최소 필요 출석일수
  marginAbsenceDays: number; // 수료 유지를 위한 최대 추가 허용 결석일수
}

export type CardTheme =
  | 'toty'
  | 'fut-icon'
  | 'gold-rare'
  | 'diamond'
  | 'hero-fire'
  | 'silver';

export interface CardStats {
  att: number; // Attendance Rate (출석률)
  pnc: number; // Punctuality (개근·지각관리)
  pas: number; // Pass Rating (수료 여부 및 안전성)
  end: number; // Endurance (교육 완주력)
  foc: number; // Focus (결석 관리)
  rel: number; // Reliability (종합 신뢰도)
  ovr: number; // Overall Rating (40 ~ 99)
  tier: string; // 'ICON' | 'WORLD CLASS' | 'GOLD RARE' | 'GOLD' | 'SILVER' | 'WARNING'
}

export interface CardCustomization {
  playerPhoto: string;
  nickname: string;
  position: string; // e.g. DEVOPS, DEV, FE, BE, FULLSTACK, DATA, ST, CM
  theme: CardTheme;
  flag: string; // Flag emoji or URL
  clubName: string; // Academy or Course nickname
  clubLogo: string; // Logo image
  chemistryStyle: string; // e.g. "개근왕", "막판뒤집기", "칼퇴마스터", "수료보증수표"
  chemistryStars: number; // 1 | 2 | 3
  boostOvr: number; // Manual OVR modifier (-5 to +5)
}
