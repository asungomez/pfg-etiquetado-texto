import { Amplify } from 'aws-amplify';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { awsConfig } from './aws_config';
import { AuthenticationContext } from './contexts';
import { useAuthentication } from './hooks';
import { AppRouter } from './routers';

Amplify.configure(awsConfig);

const App: React.FC<{}> = () => {
  const authentication = useAuthentication();
  return (
    <BrowserRouter>
      <AuthenticationContext.Provider value={authentication}>
        {!authentication.isAuthenticating && <AppRouter />}
      </AuthenticationContext.Provider>
    </BrowserRouter>
  );
};

export default App;
