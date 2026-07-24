import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AttendanceRecord } from '../types';
import { extractTextFromPdf } from '../utils/pdfText';
import { parseAttendanceText } from '../utils/parseAttendance';

interface PdfUploaderProps {
  onDataParsed: (data: {
    studentName: string;
    courseName: string;
    period: string;
    cohort: string;
    records: AttendanceRecord[];
  }) => void;
  onLoadSample: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({
  onDataParsed,
  onLoadSample,
  isLoading,
  setIsLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LIKELION_ATTENDANCE_URL = 'https://bootcamp.likelion.net/my/courses/detail/kdt-cld-6th/attendance';

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setErrorMsg(null);
    setIsLoading(true);

    const isTextFile = file.type === 'text/plain' || file.name.endsWith('.txt');
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const extractedText = isTextFile
          ? (reader.result as string)
          : await extractTextFromPdf(reader.result as string);

        const parsed = parseAttendanceText(extractedText);

        if (parsed.records.length === 0) {
          throw new Error(
            'PDF에서 출결 내역을 찾을 수 없습니다. 텍스트 레이어가 있는 PDF인지 확인해주세요.'
          );
        }

        onDataParsed(parsed);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(
          err?.message || 'PDF 분석 도중 오류가 발생했습니다. 샘플 데이터로 시작해보세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('파일을 읽는 도중 오류가 발생했습니다.');
      setIsLoading(false);
    };

    if (isTextFile) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Instructions & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#fff7ed] text-[#ff6000] text-xs font-semibold border border-[#ffedd5]">
            <FileText className="w-3.5 h-3.5" />
            <span>멋쟁이사자부트캠프 출결현황 PDF</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            출결 데이터 PDF 업로드
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="flex items-center flex-wrap gap-1">
              <span>멋쟁이사자부트캠프</span>
              <a
                href={LIKELION_ATTENDANCE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-[#ff6000] font-medium hover:underline gap-0.5"
              >
                <span>출결현황 페이지</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span>에서 <strong className="text-gray-800">'출결 데이터 다운로드'</strong>를 통해 PDF를 내려받아 업로드하세요.</span>
            </p>
          </div>
        </div>

        {/* 1-Click Sample Button */}
        <button
          onClick={onLoadSample}
          type="button"
          disabled={isLoading}
          className="btn-pill-primary shrink-0 text-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>샘플 데이터로 미리보기</span>
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            handleFileUpload(files[0]);
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
          isDragOver
            ? 'border-[#ff6000] bg-[#fff7ed]'
            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#ff6000] animate-spin" />
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900">출결 데이터를 분석하는 중...</p>
              <p className="text-xs text-gray-500 mt-1">
                3회 지각/조퇴/외출 = 결석 1회 및 80% 수료 여부를 계산하고 있습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-[#fff7ed] border border-[#ffedd5] flex items-center justify-center text-[#ff6000] mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-gray-900">
              클릭하여 PDF 파일을 선택하거나 이곳으로 드래그하세요
            </p>
            <p className="text-xs text-gray-500 mt-1">
              지원 포맷: PDF (멋쟁이사자부트캠프 출결 다운로드 파일)
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="font-semibold">🔒 보안 안내:</span>
              <span>모든 분석은 브라우저 안에서 처리되며, 파일이 서버로 전송되지 않습니다.</span>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};


