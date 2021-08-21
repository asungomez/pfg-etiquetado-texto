import { createError, handleError } from '../utils';

const resendConfirmationMessage = (error: any) => {
  if (error.response?.status === 429) {
    return createError(
      'Demasiados intentos, por favor prueba de nuevo en 2 horas'
    );
  }
  return error;
};

const signUp = (error: any) => {
  if (
    error.message?.includes('already registered') ||
    error.message?.includes('already exists')
  ) {
    return createError('La dirección de email ya se encuentra registrada.');
  }
  if (error.message?.includes('Username should be an email')) {
    return createError('La dirección de email no es válida.');
  }
  if (error.code === 'InvalidParameterException') {
    if (error.message?.includes('password')) {
      return createError('La contraseña no es válida.');
    }
    if (error.message?.includes('email')) {
      return createError('La dirección de email no es válida.');
    }
  }
  return error;
};

const errorMethods = {
  resendConfirmationMessage,
  signUp,
};

const ERROR_TYPES = Object.keys(errorMethods);
type ErrorType = typeof ERROR_TYPES[number];

export const errorHandler = (type: ErrorType, error: any) =>
  handleError(error, type, errorMethods);
