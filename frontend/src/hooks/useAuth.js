// src/hooks/useAuth.js
import { getUserData } from "../services/auth";

const useAuth= ()=> {
  const user = getUserData();
  return {
    user,
    isAdmin: user?.privilegio === "Administrador",
    isSuporte: user?.privilegio === "Suporte",
    isUser: user?.privilegio === "Usuário",
  };
}

export default useAuth

