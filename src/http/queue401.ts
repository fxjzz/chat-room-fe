import { AxiosRequestConfig } from "axios";
import { http } from "./http";

const requestQueue: any = [];
let isRefreshing = false;

export default function queue401(config: AxiosRequestConfig) {
  const originalRequest = config;
  // 创建一个函数来处理刷新token后的逻辑
  const onRefreshed = (token: any) => {
    localStorage.setItem("jwt", token);
    isRefreshing = false;
    // 处理所有等待中的请求
    requestQueue.forEach((cb: Function) => cb(token));
    // 清空请求队列
    requestQueue.length = 0;
  };
  if (isRefreshing) {
    return new Promise((resolve) => {
      requestQueue.push((token: any) => {
        originalRequest.headers!.Authorization = `Bearer ${token}`;
        resolve(http.instance(config));
      });
    });
  } else {
    isRefreshing = true;
    return http
      .get("auth/refresh-token")
      .then((res) => {
        onRefreshed(res.data.access_token);
        originalRequest.headers!.Authorization = `Bearer ${res.data.access_token}`;
        http.instance(config);
      })
      .catch((err) => {
        requestQueue.length = 0;
        throw err;
      });
  }
}
