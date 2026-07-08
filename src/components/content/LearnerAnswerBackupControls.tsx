import React from 'react';
import { Icon } from '../Icon';
import {
  createLearnerAnswerBackup,
  importLearnerAnswerBackup,
  parseLearnerAnswerBackup,
  serializeLearnerAnswerBackup,
} from '../../utils/learnerAnswerBackup';

type BackupStatus =
  | {
      tone: 'success' | 'error';
      message: string;
    }
  | null;

export const LearnerAnswerBackupControls: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState<BackupStatus>(null);

  const handleSave = () => {
    const backup = createLearnerAnswerBackup();
    const backupJson = serializeLearnerAnswerBackup(backup);
    const blob = new Blob([backupJson], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = objectUrl;
    anchor.download = getBackupFilename();
    anchor.rel = 'noopener';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);

    const answerCount = Object.keys(backup.answers).length;
    setStatus({
      tone: 'success',
      message: `已匯出 ${answerCount} 項答案`,
    });
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const fileContent = await file.text();
      const backup = parseLearnerAnswerBackup(fileContent);
      const result = importLearnerAnswerBackup(backup);

      setStatus({
        tone: 'success',
        message: `已載入 ${result.importedCount} 項答案`,
      });
    } catch (error) {
      setStatus({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : '無法載入此答案備份檔案。',
      });
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          aria-label="匯出初信栽培答案"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(40,53,28,0.14)] transition active:scale-95"
        >
          <Icon name="download" className="text-[17px]" />
          <span className="hidden min-[390px]:inline">Save</span>
        </button>
        <button
          type="button"
          onClick={handleLoadClick}
          aria-label="載入初信栽培答案"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-lowest px-3 text-xs font-bold text-primary transition active:scale-95"
        >
          <Icon name="upload" className="text-[17px]" />
          <span className="hidden min-[390px]:inline">Load</span>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="載入初信栽培答案備份"
      />
      {status ? (
        <p
          role="status"
          className={`max-w-[11rem] text-right text-[10px] font-bold leading-4 ${
            status.tone === 'success' ? 'text-primary' : 'text-error'
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
};

function getBackupFilename(): string {
  const exportedDate = new Date().toISOString().slice(0, 10);
  return `ifu-learner-answers-${exportedDate}.json`;
}
