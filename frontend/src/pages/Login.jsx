import React, { useState } from "react";
import api from "../services/api";
import ToastMessage from "../components/ToastMessage";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
      setToast({ show: true, message, type });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/login", form);
      const {access_token, refresh_token} = res.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      showToast("Login realizado com sucesso", "success")
      window.location.href = "/chamados";
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      showToast(`Erro no login: ${err}`, "error")
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-3">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuário</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Senha</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>Entrar</button>
                
              </form>
              {isLoading && (
                <div className="alert alert-info d-flex align-items-center" role="alert">
                  {/* Spinner do Bootstrap */}
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Validando credenciais, por favor aguarde...</span>
                </div>
              )}
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
};

export default Login;
