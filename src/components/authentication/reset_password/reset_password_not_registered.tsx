import {
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { useHistory } from 'react-router-dom';

export type ResetPasswordNotRegisteredProps = {
  'data-testid'?: string;
};

export const ResetPasswordNotRegistered: React.FC<ResetPasswordNotRegisteredProps> =
  ({ 'data-testid': testId }) => {
    const history = useHistory();
    return (
      <EuiCallOut
        color="danger"
        title="No existe la cuenta"
        data-testid={testId}
      >
        <EuiText>
          La dirección de email proporcionada no se corresponde con ninguna
          cuenta registrada.
        </EuiText>
        <EuiSpacer />
        <EuiFlexGroup direction="row" justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            <EuiButton
              iconType="user"
              onClick={() => history.push('/registro')}
              color="danger"
              data-testid="action-button"
            >
              Crear una cuenta
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiCallOut>
    );
  };
