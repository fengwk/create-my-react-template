import axios from 'axios';

const localAxios = axios.create({
  timeout: 1000 * 30
});

function parseRespData(resp) {
  // 默认值
  let data = {
    success: false,
    message: 'request error',
  };
  if (resp?.data && typeof resp.data === 'object') {
    data = resp.data;
    const { status } = data;
    // 如果http status在[200..300)认为成功
    if (status && status >= 200 && status < 300) {
      data.success = true;
      if (!data.message) {
        data.message = 'success';
      }
    } else {
      data.success = false;
      if (!data.message) {
        data.message = 'request failed';
      }
    }
  }
  return data;
}

export default function api(executor) {
  const respPromise = executor(localAxios);
  if (respPromise && respPromise instanceof Promise) {
    return new Promise((resolve, reject) => {
      respPromise
        .then((resp) => {
          const data = parseRespData(resp);
          if (data && data.success) {
            resolve(data.data);
          } else {
            reject(data.message);
          }
        })
        .catch((err) => {
          if (!err?.response) {
            console.error(err);
          }
          const data = parseRespData(err.response);
          reject(data.message);
        });
    });
  }
  return null;
}
