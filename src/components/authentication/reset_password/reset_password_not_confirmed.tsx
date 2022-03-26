import {
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { useState } from 'react';

import { AuthenticationService } from '../../../services';

export type ResetPasswordNotConfirmedProps = {
  email: string;
  'data-testid'?: string;
};

export const ResetPasswordNotConfirmed: React.FC<ResetPasswordNotConfirmedProps> =
  ({ email, 'data-testid': testId }) => {
    const [status, setStatus] = useState<
      'default' | 'loading' | 'error' | 'success'
    >('default');

    const resendConfirmationEmail = () => {
      setStatus('loading');
      AuthenticationService.resendConfirmationMessage(email)
        .then(() => {
          setStatus('success');
        })
        .catch(() => {
          setStatus('error');
        });
    };

    if (status === 'default' || status === 'loading') {
      return (
        <EuiCallOut
          title="Esta cuenta no está confirmada"
          color="danger"
          data-testid={testId}
        >
          <EuiText>
            Haz click en el enlace de confirmación que te enviamos por correo
            electrónico. Si no lo has recibido, podemos enviártelo otra vez.
          </EuiText>
          <EuiSpacer />
          <EuiFlexGroup direction="row" justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButton
                iconType="refresh"
                onClick={resendConfirmationEmail}
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
    }
    if (status === 'success') {
      return (
        <EuiCallOut
          title="Mensaje enviado con éxito, consulta tu bandeja de entrada"
          color="success"
          iconType="check"
        />
      );
    }
    return (
      <EuiCallOut
        title="No hemos podido enviarte el mensaje"
        color="danger"
        iconType="envelope"
      >
        Comprueba que tu dirección de correo electrónico es correcta.
      </EuiCallOut>
    );
  };
