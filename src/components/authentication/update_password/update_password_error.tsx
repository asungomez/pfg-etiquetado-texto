import './update_password_error.scss';

import { EuiCallOut } from '@elastic/eui';

import { UpdatePasswordErrorExpired } from './update_password_error_expired';

export type UpdatePasswordErrorProps = {
  type: 'default' | 'codeExpired' | 'limitExceeded';
  message?: string;
  email?: string;
};

export const UpdatePasswordError: React.FC<UpdatePasswordErrorProps> = ({
  type,
  message,
  email,
}) =>
  type === 'codeExpired' && !!email ? (
    <UpdatePasswordErrorExpired email={email} />
  ) : type === 'limitExceeded' ? (
    <EuiCallOut
      color="danger"
      title="Límite de reintentos alcanzado"
      className="errorBox"
    >
      Has alcanzado el límite permitido de reintentos. Vuelve a probar en 2
      horas.
    </EuiCallOut>
  ) : (
    <EuiCallOut color="danger" title="Ha habido un error" className="errorBox">
      {message}
    </EuiCallOut>
  );
