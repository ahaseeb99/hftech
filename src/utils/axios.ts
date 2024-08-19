import axios from "axios";
import { BACKEND_SERVER_URL } from "../config";
import { clearCurrentUser } from "../store/auth/actions";
import { store } from "../store";



const apiClient = axios.create({
  baseURL: BACKEND_SERVER_URL,
});

apiClient.interceptors.request.use((request: any) => {
  const token = localStorage.authToken;
  if (token) {
    request.headers.Authorization = `Bearer ${localStorage.authToken}`;
    request.headers.AccessToken = token;
  }
  return request;
}, error => {
  Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => {
    return response
  },
  function (error) {
    if (error.response?.status && error.response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      store.dispatch(clearCurrentUser());
      window.location.href = "/auth/login"
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)
export default apiClient;
