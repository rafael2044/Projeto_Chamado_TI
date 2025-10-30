import { useState } from "react";
import api from "../services/api";
import ToastMessage from "../components/ToastMessage";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
      setToast({ show: true, message, type });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { username, password });
      showToast("Registro realizado com sucesso.", "success")
      setUsername("");
      setPassword("");
    } catch (error) {
      if (error.response.status === 409){
        showToast("Usuário já cadastrado", "warning")
      }else {
        showToast("Erro ao registrar usuário", "error")
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Registrar Usuário</h2>

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Usuário</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Cadastrar
                </button>
              </form>

              <div className="text-center mt-3">
                <a href="/login">Já possui uma conta? Faça login</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastMessage
      show={toast.show}
      message={toast.message}
      type={toast.type}
      onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      position="bottom-end" // ou top-end, bottom-start, etc.
      />
    </div>
  );
}

export default Register;
