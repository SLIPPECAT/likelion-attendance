import React, { useRef, useState } from 'react';
import { toBlob } from 'html-to-image';
import { X, Download, Share2, Loader2 } from 'lucide-react';
import { AttendanceSummary } from '../types';
import { maskName } from '../utils/mask';
import { getGradeInfo } from './AttendanceSummary';

interface ShareCardModalProps {
  summary: AttendanceSummary;
  onClose: () => void;
}

const FILE_NAME = '멋쟁이사자부트캠프_출결카드.png';

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ summary, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    courseName,
    period,
    cohort,
    totalDays,
    pureAttendanceDays,
    totalPartialAbsences,
    attendanceRate,
    isPassed,
  } = summary;

  const maskedName = maskName(summary.studentName);
  const grade = getGradeInfo(attendanceRate);

  const generateBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    return toBlob(cardRef.current, { pixelRatio: 3, backgroundColor: '#121212' });
  };

  const handleDownload = async () => {
    setErrorMsg(null);
    setIsBusy(true);
    try {
      const blob = await generateBlob();
      if (!blob) throw new Error('이미지를 생성하지 못했습니다.');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = FILE_NAME;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMsg(err?.message || '이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsBusy(false);
    }
  };

  const canNativeShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function';

  const handleShare = async () => {
    setErrorMsg(null);
    setIsBusy(true);
    try {
      const blob = await generateBlob();
      if (!blob) throw new Error('이미지를 생성하지 못했습니다.');
      const file = new File([blob], FILE_NAME, { type: 'image/png' });

      if (canNativeShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '멋쟁이사자부트캠프 출결 카드',
          text: `${maskedName}님의 출결 등급: ${grade.grade}등급 (${attendanceRate}%)`,
        });
      } else {
        await handleDownload();
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setErrorMsg(err?.message || '공유 중 오류가 발생했습니다.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-hairline rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-xl">출결 카드 공유</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--color-muted)] -mt-3">
          이름은 <strong className="text-[var(--color-foreground)]">{maskedName}</strong> 처럼 일부만 표시돼요. 이미지는 브라우저 안에서만 생성되며 어디로도 전송되지 않습니다.
        </p>

        {/* Capturable Card — uses DESIGN.md's dark-mode token values directly,
            since this is always a dark "card" regardless of the app's own theme. */}
        <div className="flex justify-center overflow-hidden rounded-2xl">
          <div
            ref={cardRef}
            className="w-[340px] shrink-0 rounded-2xl p-7 relative overflow-hidden"
            style={{ backgroundColor: '#121212', color: '#f2f2f2' }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--color-accent)]/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)] flex items-center justify-center font-black text-sm text-white">
                    사
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">멋쟁이사자부트캠프</div>
                    <div className="text-[10px] leading-tight" style={{ color: '#9c9c9c' }}>
                      출결 분석기
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-mono" style={{ color: '#9c9c9c' }}>
                  {cohort}
                </div>
              </div>

              {/* Name & course */}
              <div>
                <div className="text-2xl font-extrabold">
                  {maskedName}{' '}
                  <span className="text-sm font-normal" style={{ color: '#b0b0b0' }}>
                    수강생
                  </span>
                </div>
                <div className="text-xs mt-1 line-clamp-2" style={{ color: '#b0b0b0' }}>
                  {courseName}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: '#9c9c9c' }}>
                  {period}
                </div>
              </div>

              {/* Grade Circle */}
              <div className="flex flex-col items-center py-4">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl font-black ${grade.activeColor}`}
                >
                  {grade.grade}
                </div>
                <div className="mt-3 text-base font-bold">
                  {grade.title} ({grade.grade}등급)
                </div>
                <div className="text-4xl font-black mt-2">{attendanceRate}%</div>
                <div
                  className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold ${
                    isPassed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  {isPassed ? '수료 충족 PASS' : '수료 미달 FAIL'}
                </div>
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-3 gap-2 text-center pt-5" style={{ borderTop: '1px solid #2e2e2e' }}>
                <div>
                  <div className="text-lg font-bold">{totalDays}일</div>
                  <div className="text-[10px]" style={{ color: '#9c9c9c' }}>총 교육일</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-400">{pureAttendanceDays}일</div>
                  <div className="text-[10px]" style={{ color: '#9c9c9c' }}>순수 출석</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#ff7a33' }}>
                    {totalPartialAbsences}회
                  </div>
                  <div className="text-[10px]" style={{ color: '#9c9c9c' }}>지각·조퇴·외출</div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="text-center text-[10px] pt-3"
                style={{ color: '#9c9c9c', borderTop: '1px solid #2e2e2e' }}
              >
                나도 출결 계산해보기 → 멋쟁이사자부트캠프 출결 분석기
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isBusy}
            className="btn-pill flex-1 text-sm disabled:opacity-50"
          >
            {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            이미지 저장
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={isBusy}
            className="flex-1 flex items-center justify-center gap-1.5 btn-pill-primary text-sm disabled:opacity-50"
          >
            {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
};
