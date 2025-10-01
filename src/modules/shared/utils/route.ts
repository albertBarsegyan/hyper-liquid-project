export const innerRoutePath = {
  getMain: () => '/',
  getPricing: () => '/pricing',
  getVerification: () => '/verification',
  getStartPage: () => '/start-journey',
  getDashboard: () => '/dashboard',
  getAdditionalInfo: () => '/additional-info',
  getProfileSettings: () => '/profile-settings',
  getForgetPassword: () => '/forget-password',
  getPasswordReset: (hash: string) => `/password-reset/${hash}`,
  getAll: () => '*',
};
