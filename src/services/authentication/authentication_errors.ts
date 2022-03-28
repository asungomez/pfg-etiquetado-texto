import { createError, handleError } from '../utils';

const logIn = (error: any) => {
  if (error.code === 'UserNotConfirmedException') {
    return createError(
      'Tu cuenta no está confirmada.',
      'UserNotConfirmedException'
    );
  }
  if (error.code === 'NotAuthorizedException') {
    return createError('Contraseña incorrecta');
  }
  if (error.code === 'UserNotFoundException') {
    return createError(
      'El usuario no se encuentra registrado',
      'UserNotFoundException'
    );
  }
  return error;
};

const requestResetPassword = (error: any) => {
  if (error.code === 'UserNotFoundException') {
    return createError(
      'El usuario no se encuentra registrado',
      'UserNotFoundException'
    );
  } else if (
    error.code === 'InvalidParameterException' &&
    error.message.includes('registered/verified')
  ) {
    return createError('Usuario no confirmado', 'UserNotConfirmedException');
  }
  if (error.code === 'LimitExceededException') {
    return createError(
      'Demasiados intentos, espera 2 horas antes de volver a probar.'
    );
  }
  return error;
};

const resendConfirmationMessage = (error: any) => {
  if (error.response?.status === 429) {
    return createError(
      'Demasiados intentos, por favor prueba de nuevo en 2 horas'
    );
  }
  return error;
};

const resetPassword = (error: any) => {
  if (error.code === 'ExpiredCodeException') {
    return createError('El enlace ha expirado', 'ExpiredCodeException');
  }
  if (error.code === 'LimitExceededException') {
    return createError(
      'Demasiados reintentos. Vuelve a probar en 2h',
      'LimitExceededException'
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
  logIn,
  requestResetPassword,
  resendConfirmationMessage,
  resetPassword,
  signUp,
};

const ERROR_TYPES = Object.keys(errorMethods);
type ErrorType = typeof ERROR_TYPES[number];

export const errorHandler = (type: ErrorType, error: any) =>
  handleError(error, type, errorMethods);
