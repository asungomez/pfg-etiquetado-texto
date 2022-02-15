import { EuiLink } from '@elastic/eui';

import { useLogout } from '../../hooks';

export const DashboardLayout: React.FC<{}> = () => {
  const logOut = useLogout();
  return <EuiLink onClick={logOut}>Log out</EuiLink>;
};
