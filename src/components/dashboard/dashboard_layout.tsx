import { EuiLink } from '@elastic/eui';

import { useLogout } from '../../hooks';

export const DashboardLayout: React.FC<{}> = () => {
  const logOut = useLogout();
  return (
    <EuiLink onClick={logOut} data-testid="log-out-button">
      Log out
    </EuiLink>
  );
};
