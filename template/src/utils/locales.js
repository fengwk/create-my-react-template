import antdEnUS from 'antd/locale/en_US';
import antdZhCN from 'antd/locale/zh_CN';

const localeConfigs = [
  {
    localeName: 'enUS',
    standardLocaleName: 'en-US',
    displayName: 'English',
    antdLocale: antdEnUS,
  },
  {
    localeName: 'zhCN',
    standardLocaleName: 'zh-CN',
    displayName: '中文',
    antdLocale: antdZhCN,
  },
];
const defaultLocaleName = localeConfigs[0].localeName;

function getLocaleConfig(localeName) {
  for (const localeConfig of localeConfigs) {
    if (localeConfig.localeName === localeName) {
      return localeConfig;
    }
  }
  return defaultLocaleName;
}

export function getDefaultLocaleName() {
  const standardLocaleName = navigator.language || navigator.userLanguage;
  for (const localeConfig of localeConfigs) {
    if (localeConfig.standardLocaleName === standardLocaleName) {
      return localeConfig.localeName;
    }
  }
  return defaultLocaleName;
}

export function getAntdLocale(localeName) {
  const localeConfig = getLocaleConfig(localeName);
  return localeConfig.antdLocale;
}

export function getLocaleOptions() {
  const options = [];
  for (const localeConfig of localeConfigs) {
    options.push({
      value: localeConfig.localeName,
      label: localeConfig.displayName
    });
  }
  return options;
}

export function getLocales(localesDefinition, localeName) {
  let locales = localesDefinition[localeName];
  if (!locales) {
    locales = localesDefinition[defaultLocaleName];
  }
  if (!locales) {
    console.error('unkonw localesDefinition', localeName, localesDefinition);
    throw new Error('unkonw localesDefinition');
  }
  return locales;
}
