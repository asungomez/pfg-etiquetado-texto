import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useAuthenticationContext } from '../contexts';

export const AuthenticatedRoute: React.FC<any> = ({
  children,
  ...routeProps
}) => {
  const { isAuthenticated } = useAuthenticationContext();
  return (
    <Route {...routeProps}>
      {isAuthenticated ? children : <Redirect to="/iniciar-sesion" />}
    </Route>
  );
};
