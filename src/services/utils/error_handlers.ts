type ProcessedError = {
  message: string;
  code?: string;
  handled?: boolean;
};

const commonErrors = (error: any) => {
  const processedError: ProcessedError = {
    message: 'Error interno',
  };
  if (error.code && error.code === 'NetworkError') {
    processedError.message = 'No hay conexión a Internet';
  } else if (
    (error.message && error.message.includes('Token is invalid')) ||
    (error.response &&
      error.response.data &&
      error.response.data.message &&
      error.response.data.message.includes('Token is invalid'))
  ) {
    processedError.message = 'Tu sesión ha expirado';
    processedError.code = 'AuthenticationTokenExpired';
  }
  return processedError;
};

export const createError = (
  message: string,
  code?: string
): ProcessedError => ({
  message,
  code,
  handled: true,
});

export const handleError = (
  error: any,
  type: string,
  handlerMap: { [type: string]: Function }
) => {
  if (process.env.REACT_APP_DEBUG === 'true') {
    console.log(`${type} error: ${error}`);
  }
  if (type in handlerMap) {
    error = handlerMap[type](error);
  }
  return error.handled ? error : commonErrors(error);
};
