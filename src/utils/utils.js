import { copy as Copy } from 'iclipboard';
import { Toast } from '@douyinfe/semi-ui';

export function copy(msg) {
  if (Copy(msg)) {
    Toast.success('Copied');
  } else {
    Toast.error('Failed to copy.');
  }
}

export function findValueByKeyPath(data, keyPath = []) {
  const [path] = keyPath;
  if (data[path] === undefined) return data;
  return findValueByKeyPath(data[path], keyPath.slice(1));
}

export function ArrayToObjectByKeyValue(data = []) {
  return data.reduce((ret, item) => {
    if (!item) return ret;
    const { key, value } = item;
    if (key === undefined || key === null) return ret;
    ret[key] = value || '';
    return ret;
  }, {});
}

export function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      res(reader.result);
    };
    reader.onerror = (error) => {
      rej(error);
    };
  });
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line no-bitwise, no-mixed-operators
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function formatDate(date, fmt = 'YYYY-MM-DD hh:mm:ss') {
  if (!date) return '';
  const _date = new Date(date);
  const o = {
    'M+': _date.getMonth() + 1, // 月份
    'D+': _date.getDate(), // 日
    'h+': _date.getHours(), // 小时
    'm+': _date.getMinutes(), // 分
    's+': _date.getSeconds(), // 秒
    'q+': Math.floor((_date.getMonth() + 3) / 3), // 季度
    S: _date.getMilliseconds(), // 毫秒
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${_date.getFullYear()}`).substring(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
}

export function omitText(text = '') {
  const textStr = String(text);
  if (textStr.length >= 15) {
    return String(text).replace(/(.{6})(.*)(.{4})/, '$1....$3');
  }
  return text;
}

export function filterEmptyField(data = []) {
  return data.reduce((ret, curr) => {
    const { key = '', value = '' } = curr || {};
    if (!key && !value) {
      return ret;
    }
    ret[key] = value;
    return ret;
  }, {});
}

export function toAnchor(id) {
  try {
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } catch (error) {

  }
}
