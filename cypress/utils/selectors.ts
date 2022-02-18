const commonSelectors = {
  fieldErrorMessage: '.euiFormErrorText',
  formErrorMessage: '.euiForm__errors',
  spinner: '.euiLoadingSpinner',
};

export const selectors = {
  header: {
    logOutButton: '[data-testid="log-out-button"]',
  },
  logIn: {
    actionButton: '[data-testid="action-button"]',
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    submitButton: '[data-testid="submit-button"]',
    forgotPasswordButton: '[data-testid="forgot-password-button"]',
    signUpButton: '[data-testid="sign-up-button"]',
    fieldErrorMessage: commonSelectors.fieldErrorMessage,
    formErrorMessage: '[data-testid="error-message"]',
    formInfoMessage: '[data-testid="info-message"]',
    spinner: commonSelectors.spinner,
  },
  signUp: {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    submitButton: '[data-testid="submit-button"]',
    fieldErrorMessage: commonSelectors.fieldErrorMessage,
  },
};
