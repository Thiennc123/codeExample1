import React from 'react';
import { Provider } from 'react-redux';
import GlobalStyles from '@iso/assets/styles/globalStyle';
import { store } from './redux/store';
import Boot from './redux/boot';
import Main from './Layout/Main';
import AppProvider from './AppProvider';
import { BrowserRouter } from "react-router-dom";

const App = () => (
  <Provider store={store}>
      <BrowserRouter>
        <AppProvider>
          <GlobalStyles />
          <Main />
        </AppProvider>
      </BrowserRouter>
  </Provider>
);
Boot()
  .then(() => App())
  .catch(error => console.error(error));

export default App;
