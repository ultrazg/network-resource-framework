import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { HashRouter, BrowserRouter } from 'react-router-dom';


import AppProviders from './app/auth-provider';
import App from './app/app';
import { store } from './store';
import './antd.css';



ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </StrictMode>
    </Provider>
  </HashRouter>,
  document.getElementById('root')
);
