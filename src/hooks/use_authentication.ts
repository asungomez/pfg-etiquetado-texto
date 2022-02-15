import { useEffect, useState } from 'react';

import { AuthenticationContextType } from '../contexts';
import { AuthenticationService, User } from '../services';

export const useAuthentication = (): AuthenticationContextType & {
  isAuthenticating: boolean;
} => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    AuthenticationService.checkAuthentication()
      .then(() => {
        AuthenticationService.getUserAttributes().then(authenticatedUser => {
          setUser(authenticatedUser);
          userHasAuthenticated(true);
          setIsAuthenticating(false);
        });
      })
      .catch(() => {
        setIsAuthenticating(false);
      });
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    userHasAuthenticated,
    user,
    setUser,
    isAuthenticating,
  };
};
