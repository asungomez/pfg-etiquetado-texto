import {
  EuiButton,
  EuiCallOut,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiLink,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Link, PasswordField } from '../../../components';
import { usePasswordContext } from '../../../contexts';
import { AuthenticationService } from '../../../services';

type SignUpFormValues = {
  email: string;
  password: string;
};

const initialValues: SignUpFormValues = {
  email: '',
  password: '',
};

export const SignUp: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>(null);
  const [popoverOpen, setPopoverOpen] = useState(true);

  const { policy } = usePasswordContext();
  const history = useHistory();

  let passwordPolicy = Yup.string().required('Introduce tu contraseña');

  for (const requirement of policy) {
    passwordPolicy = passwordPolicy.matches(
      requirement.rule,
      requirement.error
    );
  }

  const schema = Yup.object().shape({
    password: passwordPolicy,
    email: Yup.string()
      .required('Introduce tu email')
      .email('No es una dirección de email válida'),
  });

  const closePopover = () => setPopoverOpen(false);

  const submit = ({ email, password }: SignUpFormValues) => {
    setSubmitting(true);
    closePopover();
    AuthenticationService.signUp(email, password)
      .then(() => {
        history.push('/iniciar-sesion?message=registered&email=' + email);
        setSubmitting(false);
      })
      .catch(error => {
        setError(error.message);
        setSubmitting(false);
      });
  };

  return (
    <EuiFlexGroup direction="column" alignItems="center" responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiText size="m" textAlign="center">
          <EuiTitle size="m">
            <h2>Crear una cuenta</h2>
          </EuiTitle>
        </EuiText>
      </EuiFlexItem>
      <EuiSpacer size="xs" />
      <EuiFlexItem grow={false}>
        <EuiText size="s" textAlign="center">
          ¿Ya te has registrado?{' '}
          <Link to="/iniciar-sesion" data-testid="log-in-link">
            Inicia sesión
          </Link>
        </EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
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
                    data-testid="error-callout"
                  >
                    {error}
                  </EuiCallOut>
                  <EuiSpacer />
                </>
              )}
              <EuiFormRow
                label="Email"
                isInvalid={errors.email && touched.email}
                error={errors.email}
              >
                <EuiFieldText
                  name="email"
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  icon="email"
                  data-testid="email-input"
                />
              </EuiFormRow>
              <EuiFormRow
                label="Contraseña"
                isInvalid={errors.password && touched.password}
                error={errors.password}
              >
                <PasswordField
                  value={values.password}
                  onChange={handleChange}
                  displayRestrictions={popoverOpen}
                  data-testid="password-input"
                />
              </EuiFormRow>
              <EuiSpacer size="xl" />
              <EuiFormRow>
                <EuiButton
                  type="submit"
                  color="primary"
                  fill
                  isLoading={submitting}
                  fullWidth
                  data-testid="submit-button"
                >
                  Crear cuenta
                </EuiButton>
              </EuiFormRow>
              <EuiFormRow>
                <EuiText color="subdued" size="s">
                  Al registrarte, confirmas haber leído y aceptado nuestra{' '}
                  <EuiLink
                    href="https://descargas.uned.es/publico/pdf/Politica_privacidad_UNED.pdf"
                    target="blank"
                  >
                    Política de Privacidad
                  </EuiLink>
                  .
                </EuiText>
              </EuiFormRow>
            </EuiForm>
          )}
        </Formik>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
