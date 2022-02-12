import { render, screen } from '@testing-library/react';

import { LogInMessage, messageDefinition } from './log_in_message';

describe('LogInMessage', () => {
  describe('With a non existent type', () => {
    it('does not render', () => {
      const { container } = render(<LogInMessage type={null} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('With a type that does not require email', () => {
    it('renders the message content', async () => {
      render(<LogInMessage type="confirmed" />);
      const messageText = await screen.findByText(
        messageDefinition.confirmed.description
      );
      expect(messageText).toBeInTheDocument();
    });
  });

  describe('With a type that requires email', () => {
    it('does not render if the email is not provided', () => {
      const { container } = render(<LogInMessage type="registered" />);
      expect(container).toBeEmptyDOMElement();
    });

    it('renders when the email is provided', () => {
      const { container } = render(
        <LogInMessage type="registered" email="some@email.com" />
      );
      expect(container).not.toBeEmptyDOMElement();
    });
  });

  describe('With a type that includes an action', () => {
    it('renders the action button', async () => {
      render(<LogInMessage type="notExistent" />);
      const actionButton = await screen.findByTestId('action-button-wrapper');
      expect(actionButton).toBeInTheDocument();
    });
  });
});
