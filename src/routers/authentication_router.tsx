import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LogIn, ResetPassword, SignUp, UpdatePassword } from '../components';

export const AuthenticationRouter: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path={['/', '/iniciar-sesion']} exact component={LogIn} />
      <Route path="/recuperar-contrasena" component={ResetPassword} />
      <Route path="/nueva-contrasena" component={UpdatePassword} />
      <Route path="/registro" component={SignUp} />
    </Switch>
  );
};
