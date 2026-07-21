import { StorageHandler, StoragePayload } from './types';

export class GoogleDrivePermissionError extends Error {
  constructor(message = 'Missing Google Drive appDataFolder permission') {
    super(message);
    this.name = 'GoogleDrivePermissionError';
  }
}

async function findFileId(accessToken: string): Promise<string | null> {
  const query = encodeURIComponent("name = 'ifu_data.json' and 'appDataFolder' in parents");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=appDataFolder&fields=files(id,name)`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    // Check if the response actually indicates insufficient scopes
    const errData = await response.json().catch(() => ({}));
    const hasScopeError = errData.error?.errors?.some(
      (e: any) => e.reason === 'insufficientPermissions'
    );
    if (hasScopeError || response.status === 403) {
      throw new GoogleDrivePermissionError();
    }
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const files = data.files || [];
  return files.length > 0 ? files[0].id : null;
}

export const googleDriveHandler: StorageHandler = {
  async save(userId: string, payload: StoragePayload, accessToken?: string): Promise<void> {
    if (!accessToken) {
      throw new Error('Google OAuth access token is required for Google Drive storage');
    }

    try {
      const fileId = await findFileId(accessToken);
      const isUpdate = !!fileId;

      const boundary = 'ifu_drive_sync_boundary';
      const delimiter = `--${boundary}\r\n`;
      const delimiterWithCRLF = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const metadata = isUpdate
        ? { modifiedTime: new Date().toISOString() }
        : { name: 'ifu_data.json', parents: ['appDataFolder'] };

      const metadataPart =
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata);

      const mediaPart =
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(payload);

      const multipartBody =
        delimiter +
        metadataPart +
        delimiterWithCRLF +
        mediaPart +
        closeDelimiter;

      const uploadUrl = isUpdate
        ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
        : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

      const uploadResponse = await fetch(uploadUrl, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      });

      if (uploadResponse.status === 403) {
        throw new GoogleDrivePermissionError();
      }

      if (!uploadResponse.ok) {
        const errText = await uploadResponse.text();
        throw new Error(`Google Drive upload failed: ${uploadResponse.status} ${errText}`);
      }
    } catch (err) {
      if (err instanceof GoogleDrivePermissionError) {
        throw err;
      }
      console.error('Error saving to Google Drive:', err);
      throw err;
    }
  },

  async load(userId: string, accessToken?: string): Promise<StoragePayload | null> {
    if (!accessToken) {
      throw new Error('Google OAuth access token is required for Google Drive storage');
    }

    try {
      const fileId = await findFileId(accessToken);
      if (!fileId) {
        return null;
      }

      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 403) {
        throw new GoogleDrivePermissionError();
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google Drive download failed: ${response.status} ${errText}`);
      }

      return await response.json();
    } catch (err) {
      if (err instanceof GoogleDrivePermissionError) {
        throw err;
      }
      console.error('Error loading from Google Drive:', err);
      throw err;
    }
  },
};
