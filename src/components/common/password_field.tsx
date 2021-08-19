import { EuiFieldPassword, EuiInputPopover } from '@elastic/eui';
import React, { useState } from 'react';

import { usePasswordContext } from '../../contexts';
import { PasswordChecker } from '.';

type PasswordFieldProps = {
  displayRestrictions?: boolean;
  name?: string;
  value: string;
  onChange: (e: any) => void;
  autoComplete?: string;
};

export const PasswordField: React.FC<PasswordFieldProps> = ({
  displayRestrictions = false,
  value,
  onChange,
  name = 'password',
  autoComplete,
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
        />
      }
    >
      <PasswordChecker password={value} />
    </EuiInputPopover>
  );
};
