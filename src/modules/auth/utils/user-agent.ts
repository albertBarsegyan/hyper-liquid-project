/**
 * Detects if the current user agent is Linux
 * @returns true if the user agent contains Linux
 */
export const isLinuxUserAgent = (): boolean => {
  if (typeof window === 'undefined' || !navigator.userAgent) {
    return false;
  }
  return /Linux/i.test(navigator.userAgent);
};
