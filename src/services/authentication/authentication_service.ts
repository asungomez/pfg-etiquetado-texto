import { Auth } from 'aws-amplify';

export class AuthenticationService {
  public static async logIn(email: string, password: string): Promise<any> {
    return Promise.resolve({});
  }

  public static async requestResetPassword(email: string): Promise<void> {
    return Promise.resolve();
  }

  public static async resendConfirmationMessage(email: string): Promise<void> {
    return Promise.resolve();
  }

  public static async signUp(email: string, password: string): Promise<any> {
    try {
      const response = await Auth.signUp(email, password);
      return Promise.resolve(response);
    } catch (e) {
      if (e.code === 'InvalidParameterException') {
        if (e.message.includes('password')) {
          e.message = 'La contraseña no es válida';
        } else if (e.message.includes('email')) {
          e.message = 'La dirección de email no es válida';
        }
      } else if (e.code === 'UsernameExistsException') {
        e.message = 'La dirección de email ya se encuentra registrada';
      } else if (e.code === 'NetworkError') {
        e.message = 'No hay conexión a Internet';
      } else {
        e.message = 'Error interno';
      }
      return Promise.reject(e);
    }
  }
}
