import { createError, handleError } from '../utils/error_handlers';

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
  signUp,
};

export const errorHandler = (type: string, error: any) =>
  handleError(error, type, errorMethods);
