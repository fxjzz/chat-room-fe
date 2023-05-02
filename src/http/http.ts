import axios, { AxiosInstance } from "axios";
import { httpHost } from "./config";
import { notification } from "antd";

class Http {
  instance: AxiosInstance;
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
  }

  get(url: string) {
    return this.instance.request({ url });
  }

  post(url: string, data: any) {
    return this.instance.post(url, data);
  }
}

export const http = new Http(httpHost);

http.instance.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

http.instance.interceptors.request.use(
  (res) => {
    return res;
  },
  (err) => {
    notification.error({
      message: "错误提示",
      description: "服务器繁忙",
    });
    return err;
  }
);
