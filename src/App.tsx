import { Amplify } from 'aws-amplify';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import amplifyConfig from './aws-exports.json';
import { AppRouter } from './routers';

Amplify.configure(amplifyConfig);

const App: React.FC<{}> = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
