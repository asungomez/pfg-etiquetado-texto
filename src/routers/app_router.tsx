import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AuthenticationLayout, DashboardLayout } from '../components';
// import DashboardLayout from '../components/dashboard/DashboardLayout/DashboardLayout';
// import NotFound from '../components/other/NotFound/NotFound';
import { AuthenticatedRoute } from './authenticated_route';
import { UnauthenticatedRoute } from './unauthenticated_route';

export const AppRouter: React.FC<{}> = () => {
  return (
    <Switch>
      <UnauthenticatedRoute
        path={['/', '/iniciar-sesion', '/registro', '/recuperar-contrasena']}
        exact
      >
        <AuthenticationLayout />
      </UnauthenticatedRoute>
      <AuthenticatedRoute path={['/panel']}>
        <DashboardLayout />
      </AuthenticatedRoute>
      <Route path="/error">
        <AuthenticationLayout error={true} />
      </Route>
      {/* <Route>
        <NotFound />
      </Route> */}
    </Switch>
  );
};
