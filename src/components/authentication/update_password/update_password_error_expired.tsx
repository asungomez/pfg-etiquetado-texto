import './update_password_error_expired.scss';

import {
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthenticationService } from '../../../services';

export type UpdatePasswordErrorExpiredProps = {
  email: string;
};

export const UpdatePasswordErrorExpired: React.FC<UpdatePasswordErrorExpiredProps> =
  ({ email }) => {
    const [status, setStatus] = useState<'default' | 'loading' | 'error'>(
      'default'
    );
    const history = useHistory();
    const resend = () => {
      setStatus('loading');
      AuthenticationService.requestResetPassword(email)
        .then(() => {
          history.push(
            '/iniciar-sesion?message=resetPasswordRequested&email=' + email
          );
        })
        .catch(e => {
          setStatus('error');
        });
    };
    return status === 'error' ? (
      <EuiCallOut title="El mensaje no ha podido ser enviado" color="danger">
        Por favor, revisa que el enlace para restaurar la contraseña es
        correcto.
      </EuiCallOut>
    ) : (
      <EuiCallOut
        title="Enlace inválido"
        color="danger"
        iconType="alert"
        className="messageExpiredError"
      >
        <EuiText>
          El enlace de restauración de contraseña ha caducado. Para volver a
          intentarlo, podemos enviarte un enlace nuevo a tu correo electrónico.
        </EuiText>
        <EuiSpacer />
        <EuiFlexGroup direction="row" justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            <EuiButton
              iconType="refresh"
              onClick={resend}
              isLoading={status === 'loading'}
              color="danger"
              data-testid="action-button"
            >
              Enviar de nuevo
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiCallOut>
    );
  };
