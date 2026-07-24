import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { PdfUploader } from './components/PdfUploader';
import { AttendanceSummaryView } from './components/AttendanceSummary';
import { FutureCompletionForecaster } from './components/FutureCompletionForecaster';
import { calculateAttendance } from './utils/attendanceCalculator';
import {
  SAMPLE_STUDENT_NAME,
  SAMPLE_COURSE_NAME,
  SAMPLE_PERIOD,
  SAMPLE_COHORT,
  SAMPLE_ATTENDANCE_RECORDS,
} from './utils/sampleData';
import { AttendanceRecord } from './types';
import { BarChart2 } from 'lucide-react';

export default function App() {
  const [studentName, setStudentName] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [cohort, setCohort] = useState<string>('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate Attendance Summary
  const summary = useMemo(() => {
    return calculateAttendance(studentName, courseName, period, cohort, records);
  }, [studentName, courseName, period, cohort, records]);

  // Handle PDF / Text Parsed Data
  const handleDataParsed = (data: {
    studentName: string;
    courseName: string;
    period: string;
    cohort: string;
    records: AttendanceRecord[];
  }) => {
    setStudentName(data.studentName || '수강생');
    setCourseName(data.courseName || '교육과정');
    setPeriod(data.period || '');
    setCohort(data.cohort || '1회차');
    setRecords(data.records || []);
  };

  // Load Sample Dataset
  const handleLoadSample = () => {
    setStudentName(SAMPLE_STUDENT_NAME);
    setCourseName(SAMPLE_COURSE_NAME);
    setPeriod(SAMPLE_PERIOD);
    setCohort(SAMPLE_COHORT);
    setRecords(SAMPLE_ATTENDANCE_RECORDS);
  };

  // Reset to Upload Screen
  const handleReset = () => {
    setRecords([]);
    setStudentName('');
    setCourseName('');
    setPeriod('');
    setCohort('');
  };

  const hasData = records.length > 0;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 font-sans selection:bg-[#ff6000] selection:text-white pb-16">
      {/* Navigation Bar */}
      <Navbar
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        hasData={hasData}
        studentName={studentName}
        isPassed={summary.isPassed}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* PDF Uploader Section */}
        <section>
          <PdfUploader
            onDataParsed={handleDataParsed}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </section>

        {/* Main Content Area when records exist */}
        {hasData && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Rule & Summary Statistics Dashboard */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart2 className="w-5 h-5 text-[#ff6000]" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  출결 현황 분석 리포트
                </h2>
              </div>
              <AttendanceSummaryView summary={summary} />
            </section>

            {/* 2. Future Course Completion Forecaster & Simulator */}
            <section>
              <FutureCompletionForecaster summary={summary} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}



