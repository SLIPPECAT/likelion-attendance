import { AttendanceRecord, AttendanceSummary, CardStats } from '../types';

export function calculateAttendance(
  studentName: string,
  courseName: string,
  period: string,
  cohort: string,
  records: AttendanceRecord[]
): AttendanceSummary {
  const totalDays = records.length;

  let pureAttendanceDays = 0;
  let pureAbsenceDays = 0;
  let lateCount = 0;
  let earlyLeaveCount = 0;
  let outingCount = 0;
  let lateAndOutingCount = 0;

  records.forEach((r) => {
    const status = r.status.trim();
    if (status === '출석') {
      pureAttendanceDays++;
    } else if (status === '결석') {
      pureAbsenceDays++;
    } else if (status === '지각') {
      lateCount++;
    } else if (status === '조퇴') {
      earlyLeaveCount++;
    } else if (status === '외출') {
      outingCount++;
    } else if (status === '지각&외출' || status === '지각 및 외출') {
      lateAndOutingCount++;
    } else if (status === '공가/휴가' || status === '공가') {
      // Recognized attendance or official leave
      pureAttendanceDays++;
    } else {
      // Default fallback
      pureAttendanceDays++;
    }
  });

  // Calculate total partial absences (지각, 조퇴, 외출 events)
  // "지각&외출" counts as 2 events (지각 1회 + 외출 1회)
  const totalPartialAbsences =
    lateCount + earlyLeaveCount + outingCount + lateAndOutingCount * 2;

  // Rule: 3 partial absences convert to 1 converted absence day
  const convertedAbsenceDays = Math.floor(totalPartialAbsences / 3);
  const remainingPartialAbsences = totalPartialAbsences % 3;

  // Final total effective absences
  const totalEffectiveAbsences = pureAbsenceDays + convertedAbsenceDays;

  // Effective attendance days = Total days - Final effective absences
  const effectiveAttendanceDays = Math.max(0, totalDays - totalEffectiveAbsences);

  // Final attendance rate %
  const rawRate = totalDays > 0 ? (effectiveAttendanceDays / totalDays) * 100 : 0;
  const attendanceRate = Math.round(rawRate * 10) / 10; // Round to 1 decimal place

  // Completion condition: Attendance rate >= 80%
  const isPassed = attendanceRate >= 80.0;

  // Required minimum attendance days for 80%
  const requiredAttendanceDays = Math.ceil(totalDays * 0.8);

  // Max allowed absences to maintain 80%
  const maxAllowedAbsences = Math.floor(totalDays * 0.2);
  const marginAbsenceDays = Math.max(0, maxAllowedAbsences - totalEffectiveAbsences);

  return {
    studentName: studentName || '수강생',
    courseName: courseName || 'AWS DevOps 엔지니어 과정',
    period: period || '2026.03.25 ~ 2026.07.22',
    cohort: cohort || '1회차',
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
  };
}

export function calculateFifaStats(
  summary: AttendanceSummary,
  boostOvr = 0
): CardStats {
  const {
    attendanceRate,
    isPassed,
    totalPartialAbsences,
    totalEffectiveAbsences,
    effectiveAttendanceDays,
    totalDays,
  } = summary;

  // 1. ATT (Attendance Rate / 출석률)
  const att = Math.min(99, Math.max(40, Math.round(attendanceRate)));

  // 2. PNC (Punctuality / 지각·조퇴 관리력)
  // Deduct 4.5 pts per partial absence event
  const pnc = Math.min(
    99,
    Math.max(40, Math.round(100 - totalPartialAbsences * 4.5))
  );

  // 3. PAS (Pass Safety / 수료 안전성)
  let pas = 50;
  if (isPassed) {
    pas = Math.min(99, Math.round(82 + (attendanceRate - 80) * 0.9));
  } else {
    pas = Math.max(40, Math.round(attendanceRate * 0.9));
  }

  // 4. END (Endurance / 과정 완주력)
  const end = Math.min(
    99,
    Math.max(40, Math.round((effectiveAttendanceDays / Math.max(1, totalDays)) * 100))
  );

  // 5. FOC (Focus / 결석 방어력)
  const foc = Math.min(
    99,
    Math.max(40, Math.round(100 - totalEffectiveAbsences * 5))
  );

  // 6. REL (Reliability / 종합 성실 신뢰도)
  const rel = Math.min(
    99,
    Math.max(40, Math.round(att * 0.35 + pnc * 0.25 + pas * 0.2 + foc * 0.2))
  );

  // Base OVR calculation
  let baseOvr = Math.round(att * 0.4 + pnc * 0.2 + pas * 0.2 + rel * 0.2);

  // Apply manual fine-tuning boost
  let ovr = Math.min(99, Math.max(40, baseOvr + boostOvr));

  // Determine Tier Name
  let tier = 'GOLD RARE';
  if (ovr >= 95 || attendanceRate >= 95) {
    tier = 'ICON';
  } else if (ovr >= 88 || attendanceRate >= 88) {
    tier = 'WORLD CLASS';
  } else if (ovr >= 80 || isPassed) {
    tier = 'GOLD RARE';
  } else if (ovr >= 70) {
    tier = 'SILVER';
  } else {
    tier = 'RED WARNING';
  }

  return {
    att,
    pnc,
    pas,
    end,
    foc,
    rel,
    ovr,
    tier,
  };
}
