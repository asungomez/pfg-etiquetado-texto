import { Amplify } from 'aws-amplify';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { awsConfig } from './aws_config';
import { AppRouter } from './routers';

Amplify.configure(awsConfig);

const App: React.FC<{}> = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
