import './not_found.scss';

import {
  EuiButton,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

import { ReactComponent as Image } from '../../assets/images/not-found.svg';
import { Link } from './link';

export const NotFound: React.FC<{}> = () => (
  <EuiFlexGroup
    direction="column"
    justifyContent="center"
    className="notFoundPage"
  >
    <EuiFlexItem>
      <EuiEmptyPrompt
        title={<h1>Página no encontrada</h1>}
        icon={<Image />}
        actions={
          <Link to="/">
            <EuiButton fill>Volver</EuiButton>
          </Link>
        }
      />
    </EuiFlexItem>
  </EuiFlexGroup>
);
