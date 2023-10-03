import axios, { Axios, AxiosRequestConfig } from 'axios';
import message from '../app/message/message';

axios.defaults.timeout = 30000; //设置超时时间，单位毫秒
// axios.defaults.retry = 3; //设置全局请求次数
// axios.defaults.retryDelay = 1000;//设置全局请求间隙

//请求发送队列
const pendingMap = new Map();

// 发送请求之前
axios.interceptors.request.use(
  (config) => {

    if (config.headers && (config.url && !config.url.includes('//'))) {
      // 不判定null则会发送token为空的验证头，导致初次进入的用户页面反复load: 已解决
      config.headers['Authentication'] = `${localStorage.getItem('token')}`;
    }

    //发送请求之前，判断是否有相同请求正在发送中，如果有则取消
    let key = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
    let cancel = pendingMap.get(key);
    if (cancel) {
      cancel();
      //删除队列中对应的请求
      pendingMap.delete(key);
    }

    //配置新请求的cancelToken
    config.cancelToken = new axios.CancelToken((cancelToken) => {
      let key = `${config.method}:${config.url}`;
      pendingMap.set(key, cancelToken);
    });
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 请求返回
axios.interceptors.response.use(
  (response) => {
    //缓存数据

    //该接口需要缓存

    //删除等待队列中的请求
    pendingMap.delete(
      `${response.config.method}:${response.config.url}:${JSON.stringify(
        response.config.params
      )}`
    );

    const { data } = response;
    // 签名无效 签名失效
    if (data.code === '2005' || data.code === '2004') {
      /*
        location.reload();
        location.href会刷新页面同时跳转路由，这里判断用户是否从系统掉出
        解决getImage接口异常返回登录页面刷新两次的问题。
        */
      window.localStorage.setItem('token', 'TOKEN_EXPIRED');
      if (!location.href.includes('login')) {
        location.href = '/login';
      }
    }
    return data;
  },
  (err) => {
    //处理异常
    if (err) {
      if (!err.response) {
        // 非主动取消的请求
        if (!axios.isCancel(err)) {
          console.warn('拦截器报错', err);
          if (err.code === 'ECONNABORTED') {
            // 超时的请求
            message.warning({ title: '', content: '网络请求超时' });
          } else {
            // 其他的请求失败
            message.warning({ title: '', content: '网络请求异常' });
          }
        }
      }
      if (err.response?.status) {
        switch (err.response.status) {
          case 401:
            console.log('用户没有访问权限, 需要进行身份认证');
            message.warning({
              title: '401',
              content: '用户没有访问权限, 需要进行身份认证',
            });
            break;
          case 403:
            console.log('资源访问被禁止');
            message.warning({
              title: '403',
              content: '资源访问被禁止',
            });
            break;
          case 404:
            console.log('访问请求不存在');
            message.error({
              title: '404',
              content: '访问请求不存在',
            });
            break;
          case 500:
            console.log('服务端内部错误');
            message.warning({
              title: '500',
              content: '服务端内部错误',
            });
            break;
          case 502:
            console.log('网关错误');
            message.warning({
              title: '502',
              content: '网关错误',
            });
            break;
          case 503:
            console.log('服务器正在维护');
            message.warning({
              title: '503',
              content: '服务器正在维护',
            });
            break;
          case 504:
            console.log('网络请求超时');
            message.info({
              title: '504',
              content: '网络请求超时',
            });
            break;

          default:
            console.log(err.response.data.message);
        }
      }
    }

    return Promise.reject(err);
  }
);

/**
 * use for get http method
 * @param url
 * @param parameter
 * @returns
 */
export function getAction<T>(
  url: string,
  parameter?: unknown,
  config?: AxiosRequestConfig,
  ifStore?: boolean
): Promise<T> {
  return new Promise((resolve, reject) => {
    axios
      .request({
        ...config,
        url: url,
        method: 'get',
        params: parameter,
      })
      .then((data: any) => {
        if (ifStore) {
          window.localStorage.setItem(url + JSON.stringify(parameter), JSON.stringify(data));
        }
        resolve(data);
      })
      .catch((e) => {
        // 统一捕获。
        if (ifStore) {
          const data = localStorage.getItem(url + JSON.stringify(parameter))

          data && resolve(JSON.parse(data))
        }
        console.log('getAction', e);
      });
  });
}

/**
 * use for post http method
 * @param url
 * @param parameter
 * @returns
 */
export function postAction<T>(
  url: string,
  parameter?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return new Promise((resolve, reject) => {
    axios
      .request({
        ...config,
        url: url,
        method: 'post',
        data: parameter,
      })
      .then((data: any) => {
        resolve(data);
      })
      .catch((e) => {
        console.log('postAction', e);
      });
  });
}

/**
 * use for put http method
 * @param url
 * @param parameter
 * @returns
 */
export function putAction<T>(url: string, parameter?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: url,
        method: 'put',
        data: parameter,
      })
      .then((data: any) => {
        resolve(data);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

/**
 * use for delete http method
 * @param url
 * @param parameter
 * @returns
 */
export function deleteAction<T>(url: string, parameter?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: url,
        method: 'delete',
        params: parameter,
      })
      .then((data: any) => {
        resolve(data);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}
