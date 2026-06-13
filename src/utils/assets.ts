const REPOSITORY_BASE_PATH = '/IFU-app';

export function assetPath(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  const configuredBase = import.meta.env.BASE_URL.replace(/\/$/, '');

  if (configuredBase && configuredBase !== '') {
    return `${configuredBase}/${normalizedPath}`;
  }

  if (
    typeof window !== 'undefined' &&
    (window.location.pathname === REPOSITORY_BASE_PATH ||
      window.location.pathname.startsWith(`${REPOSITORY_BASE_PATH}/`))
  ) {
    return `${REPOSITORY_BASE_PATH}/${normalizedPath}`;
  }

  return `/${normalizedPath}`;
}
