import axios from "axios";

console.log(process.env.REACT_APP_API_URL)

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 🔐 Intercepta todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para renovar token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refresh_token");

    // Se o token expirou e ainda não tentamos atualizar
    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${process.env.API_URL}/refresh`, { refresh_token: refreshToken });
        if (res.status === 401){
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
        }else {
            localStorage.setItem("access_token", res.data.access_token);
            api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
            return api(originalRequest); // reenvia requisição original
        }
      } catch (err) {
        console.error("Falha ao renovar token:", err);
      }
    }
    return Promise.reject(error);
  }
);


export default api;
