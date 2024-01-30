import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Select, Switch, Space, message, theme
} from 'antd';
import { bindActions, getLocales, getLocaleOptions } from '../../utils';
import slice from './slice';
import { globalSlice } from '../common';
import localesDefinition from './localesDefinition';
import { HelloSvg } from '../../assets';
import useStyles from './index.jss';

function HelloContainer(props) {
  const { context } = props;
  const {
    globalState, globalActions, locales, styles, messageApi
  } = context;
  const { themeName, localeName } = globalState;

  return (
    <Space direction="vertical">
      <div className={styles.helloFont}>
        {locales.hello}
        <HelloSvg />
      </div>
      <Space>
        {locales.language}
        <Select
          options={getLocaleOptions()}
          value={localeName}
          onChange={(value) => globalActions.setLocaleName(value)}
        />
      </Space>
      <Space>
        {locales.theme}
        <Switch
          value={themeName === 'light'}
          onChange={(value) => globalActions.setThemeName(value ? 'light' : 'dark')}
        />
      </Space>
      <Button onClick={() => {
        messageApi.open({
          type: 'info',
          content: locales.helloWord,
        });
      }}
      >
        {locales.clickHere}
      </Button>
    </Space>
  );
}

export default function DemoPage() {
  // dispatch
  const dispatch = useDispatch();
  // global slice
  const globalState = useSelector((state) => state.globalState);
  const globalActions = bindActions(dispatch, globalSlice.actions);
  // page slice
  const state = useSelector((state) => state.demoPageState);
  const actions = bindActions(dispatch, slice.actions);
  // locale
  const { localeName } = useSelector((state) => state.globalState);
  const locales = getLocales(localesDefinition, localeName);
  // styles
  const { token } = theme.useToken();
  const styles = useStyles(token);
  // message api
  const [messageApi, messageContextHolder] = message.useMessage();

  const context = {
    globalState,
    globalActions,
    state,
    actions,
    locales,
    styles,
    messageApi,
  };

  useEffect(() => {
    // init function
    console.log('init');
    return () => { };
  }, []);

  return (
    <>
      <HelloContainer context={context} />
      {messageContextHolder}
    </>
  );
}
