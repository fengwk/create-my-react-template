import dayjs from 'dayjs';
import api from './api';
import { bindActions } from './slices';
import {
  getDefaultLocaleName,
  getAntdLocale,
  getLocaleOptions,
  getLocales,
} from './locales';

export function toString(obj) {
  if (!obj) {
    return '';
  }
  return obj.toString();
}

export function toAntdFormFields(obj) {
  const fiels = [];
  if (obj) {
    for (const key of Object.keys(obj)) {
      const value = obj[key] || null;
      fiels.push({
        name: [key],
        value,
      });
    }
  }
  return fiels;
}

export function parseAntdFormFileds(formFields) {
  const data = {};
  for (const field of formFields) {
    if (field.value) {
      data[field.name[0]] = field.value;
    }
  }
  return data;
}

// 将服务端返回的时间解析为dayjs对象
export function parseDateTime(dateTime) {
  // https://day.js.org/docs/en/parse/string-format
  return dateTime ? dayjs(dateTime, 'YYYY-MM-DDTHH:mm:ss') : null;
}

// 解析并格式化服务端返回的时间
export function parseDateTimeAndFormat(dateTime, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss';
  const dt = parseDateTime(dateTime);
  return dt ? dt.format(format) : null;
}

export function copy(obj) {
  const json = JSON.stringify(obj);
  return JSON.parse(json);
}

// 为可迭代对象生成key
export function generateKeys(iter, genKey) {
  const result = [];
  if (genKey && iter && typeof iter[Symbol.iterator] === 'function') {
    for (const item of iter) {
      if (item) {
        const copied = copy(item);
        copied.key = genKey(item);
        result.push(copied);
      }
    }
  }
  return result;
}

export function nullSafe(val, defaultVal) {
  if (val === null || val === undefined) {
    return defaultVal;
  }
  return val;
}

export {
  api,
  bindActions,
  getDefaultLocaleName,
  getAntdLocale,
  getLocaleOptions,
  getLocales,
};
