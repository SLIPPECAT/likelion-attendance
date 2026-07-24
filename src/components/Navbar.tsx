import React from 'react';
import { RefreshCw, Sparkles, Calculator, Check, AlertCircle } from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  onReset: () => void;
  hasData: boolean;
  studentName?: string;
  isPassed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadSample,
  onReset,
  hasData,
  studentName,
  isPassed,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 text-gray-900 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#fff7ed] border border-[#ffedd5] flex items-center justify-center text-[#ff6000]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-gray-900">
                멋쟁이사자부트캠프 출결 분석기
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-[#fff7ed] text-[#ff6000] border border-[#ffedd5] rounded-full">
                80% 수료 계산기
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden md:block">
              멋쟁이사자부트캠프 출결 PDF 분석 · 3회 지각/조퇴/외출 = 결석 1회 · 수료 가능 여부 산출
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasData && studentName && (
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs">
              <span className="text-gray-500">수강생:</span>
              <span className="font-semibold text-gray-900">{studentName}</span>
              {isPassed !== undefined && (
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${
                    isPassed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {isPassed ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>수료 충족</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      <span>수료 미달</span>
                    </>
                  )}
                </span>
              )}
            </div>
          )}

          <button
            onClick={onLoadSample}
            type="button"
            className="btn-pill-primary text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">샘플 미리보기</span>
            <span className="sm:hidden">샘플</span>
          </button>

          {hasData && (
            <button
              onClick={onReset}
              type="button"
              className="btn-pill text-xs"
              title="초기화"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">초기화</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
