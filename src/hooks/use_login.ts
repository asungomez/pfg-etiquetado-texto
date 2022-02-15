import { useHistory } from 'react-router-dom';

import { useAuthenticationContext } from '../contexts';
import { AuthenticationService } from '../services';

export const useLogin = (redirect: string = '/panel') => {
  const { userHasAuthenticated, setUser } = useAuthenticationContext();
  const history = useHistory();
  const logIn = () => {
    AuthenticationService.getUserAttributes().then((attributes: any) => {
      setUser(attributes);
      userHasAuthenticated(true);
      history.push(redirect || '/panel');
    });
  };
  return logIn;
};
