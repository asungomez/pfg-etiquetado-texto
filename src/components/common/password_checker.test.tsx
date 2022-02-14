import { render } from '@testing-library/react';

import {
  PasswordContext,
  PasswordRequirement,
} from '../../contexts/password_context';
import { PasswordChecker } from './password_checker';

const renderComponent = (
  password: string,
  policy: PasswordRequirement[] = []
) => {
  return render(
    <PasswordContext.Provider
      value={{
        policy,
        isValid: () => true,
      }}
    >
      <PasswordChecker password={password} />
    </PasswordContext.Provider>
  );
};

const passedConstraints = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.euiListGroupItem--primary')).map(
    element => element.textContent
  );

const failedConstraints = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.euiListGroupItem--subdued')).map(
    element => element.textContent
  );

describe('PasswordChecker', () => {
  it('displays all constraints as passed when the password is compliant', async () => {
    const { container } = renderComponent('password', [
      {
        rule: new RegExp(`^.{3,}$`),
        message: '3 caracteres',
        error: `La contraseña debe tener al menos 3 caracteres`,
      },
    ]);
    expect(passedConstraints(container)).toContain('3 caracteres');
  });

  it('displays the failed constraints when the password is not compliant', () => {
    const { container } = renderComponent('a', [
      {
        rule: new RegExp(`^.{3,}$`),
        message: '3 caracteres',
        error: `La contraseña debe tener al menos 3 caracteres`,
      },
    ]);
    expect(failedConstraints(container)).toContain('3 caracteres');
  });

  it("does not render when there's no policy", () => {
    const { container } = renderComponent('a');
    expect(container).toBeEmptyDOMElement();
  });
});
