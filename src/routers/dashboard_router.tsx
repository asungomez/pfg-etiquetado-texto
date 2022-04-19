import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Welcome } from '../components';

export const DashboardRouter: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path="/panel" component={Welcome} />
    </Switch>
  );
};
