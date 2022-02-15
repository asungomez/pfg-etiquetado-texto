import { createContext, useContext } from 'react';

import { User } from '../services/authentication';

export type AuthenticationContextType = {
  isAuthenticated: boolean;
  userHasAuthenticated: (auth: boolean) => void;
  user: User;
  setUser: (user: User) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextType>({
  isAuthenticated: false,
  userHasAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};
