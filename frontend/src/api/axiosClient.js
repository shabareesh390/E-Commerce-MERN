import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // required for refresh token cookie
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        
        useAuthStore.getState().setCredentials(useAuthStore.getState().user, data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        
        return axiosClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
