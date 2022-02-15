import { EuiFieldPassword, EuiInputPopover } from '@elastic/eui';
import React, { useState } from 'react';

import { usePasswordContext } from '../../contexts';
import { PasswordChecker } from '.';

export type PasswordFieldProps = {
  displayRestrictions?: boolean;
  name?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  'data-testid'?: string;
};

export const PasswordField: React.FC<PasswordFieldProps> = ({
  displayRestrictions = false,
  value,
  onChange,
  name = 'password',
  autoComplete,
  'data-testid': dataTestId,
}) => {
  const [focused, setFocused] = useState(false);

  const { isValid } = usePasswordContext();

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const popoverOpen = displayRestrictions && focused && !isValid(value);

  return (
    <EuiInputPopover
      isOpen={popoverOpen}
      closePopover={() => {}}
      fullWidth
      input={
        <EuiFieldPassword
          name={name}
          type="dual"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          fullWidth
          autoComplete={autoComplete}
          data-testid={dataTestId}
        />
      }
    >
      <PasswordChecker password={value} />
    </EuiInputPopover>
  );
};
