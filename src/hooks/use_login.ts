import { useHistory } from 'react-router-dom';

export const useLogin = (redirect: string = '/panel') => {
  const history = useHistory();
  return () => history.push(redirect);
};
