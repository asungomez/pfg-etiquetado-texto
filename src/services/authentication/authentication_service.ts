import { CognitoUserSession, ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';

import { User } from '.';
import { errorHandler } from './authentication_errors';
import { mapCognitoAttributes } from './authentication_mappings';

export class AuthenticationService {
  public static async checkAuthentication(): Promise<CognitoUserSession> {
    try {
      const response = await Auth.currentSession();
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(errorHandler('checkAuthentication', e));
    }
  }

  public static async getUserAttributes(): Promise<User> {
    try {
      const info = await Auth.currentUserInfo();
      return Promise.resolve(mapCognitoAttributes(info.attributes));
    } catch (e) {
      return Promise.reject(errorHandler('getUserAttributes', e));
    }
  }

  public static async logIn(email: string, password: string): Promise<any> {
    try {
      const user = await Auth.signIn(email, password);
      return user;
    } catch (e) {
      return Promise.reject(errorHandler('logIn', e));
    }
  }

  public static async logOut(): Promise<any> {
    try {
      const response = await Auth.signOut();
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(errorHandler('logOut', e));
    }
  }

  public static async requestResetPassword(email: string): Promise<void> {
    try {
      await Auth.forgotPassword(email);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(errorHandler('requestResetPassword', e));
    }
  }

  public static async resendConfirmationMessage(email: string): Promise<void> {
    try {
      const response = await Auth.resendSignUp(email);
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(errorHandler('resendConfirmationMessage', e));
    }
  }

  public static async signUp(
    email: string,
    password: string
  ): Promise<ISignUpResult> {
    try {
      const response = await Auth.signUp(email, password);
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(errorHandler('signUp', e));
    }
  }
}
