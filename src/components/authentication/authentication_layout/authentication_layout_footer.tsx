import { EuiLink } from '@elastic/eui';
import React from 'react';

export const AuthenticationLayoutFooter: React.FC<{}> = () => (
  <>
    <EuiLink
      href="https://github.com/asungomez/pfg-etiquetado-texto"
      target="_blank"
    >
      Github
    </EuiLink>
  </>
);
