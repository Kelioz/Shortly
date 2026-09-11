import axios, { AxiosRequestConfig } from "axios";
import * as Api from "./Api";
import { Config } from "../config/config";

export const AXIOS_INSTANCE = axios.create({
  baseURL: Config.API_URL,
});
export const customInstance = <T>(
  config: AxiosRequestConfig,

  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,

    ...options,

    cancelToken: source.token,
  }).then(({ data }) => data);

  const cancellablePromise = promise as Promise<T> & { cancel: () => void };
  cancellablePromise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return cancellablePromise;
};
export const apiClient = Api;
