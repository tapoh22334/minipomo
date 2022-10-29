import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App';
import AppSetting from './AppSetting';

import reportWebVitals from './reportWebVitals';

import {AppContextProvider} from './modules/AppContext';
import {AppContext} from './modules/AppContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

document.addEventListener('contextmenu', event => event.preventDefault());

root.render(
  <React.StrictMode>
    <BrowserRouter>
        <AppContextProvider>
        <Routes>
            <Route path={`/`} element={<App/>} />
            <Route path={`/setting/`} element={<AppSetting />} />
        </Routes>
        </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
