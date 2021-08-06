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
    return Promise.resolve({});
  }
}
