import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import {
  exportAnswersAsJson,
  exportAnswersAsPdf,
  exportAnswersAsWord,
  getUserAnswerCount,
  importAnswersFromJsonString,
} from '../utils/answerBackup';

interface AnswerBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnswerBackupModal: React.FC<AnswerBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [fileToImport, setFileToImport] = useState<File | null>(null);
  const [filePreviewCount, setFilePreviewCount] = useState<number | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setAnswerCount(getUserAnswerCount());
  }, [isOpen]);

  // Listen for answer updates to refresh count
  useEffect(() => {
    const handleAnswersUpdated = () => {
      setAnswerCount(getUserAnswerCount());
    };
    window.addEventListener('ifu-answers-updated', handleAnswersUpdated);
    return () => {
      window.removeEventListener('ifu-answers-updated', handleAnswersUpdated);
    };
  }, []);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setFileToImport(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setFileContent(text);
        const parsed = JSON.parse(text);
        let count = 0;
        if (parsed && typeof parsed === 'object') {
          if (parsed.answers && typeof parsed.answers === 'object') {
            count = Object.keys(parsed.answers).length;
          } else {
            count = Object.keys(parsed).filter(
              (k) => !k.startsWith('ifu:ui-') && !k.startsWith('ifu:content_')
            ).length;
          }
        }
        setFilePreviewCount(count);
      } catch (err) {
        setStatusMessage({
          type: 'error',
          text: '無法解析所選的檔案，請確認該檔案為由此 App 匯出的 JSON 備份檔。',
        });
        setFileToImport(null);
        setFileContent(null);
        setFilePreviewCount(null);
      }
    };
    reader.readAsText(file);
    // Reset input value so re-uploading the same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExecuteImport = () => {
    if (!fileContent) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const result = importAnswersFromJsonString(fileContent);
      setStatusMessage({
        type: 'success',
        text: `成功載入並還原 ${result.count} 筆作答紀錄！所有畫面已即時同步更新。`,
      });
      setFileToImport(null);
      setFileContent(null);
      setFilePreviewCount(null);
      setAnswerCount(getUserAnswerCount());
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || '載入失敗，請確認檔案格式正確。',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-surface-container-highest shadow-2xl border border-outline-variant/40 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/40 px-6 py-4 bg-surface-container">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
              <Icon name="cloud_sync" className="text-[24px]" />
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">
                初信栽培作答備份與載入
              </h2>
              <p className="text-xs text-on-surface-variant">
                目前瀏覽器中已記錄{' '}
                <span className="font-bold text-secondary">{answerCount}</span> 題作答
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition cursor-pointer"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/30 px-6 pt-3 bg-surface-container-low/40">
          <button
            onClick={() => {
              setActiveTab('export');
              setStatusMessage(null);
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="download" className="text-[18px]" />
            儲存 / 匯出 (Save)
          </button>
          <button
            onClick={() => {
              setActiveTab('import');
              setStatusMessage(null);
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon name="upload" className="text-[18px]" />
            載入 / 還原 (Load)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-none">
          {statusMessage && (
            <div
              className={`flex items-start gap-3 rounded-2xl p-4 text-sm font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <Icon
                name={statusMessage.type === 'success' ? 'check_circle' : 'error'}
                className="text-[20px] shrink-0 mt-0.5"
              />
              <div className="flex-1">{statusMessage.text}</div>
            </div>
          )}

          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-on-surface-variant">
                將您在各栽培單元輸入的筆記與問答快取轉為檔案下載，包含全課程經文、題目與回答：
              </p>

              {/* PDF Export Card */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 transition-all hover:border-secondary/50 hover:bg-surface-container">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-700">
                    <Icon name="picture_as_pdf" className="text-[20px]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">
                      PDF 完整學習手冊 (.pdf)
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      包含全部 12 課經文、題目與您的作答紀錄，排版精美，適合閱讀、列印與另存為 PDF。
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    exportAnswersAsPdf();
                    setStatusMessage({
                      type: 'success',
                      text: '已開啟 PDF 學習手冊預覽！您可直接在列印視窗中點選「另存為 PDF」或列印。',
                    });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95 cursor-pointer shrink-0"
                >
                  <Icon name="print" className="text-[16px]" />
                  匯出 / 列印 PDF
                </button>
              </div>

              {/* Word Document Export Card */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 transition-all hover:border-secondary/50 hover:bg-surface-container">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700">
                    <Icon name="article" className="text-[20px]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">
                      Word 文件 (.doc)
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      完整排版的 Word 格式，包含所有經文、題目與答案，支援 Microsoft Word、Google 文件編輯與列印。
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    exportAnswersAsWord();
                    setStatusMessage({
                      type: 'success',
                      text: '已下載 Word 學習手冊！',
                    });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b579a] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95 cursor-pointer shrink-0"
                >
                  <Icon name="download" className="text-[16px]" />
                  下載 Word
                </button>
              </div>

              {/* JSON Export Card */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 transition-all hover:border-secondary/50 hover:bg-surface-container">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name="data_object" className="text-[20px]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">
                      JSON 完整備份檔 (.json)
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      標準備份格式，可用於隨時還原所有問答答案至任何裝置或瀏覽器。
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    exportAnswersAsJson();
                    setStatusMessage({
                      type: 'success',
                      text: '已下載 JSON 備份檔案！',
                    });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-on-primary shadow-sm transition hover:brightness-110 active:scale-95 cursor-pointer shrink-0"
                >
                  <Icon name="download" className="text-[16px]" />
                  下載 JSON
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-on-surface-variant">
                上傳先前下載的 <span className="font-bold text-primary">.json</span> 備份檔案，即可將作答紀錄還原至此瀏覽器：
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />

              {!fileToImport ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant/80 bg-surface-container-low/50 p-8 text-center transition hover:border-secondary hover:bg-surface-container active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                    <Icon name="cloud_upload" className="text-[28px]" />
                  </div>
                  <div>
                    <span className="font-bold text-primary text-sm">
                      點擊選擇 .json 備份檔案
                    </span>
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      支援先前由此 App 匯出的 JSON 檔案
                    </span>
                  </div>
                </button>
              ) : (
                <div className="space-y-3 rounded-2xl border border-secondary/40 bg-secondary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name="description" className="text-secondary text-[24px]" />
                      <div>
                        <div className="text-sm font-bold text-on-surface truncate max-w-[240px]">
                          {fileToImport.name}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          檔案大小: {(fileToImport.size / 1024).toFixed(1)} KB
                          {filePreviewCount !== null && ` • 包含 ${filePreviewCount} 題作答`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFileToImport(null);
                        setFileContent(null);
                        setFilePreviewCount(null);
                      }}
                      className="text-xs font-bold text-on-surface-variant hover:text-red-600 transition cursor-pointer"
                    >
                      更換檔案
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleExecuteImport}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Icon name={isProcessing ? 'autorenew' : 'restore'} className={`text-[18px] ${isProcessing ? 'animate-spin' : ''}`} />
                      {isProcessing ? '正在還原...' : '確認載入並還原答案'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-outline-variant/30 px-6 py-4 bg-surface-container-low/30 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
