import Vue from 'vue';
import axios from 'axios';
import iView, { Notice } from 'iview';
// import store from '@/store'
Vue.use(iView, {
  transfer: true
});

// const SERVER_BASE_URL = 'http://www.routereading.com/';
const SERVER_BASE_URL = 'http://localhost:3000/';
// const SERVER_BASE_URL = 'http://42.193.180.199/';

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: SERVER_BASE_URL,
      timeout: 25000,
      headers: options.headers
    });
    instance.interceptors.request.use(
      config => {
        iView.LoadingBar.start();
        // config.headers.Authorization = 'token'
        return config;
      },
      err => {
        iView.LoadingBar.error();
        return Promise.reject(err);
      });

    instance.interceptors.response.use(
      response => {
        iView.LoadingBar.finish();
        return response;
      },
      error => {
        iView.LoadingBar.error();
        return Promise.reject(error);
      });

    instance(options)
      .then((res) => {
        // 请求成功时,根据业务判断状态
        /*  if (code === port_code.success) {
         resolve({code, msg, data})
         return false
         } else if (code === port_code.unlogin) {
         setUserInfo(null)
         router.replace({name: "login"})
         } */
        resolve(res.data);
        return false;
      })
      .catch((error) => {
        // 请求失败时,根据业务判断状态
        if (error.response.data.msg !== undefined) {
          // if (error.response.status === 401) {
          //   error.response.data.msg = '认证失败请重新登录！！！';
          // }
          Notice.error({
            title: '出错了！',
            desc: '错误原因 ' + error.response.data.msg,
            duration: 0
          });
        } else {
          Notice.error({
            title: '出错了！',
            desc: '错误原因 ' + JSON.stringify(error),
            duration: 0
          });
        }
        reject(error);
      });
  });
};
