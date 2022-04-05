import {
  EuiButton,
  EuiButtonEmpty,
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

import { usePasswordContext } from '../../../contexts';
import { useQueryParam } from '../../../hooks/use_query_param';
import { AuthenticationService } from '../../../services';
import { Link, PasswordField } from '../..';
import {
  UpdatePasswordError,
  UpdatePasswordErrorProps,
} from './update_password_error';
import { UpdatePasswordInvalidLink } from './update_password_invalid_link';

type UpdatePasswordFormValues = {
  password: string;
};

const initialValues: UpdatePasswordFormValues = {
  password: '',
};

export const UpdatePassword: React.FC = () => {
  const [error, setError] = useState<UpdatePasswordErrorProps>(null);
  const [loading, setLoading] = useState(false);

  const { policy } = usePasswordContext();
  const email = useQueryParam('email');
  const code = useQueryParam('code');
  const history = useHistory();

  if (!email || !code) {
    return <UpdatePasswordInvalidLink />;
  }

  let passwordPolicy = Yup.string().required('Introduce tu contraseña');

  for (const requirement of policy) {
    passwordPolicy = passwordPolicy.matches(
      requirement.rule,
      requirement.error
    );
  }

  const schema = Yup.object().shape({
    password: passwordPolicy,
  });

  const submitHandler = ({ password }: UpdatePasswordFormValues) => {
    setLoading(true);
    setError(null);
    AuthenticationService.resetPassword(email, password, code)
      .then(() => {
        setLoading(false);
        history.push('/iniciar-sesion?message=resetPasswordSucceeded');
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'ExpiredCodeException') {
          setError({ type: 'codeExpired', email });
        } else if (error.code === 'LimitExceededException') {
          setError({ type: 'limitExceeded' });
        } else {
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
              {!!error && (
                <>
                  <UpdatePasswordError {...error} />
                  <EuiSpacer />
                </>
              )}
              <EuiText size="s">Introduce tu nueva contraseña</EuiText>
              <EuiSpacer />
              <EuiFormRow
                label="Contraseña"
                isInvalid={errors.password && touched.password}
                error={errors.password}
                fullWidth
              >
                <PasswordField
                  value={values.password}
                  onChange={handleChange}
                  displayRestrictions={!loading}
                  data-testid="password-input"
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
