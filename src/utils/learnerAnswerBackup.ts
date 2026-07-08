export const LEARNER_ANSWER_BACKUP_FORMAT = 'ifu-learner-answers';
export const LEARNER_ANSWER_BACKUP_VERSION = 1;

const LOCAL_STORAGE_ANSWER_PREFIX = 'ifu:';
const RESERVED_LOCAL_STORAGE_KEYS = new Set(['ifu:content_overrides']);

export interface LearnerAnswerBackupFile {
  format: typeof LEARNER_ANSWER_BACKUP_FORMAT;
  version: typeof LEARNER_ANSWER_BACKUP_VERSION;
  exportedAt: string;
  answers: Record<string, string>;
}

export interface LearnerAnswerImportResult {
  importedCount: number;
}

export function isLearnerAnswerKey(key: string): boolean {
  return (
    key.startsWith(LOCAL_STORAGE_ANSWER_PREFIX) &&
    !RESERVED_LOCAL_STORAGE_KEYS.has(key)
  );
}

export function collectLearnerAnswers(
  storage: Storage = window.localStorage,
): Record<string, string> {
  const answers: Record<string, string> = {};

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (!key || !isLearnerAnswerKey(key)) {
      continue;
    }

    const value = storage.getItem(key);

    if (value !== null) {
      answers[key] = value;
    }
  }

  return answers;
}

export function createLearnerAnswerBackup(
  storage: Storage = window.localStorage,
): LearnerAnswerBackupFile {
  return {
    format: LEARNER_ANSWER_BACKUP_FORMAT,
    version: LEARNER_ANSWER_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    answers: collectLearnerAnswers(storage),
  };
}

export function serializeLearnerAnswerBackup(
  backup: LearnerAnswerBackupFile,
): string {
  return `${JSON.stringify(backup, null, 2)}\n`;
}

export function parseLearnerAnswerBackup(rawFileContent: string) {
  const parsed: unknown = JSON.parse(rawFileContent);

  if (!isLearnerAnswerBackupFile(parsed)) {
    throw new Error('此檔案不是有效的初信栽培答案備份。');
  }

  return parsed;
}

export function importLearnerAnswerBackup(
  backup: LearnerAnswerBackupFile,
  storage: Storage = window.localStorage,
): LearnerAnswerImportResult {
  const entries = Object.entries(backup.answers).filter(([key, value]) => {
    return isLearnerAnswerKey(key) && typeof value === 'string';
  });

  entries.forEach(([key, value]) => {
    storage.setItem(key, value);
  });

  window.dispatchEvent(new Event('ifu:learner-answers-imported'));

  return {
    importedCount: entries.length,
  };
}

function isLearnerAnswerBackupFile(
  value: unknown,
): value is LearnerAnswerBackupFile {
  if (!isPlainObject(value)) {
    return false;
  }

  if (
    value.format !== LEARNER_ANSWER_BACKUP_FORMAT ||
    value.version !== LEARNER_ANSWER_BACKUP_VERSION ||
    typeof value.exportedAt !== 'string' ||
    !isPlainObject(value.answers)
  ) {
    return false;
  }

  return Object.entries(value.answers).every(([key, answer]) => {
    return typeof key === 'string' && typeof answer === 'string';
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
