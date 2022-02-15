import { useAuthenticationContext } from '../contexts';
import { AuthenticationService } from '../services/authentication';

export const useLogout = () => {
  const { userHasAuthenticated } = useAuthenticationContext();
  const logOut = () => {
    AuthenticationService.logOut()
      .then(() => {
        userHasAuthenticated(false);
      })
      .catch(() => {});
  };
  return logOut;
};
