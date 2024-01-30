import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector } from 'react-redux';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import DemoPage from './DemoPage';
import globalSlice from './common/globalSlice';
import demoPageSlice from './DemoPage/slice';
import { getAntdLocale } from '../utils';

// theme configs
const themeConfigs = {
  light: {
  },
  dark: {
    algorithm: theme.darkAlgorithm,
  }
};

// redux
const reducer = {
  globalState: globalSlice.reducer,
  demoPageState: demoPageSlice.reducer,
};

const store = configureStore({ reducer });

// pages
function Pages() {
  const globalState = useSelector((state) => state.globalState);
  const { localeName, themeName } = globalState;
  return (
    <ConfigProvider
      locale={getAntdLocale(localeName)}
      theme={themeConfigs[themeName]}
    >
      <Router>
        <Routes>
          <Route path="/">
            <Route path="demo" element={<DemoPage />} />
            <Route path="demo/:" element={<DemoPage />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

// redux wrapper
export default function PagesWrapper() {
  return (
    <Provider store={store}>
      <Pages />
    </Provider>
  );
}
