import './dashboard_layout_header.scss';

import {
  EuiButtonEmpty,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
} from '@elastic/eui';

import { ReactComponent as Logo } from '../../../assets/images/logo_uned.svg';
import { useLogout } from '../../../hooks';
import { Link } from '../../common';

export const Header: React.FC = () => {
  const logOut = useLogout();
  return (
    <EuiHeader theme="dark">
      <EuiHeaderSection>
        <EuiHeaderSectionItem border="left">
          <Link to="/panel">
            <Logo className="dashboardLayout__header__logo" />
          </Link>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      <EuiHeaderSection>
        <EuiHeaderSectionItem border="right">
          <EuiButtonEmpty
            iconType="exit"
            color="ghost"
            onClick={logOut}
            data-testid="log-out-button"
          >
            Cerrar sesión
          </EuiButtonEmpty>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
    </EuiHeader>
  );
};
