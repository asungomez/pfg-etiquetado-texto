import { render, screen } from '@testing-library/react';

import {
  ResetPasswordError,
  ResetPasswordErrorProps,
} from './reset_password_error';

const defaultProps: ResetPasswordErrorProps = {
  type: 'default',
};
const renderComponent = (
  propsOverride: Partial<ResetPasswordErrorProps> = {}
) => {
  const props = {
    ...defaultProps,
    ...propsOverride,
  };
  return render(<ResetPasswordError {...props} />);
};

describe('ResetPasswordError', () => {
  it('renders the message prop when the type is set to default', async () => {
    renderComponent({ message: 'Some error message' });
    const errorMessage = await screen.findByText('Some error message');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders a generic message when the type is set to default and the message prop is not set', async () => {
    renderComponent();
    const errorMessage = await screen.findByText('Ha habido un error');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders the non-confirmed action box when the type is set to nonConfirmed and the email is not blank', async () => {
    renderComponent({ type: 'notConfirmed', email: 'some@email.com' });
    const nonConfirmedBox = await screen.findByTestId('action-non-confirmed');
    expect(nonConfirmedBox).toBeInTheDocument();
  });

  it('renders the default message when the type is set to nonConfirmed but the email is not defined or blank', async () => {
    renderComponent({ type: 'notConfirmed' });
    const nonConfirmedBox = screen.queryByTestId('action-non-confirmed');
    expect(nonConfirmedBox).not.toBeInTheDocument();
    const errorMessage = await screen.findByText('Ha habido un error');
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders the non-registered action box when the type is set to nonRegistered', async () => {
    renderComponent({ type: 'notRegistered' });
    const notRegisteredBox = await screen.findByTestId('action-not-registered');
    expect(notRegisteredBox).toBeInTheDocument();
  });
});
