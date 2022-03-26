import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { Formik } from 'formik';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { AuthenticationService } from '../../../services';
import { Link } from '../..';
import {
  ResetPasswordError,
  ResetPasswordErrorProps,
} from './reset_password_error';

export type RequestResetPasswordFormValues = {
  email: string;
};

const initialValues: RequestResetPasswordFormValues = {
  email: '',
};

const schema = Yup.object().shape({
  email: Yup.string()
    .required('Introduce tu email')
    .email('No es una dirección de email válida'),
});

export const ResetPassword: React.FC<{}> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ResetPasswordErrorProps>(null);
  const history = useHistory();

  const submitHandler = ({ email }: RequestResetPasswordFormValues) => {
    setLoading(true);
    setError(null);
    AuthenticationService.requestResetPassword(email)
      .then(() => {
        setLoading(false);
        history.push(
          '/iniciar-sesion?message=resetPasswordRequested&email=' + email
        );
      })
      .catch(error => {
        setLoading(false);
        switch (error.code) {
          case 'UserNotFoundException':
            setError({
              type: 'notRegistered',
            });
            break;
          case 'UserNotConfirmedException':
            setError({
              type: 'notConfirmed',
              email,
            });
            break;
          default:
            setError({
              type: 'default',
              message: error.message,
            });
        }
      });
  };

  return (
    <EuiFlexGroup direction="column" alignItems="center" responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiText size="m" textAlign="center">
          <EuiTitle size="m">
            <h2>Restaurar contraseña</h2>
          </EuiTitle>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false} className="reset-password-container">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={submitHandler}
        >
          {({ handleSubmit, errors, touched, values, handleChange }) => (
            <EuiForm component="form" onSubmit={handleSubmit}>
              <EuiText size="s">
                Escribe tu dirección de correo electrónico. Te enviaremos un
                mensaje con instrucciones para restaurar tu contraseña.
              </EuiText>
              <EuiSpacer />
              {!!error && (
                <>
                  <ResetPasswordError {...error} />
                  <EuiSpacer />
                </>
              )}
              <EuiFormRow
                label="Email"
                isInvalid={errors.email && touched.email}
                error={errors.email}
                fullWidth
              >
                <EuiFieldText
                  name="email"
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  icon="email"
                  fullWidth
                  data-testid="email-input"
                />
              </EuiFormRow>
              <EuiSpacer />
              <EuiFlexGroup direction="row">
                <EuiFlexItem>
                  <EuiButton
                    type="submit"
                    color="primary"
                    fill
                    isLoading={loading}
                    fullWidth
                    data-testid="submit-button"
                  >
                    Restaurar contraseña
                  </EuiButton>
                </EuiFlexItem>
                <EuiFlexItem>
                  <Link to="/iniciar-sesion">
                    <EuiButtonEmpty>Cancelar</EuiButtonEmpty>
                  </Link>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiForm>
          )}
        </Formik>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
