import axios, { AxiosInstance } from "axios";
import { httpHost } from "./config";

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
