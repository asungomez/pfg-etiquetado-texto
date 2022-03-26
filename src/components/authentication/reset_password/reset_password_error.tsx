import { EuiCallOut } from '@elastic/eui';

import { ResetPasswordNotConfirmed } from './reset_password_not_confirmed';
import { ResetPasswordNotRegistered } from './reset_password_not_registered';

export type ResetPasswordErrorProps = {
  type: 'default' | 'notRegistered' | 'notConfirmed';
  message?: string;
  email?: string;
};

export const ResetPasswordError: React.FC<ResetPasswordErrorProps> = ({
  type,
  message = '',
  email = null,
}) => {
  if (type === 'notConfirmed' && email) {
    return (
      <ResetPasswordNotConfirmed
        email={email}
        data-testid="action-non-confirmed"
      />
    );
  }
  if (type === 'notRegistered') {
    return <ResetPasswordNotRegistered data-testid="action-not-registered" />;
  }
  return (
    <EuiCallOut color="danger" title="Ha habido un error">
      {message}
    </EuiCallOut>
  );
};
