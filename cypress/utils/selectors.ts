const commonSelectors = {
  fieldErrorMessage: '.euiFormErrorText',
  formErrorMessage: '.euiForm__errors',
  spinner: '.euiLoadingSpinner',
};

export const selectors = {
  signUp: {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    submitButton: '[data-testid="submit-button"]',
    fieldErrorMessage: commonSelectors.fieldErrorMessage,
  },
  logIn: {
    actionButton: '[data-testid="action-button"]',
  },
};
