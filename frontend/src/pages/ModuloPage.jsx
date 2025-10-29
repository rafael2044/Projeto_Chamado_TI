import React, {useEffect, useState} from "react";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import ToastMessage from "../components/ToastMessage";

const ModuloPage = () => {
    const [nome, setNome] = useState("")
    const [modulos, setModulos] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info",
    });

    const showToast = (message, type = "info") => {
        setToast({ show: true, message, type });
    };
    

    useEffect(() => {
        const fetchModulos = async () => {
            try {
                const res = await api.get("/modulo/");
                setModulos(res.data);
                setLoading(false)
            } catch (err) {
                console.error(err);
                showToast("Erro ao carregar modulos", "error")
                setLoading(false)
            }
        };
        fetchModulos();
    }, []);

    const cadastrarModulo = async (e) => {

        e.preventDefault();
        try {
            const response = await api.post("/modulo/", {nome});
            showToast("Novo modulo cadastrado com sucesso.", "success")
            setNome('')
            setModulos([...modulos, response.data])
        } catch (error) {
            console.error(error);
            showToast("Erro ao cadastrar novo modulo", "error")
        }
    };

    const excluirModulo = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta modulo?")) return;


        try {
            await api.delete(`/modulo/${id}`);
            showToast("Modulo deletado com sucesso", "success")
        } catch (error) {
            console.error("Erro ao excluir unidade:", error);
            showToast("Erro ao deletar modulo", "error")
        }
    };

    if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <h3 className="text-center mb-4">Gerenciar Modulos</h3>

                {/* Formulário */}
                <form className="row g-3 mb-4" onSubmit={cadastrarModulo}>
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nome da unidade"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2 d-grid">
                        <button type="submit" className="btn btn-primary">
                            Cadastrar
                        </button>
                    </div>
                </form>

                {/* Lista de unidades */}
                <h5 className="mt-4 mb-3">Modulos cadastrados</h5>
                {modulos.length === 0 ? (
                    <p className="text-muted">Nenhuma modulo cadastrado.</p>
                ) : (
                    <ul className="list-group">
                        {modulos.map((modulo) => (
                            <li
                                key={modulo.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <span>{modulo.nome}</span>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => excluirModulo(modulo.id)}
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
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

export default ModuloPage;
