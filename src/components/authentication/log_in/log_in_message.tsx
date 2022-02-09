import {
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import React, { useState } from 'react';

import {
  LogInMessageAction,
  LogInMessageActionType,
} from './log_in_message_action';

export type LogInMessageType =
  | 'registered'
  | 'confirmed'
  | 'needsConfirmation'
  | 'notExistent'
  | 'resetPasswordRequested'
  | 'resetPasswordSucceeded';

type LogInMessageDefinition = {
  [type in LogInMessageType]: {
    title: string;
    description: string;
    color: 'primary' | 'success' | 'warning' | 'danger';
    action?: LogInMessageActionType;
    needsEmail?: boolean;
  };
};

const messageDefinition: LogInMessageDefinition = {
  registered: {
    title: 'Comprueba tu bandeja de entrada',
    description: 'Te hemos enviado un enlace de confirmación',
    color: 'primary',
    action: 'resendConfirmationMail',
    needsEmail: true,
  },
  confirmed: {
    title: 'Tu cuenta ha sido confirmada',
    description: 'Ya puedes iniciar sesión',
    color: 'primary',
  },
  needsConfirmation: {
    title: 'Tu dirección de email no está confirmada',
    description:
      'Te hemos enviado un mensaje con un enlace de confirmación tras tu registro. Si no lo has recibido, podemos enviártelo otra vez.',
    color: 'danger',
    action: 'resendConfirmationMail',
    needsEmail: true,
  },
  notExistent: {
    title: 'No existe la cuenta',
    description:
      'La dirección de email proporcionada no se corresponde con ninguna cuenta registrada',
    color: 'danger',
    action: 'register',
  },
  resetPasswordRequested: {
    title: 'Comprueba tu bandeja de entrada',
    description: 'Te hemos enviado un enlace para restaurar tu contraseña',
    color: 'primary',
    action: 'resendPasswordMail',
    needsEmail: true,
  },
  resetPasswordSucceeded: {
    title: 'Tu contraseña se ha actualizado',
    description: 'Puedes iniciar sesión con tus nuevas credenciales',
    color: 'success',
  },
};

type LogInMessageProps = {
  type: LogInMessageType;
  email?: string;
  'data-testid'?: string;
};

export const LogInMessage: React.FC<LogInMessageProps> = ({
  type,
  email,
  'data-testid': testId,
}) => {
  const [error, setError] = useState<string>(null);
  const [success, setSuccess] = useState<string>(null);

  const display: boolean =
    messageDefinition[type] && (!!email || !messageDefinition[type].needsEmail);

  return display ? (
    <EuiCallOut
      title={error ? error : success ? success : messageDefinition[type].title}
      color={
        error ? 'danger' : success ? 'success' : messageDefinition[type].color
      }
      iconType={error ? 'alert' : success ? 'check' : null}
      data-testid={testId}
    >
      {!error && !success && (
        <>
          <EuiText>{messageDefinition[type].description}</EuiText>

          {messageDefinition[type].action && (
            <>
              <EuiSpacer />
              <EuiFlexGroup direction="row" justifyContent="flexEnd">
                <EuiFlexItem grow={false}>
                  <LogInMessageAction
                    type={messageDefinition[type].action}
                    email={email}
                    onError={setError}
                    onSuccess={setSuccess}
                    color={
                      error
                        ? 'danger'
                        : success
                        ? 'success'
                        : messageDefinition[type].color
                    }
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </>
          )}
        </>
      )}
    </EuiCallOut>
  ) : null;
};
