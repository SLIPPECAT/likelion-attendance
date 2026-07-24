import { AttendanceRecord, AttendanceStatus } from '../types';

export interface ParsedAttendance {
  studentName: string;
  courseName: string;
  period: string;
  cohort: string;
  records: AttendanceRecord[];
}

// Longest/most specific patterns must come first so "지각&외출" doesn't
// get short-circuited by the plain "지각" or "외출" check.
const STATUS_PATTERNS: [RegExp, AttendanceStatus][] = [
  [/지각\s*(?:&|및|\/)\s*외출/, '지각&외출'],
  [/(?:공가|휴가)/, '공가/휴가'],
  [/결석/, '결석'],
  [/지각/, '지각'],
  [/조퇴/, '조퇴'],
  [/외출/, '외출'],
  [/출석/, '출석'],
];

function extractStudentName(text: string): string | null {
  const match = text.match(/(?:성명|이름|수강생)\s*[:：]?\s*([가-힣]{2,10})/);
  return match ? match[1] : null;
}

function extractCourseName(text: string): string | null {
  const match = text.match(
    /(?:교육\s*과정명|훈련\s*과정명|과정명)\s*[:：]?\s*([^\n]+?)(?=\s*(?:조회\s*기간|실시\s*회차|훈련\s*기관|성명|$))/
  );
  const name = match?.[1]?.trim();
  return name && name.length > 0 ? name : null;
}

function extractPeriod(text: string): string | null {
  const match = text.match(
    /(\d{4}[.\-]\s?\d{1,2}[.\-]\s?\d{1,2})\s*~\s*(\d{4}[.\-]\s?\d{1,2}[.\-]\s?\d{1,2})/
  );
  if (!match) return null;
  const normalize = (d: string) => d.replace(/\s/g, '').replace(/-/g, '.');
  return `${normalize(match[1])} ~ ${normalize(match[2])}`;
}

function extractCohort(text: string): string | null {
  const match = text.match(/(\d+)\s*회\s*차/);
  return match ? `${match[1]}회차` : null;
}

function extractPeriodStartYear(period: string | null): number | null {
  if (!period) return null;
  const match = period.match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

function extractRecords(text: string, periodStartYear: number | null): AttendanceRecord[] {
  const dateRegex = /(\d{1,2})월\s*(\d{1,2})일/g;
  const matches = [...text.matchAll(dateRegex)];

  const records: AttendanceRecord[] = [];
  let year = periodStartYear ?? new Date().getFullYear();
  let prevMonth = 0;

  matches.forEach((m, idx) => {
    const month = parseInt(m[1], 10);
    const day = parseInt(m[2], 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return;

    if (prevMonth && month < prevMonth) year += 1;
    prevMonth = month;

    const segmentStart = (m.index ?? 0) + m[0].length;
    const segmentEnd =
      idx + 1 < matches.length ? matches[idx + 1].index ?? text.length : Math.min(segmentStart + 30, text.length);
    const segment = text.slice(segmentStart, segmentEnd);

    let status: AttendanceStatus | null = null;
    for (const [pattern, label] of STATUS_PATTERNS) {
      if (pattern.test(segment)) {
        status = label;
        break;
      }
    }
    if (!status) return;

    records.push({
      id: `parsed-${idx}-${Date.now()}`,
      date: `${month}월 ${day}일`,
      month: `${year}년 ${month}월`,
      status,
    });
  });

  return records;
}

// Rule-based replacement for the old server-side Gemini extraction.
// Works entirely client-side; only requires the source text to follow the
// "N월 N일 <상태>" layout used by the 멋쟁이사자부트캠프 출결현황 PDF export.
export function parseAttendanceText(text: string): ParsedAttendance {
  const period = extractPeriod(text);
  const records = extractRecords(text, extractPeriodStartYear(period));

  return {
    studentName: extractStudentName(text) || '수강생',
    courseName: extractCourseName(text) || '멋쟁이사자부트캠프',
    period: period || '',
    cohort: extractCohort(text) || '1회차',
    records,
  };
}
