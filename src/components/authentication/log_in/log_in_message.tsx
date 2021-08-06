import React from 'react';

type LogInMessageProps = {
  type: LogInMessageType;
  email?: string;
};

export type LogInMessageType =
  | 'registered'
  | 'confirmed'
  | 'needsConfirmation'
  | 'notExistent'
  | 'resetPasswordRequested'
  | 'resetPasswordSucceeded';

export const LogInMessage: React.FC<LogInMessageProps> = () => <></>;
