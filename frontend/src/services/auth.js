import {jwtDecode} from "jwt-decode";

export function getToken() {
  return localStorage.getItem("access_token");
}

export function getUserData() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (e) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}