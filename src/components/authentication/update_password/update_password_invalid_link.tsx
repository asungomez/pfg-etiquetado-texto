import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { Link } from '../../common';

export const UpdatePasswordInvalidLink: React.FC = () => (
  <EuiFlexGroup direction="column" alignItems="center" responsive={false}>
    <EuiFlexItem grow={false}>
      <EuiText size="m" textAlign="center">
        <EuiTitle size="m">
          <h2>Enlace inválido</h2>
        </EuiTitle>
      </EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiText>
        El enlace introducido no es válido. No es posible restaurar la
        contraseña.
      </EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={false} style={{ width: '100%' }}>
      <EuiFlexGroup direction="row" alignItems="center">
        <EuiFlexItem>
          <Link to="/recuperar-contrasena">
            <EuiButton fill fullWidth>
              Intentar de nuevo
            </EuiButton>
          </Link>
        </EuiFlexItem>
        <EuiFlexItem>
          <Link to="/">
            <EuiButtonEmpty>Cancelar</EuiButtonEmpty>
          </Link>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  </EuiFlexGroup>
);
