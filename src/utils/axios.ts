import axios from "axios";
import { kkEndpoint } from "./config";

const axiosInstance = axios.create({
    baseURL: kkEndpoint,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${process.env.KK_API_TOKEN}`;
        config.headers['x-bv-org-id'] = 'b6a55280-b52c-432c-a7da-522422a8c46d'
        return config
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // if (response.config.toastId) toast.remove(response.config.toastId)
    return response
  },
  (error) => {
    console.error(error)
    return error
  }
)
export default axiosInstance;
