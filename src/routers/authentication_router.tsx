import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LogIn } from '../components/authentication/log_in/log_in';

export const AuthenticationRouter: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path={['/', '/iniciar-sesion']} exact component={LogIn} />
      {/* <Route path="/recuperar-contrasena" component={ResetPassword} />
      <Route path="/error" component={ErrorView} />
      <Route path="/registro" component={SignUp} /> */}
    </Switch>
  );
};
