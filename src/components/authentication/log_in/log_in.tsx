import './log_in.scss';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiFieldPassword,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiHorizontalRule,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

import { useLogin } from '../../../hooks/use_login';
import { useQueryParam } from '../../../hooks/use_query_param';
import { AuthenticationService } from '../../../services';
import { Link } from '../../common/link';
import { LogInMessage, LogInMessageType } from './log_in_message';

type LogInFormValues = {
  email: string;
  password: string;
};

const initialValues: LogInFormValues = {
  email: '',
  password: '',
};

const schema = Yup.object().shape({
  password: Yup.string().required('Introduce tu contraseña'),
  email: Yup.string()
    .required('Introduce tu email')
    .email('No es una dirección de email válida'),
});

export const LogIn: React.FC<{}> = () => {
  const [error, setError] = useState<string>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryMessage = useQueryParam('message') as LogInMessageType;
  const queryEmail = useQueryParam('email');
  const [message, setMessage] = useState<LogInMessageType>(queryMessage);
  const [email, setEmail] = useState(queryEmail);
  const logIn = useLogin('/panel');

  const submit = ({ email, password }: LogInFormValues) => {
    setError(null);
    setSubmitting(true);
    setMessage(null);
    setEmail(null);
    AuthenticationService.logIn(email, password)
      .then(() => {
        logIn();
      })
      .catch(error => {
        if (error.code === 'UserNotConfirmedException') {
          setEmail(email);
          setMessage('needsConfirmation');
        } else if (error.code === 'UserNotFoundException') {
          setMessage('notExistent');
        } else {
          setError(error.message);
        }
        setSubmitting(false);
      });
  };

  return (
    <EuiFlexGroup direction="column" alignItems="center" responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiText size="m" textAlign="center">
          <EuiTitle size="m">
            <h2>Iniciar sesión</h2>
          </EuiTitle>
        </EuiText>
      </EuiFlexItem>
      <EuiSpacer size="xs" />
      <EuiFlexItem grow={false} className="log-in-form-container">
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={submit}
        >
          {({ handleSubmit, errors, touched, values, handleChange }) => (
            <EuiForm component="form" onSubmit={handleSubmit}>
              {!!error && (
                <>
                  <EuiCallOut
                    color="danger"
                    title="Ha habido un error"
                    data-testid="error-message"
                  >
                    {error}
                  </EuiCallOut>
                  <EuiSpacer />
                </>
              )}
              {!!message && !error && (
                <>
                  <LogInMessage
                    type={message}
                    email={email}
                    data-testid="info-message"
                  />
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
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  icon="email"
                  fullWidth
                  data-testid="email-input"
                />
              </EuiFormRow>
              <EuiFormRow
                label="Contraseña"
                isInvalid={errors.password && touched.password}
                error={errors.password}
                fullWidth
              >
                <EuiFieldPassword
                  name="password"
                  type="dual"
                  value={values.password}
                  onChange={handleChange}
                  fullWidth
                  data-testid="password-input"
                />
              </EuiFormRow>
              <EuiSpacer size="xl" />
              <EuiFormRow>
                <EuiFlexGroup direction="row">
                  <EuiFlexItem>
                    <EuiButton
                      type="submit"
                      color="primary"
                      fill
                      isLoading={submitting}
                      fullWidth
                      data-testid="submit-button"
                    >
                      Iniciar sesión
                    </EuiButton>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <Link to="/recuperar-contrasena">
                      <EuiButtonEmpty
                        type="submit"
                        color="primary"
                        data-testid="forgot-password-button"
                      >
                        Olvidé mi contraseña
                      </EuiButtonEmpty>
                    </Link>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFormRow>
              <EuiHorizontalRule />
              <EuiText textAlign="center">
                ¿No tienes cuenta aún? <Link to="/registro">Regístrate</Link>
              </EuiText>
            </EuiForm>
          )}
        </Formik>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
