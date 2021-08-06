import { EuiButton } from '@elastic/eui';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthenticationService } from '../../../services';

export type LogInMessageActionType =
  | 'resendConfirmationMail'
  | 'register'
  | 'resendPasswordMail';

type LogInMessageActionDescription = {
  [action in LogInMessageActionType]: {
    icon: string;
    action: () => void;
    text: string;
  };
};

export type LogInMessageActionProps = {
  type: LogInMessageActionType;
  email?: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const mapColor = (
  color: 'primary' | 'success' | 'warning' | 'danger'
): 'primary' | 'text' | 'warning' | 'danger' =>
  color === 'success' ? 'text' : color;

export const LogInMessageAction: React.FC<LogInMessageActionProps> = ({
  type,
  email,
  onError,
  onSuccess,
  color,
}) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const resendConfirmationEmail = () => {
    if (email) {
      setLoading(true);
      AuthenticationService.resendConfirmationMessage(email)
        .then(() => {
          setLoading(false);
          onSuccess(
            'Mensaje enviado con éxito, consulta tu bandeja de entrada'
          );
        })
        .catch(error => {
          setLoading(false);
          if (error.code === 'AlreadyConfirmed') {
            onSuccess(error.message);
          } else {
            onError(error.message);
          }
        });
    } else {
      onError('No se pudo enviar el mensaje');
    }
  };

  const resendPasswordEmail = () => {
    if (email) {
      setLoading(true);
      AuthenticationService.requestResetPassword(email)
        .then(() => {
          setLoading(false);
          onSuccess(
            'Mensaje enviado con éxito, consulta tu bandeja de entrada'
          );
        })
        .catch(error => {
          setLoading(false);
          onError(error.message);
        });
    } else {
      onError('No se pudo enviar el mensaje');
    }
  };

  const goToSignUp = () => history.push('/registro');

  const actions: LogInMessageActionDescription = {
    resendConfirmationMail: {
      icon: 'refresh',
      action: resendConfirmationEmail,
      text: 'Enviar de nuevo',
    },
    register: {
      icon: 'user',
      action: goToSignUp,
      text: 'Crear nueva cuenta',
    },
    resendPasswordMail: {
      icon: 'refresh',
      action: resendPasswordEmail,
      text: 'Enviar de nuevo',
    },
  };

  return (
    <EuiButton
      iconType={actions[type].icon}
      onClick={actions[type].action}
      isLoading={loading}
      color={mapColor(color)}
    >
      {actions[type].text}
    </EuiButton>
  );
};
