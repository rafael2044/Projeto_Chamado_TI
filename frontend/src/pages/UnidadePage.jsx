import {useEffect, useState} from "react";
import api from "../services/api";
import ToastMessage from "../components/ToastMessage";

const UnidadePage = () => {
    const [nome, setNome] = useState("");
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({
      show: false,
      message: "",
      type: "info",
    });

    useEffect(() => {
        const fetchUnidades = async () => {
            try {
                const res = await api.get("/unidade/");
                setUnidades(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false)
            }
        };
        fetchUnidades();
    }, []);

    const showToast = (message, type = "info") => {
        setToast({ show: true, message, type });
    };

    const cadastrarUnidade = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const response = await api.post("/unidade/", {nome});
            showToast("Nova unidade cadastrada", "success")
            setNome('')
            setUnidades([...unidades, response.data])
        } catch (error) {
            console.error(error);
            showToast("Erro ao cadastrar nova unidade", "error")
        }finally{
            setIsLoading(false);
        }
    };

    const excluirUnidade = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta unidade?")) return;
        setIsLoading(true);

        try {
            await api.delete(`/unidade/${id}`);
            showToast("Unidade deletada com sucesso", "success")
            setUnidades(prevUnidades => (prevUnidades.filter(unidade => unidade.id !== id)))
        } catch (error) {
            console.error("Erro ao excluir unidade:", error);
            showToast("Erro ao deletar unidade", "error")
        }finally{
            setIsLoading(false);
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
                <h3 className="text-center mb-4">Gerenciar Unidades</h3>

                {/* Formulário */}
                <form className="row g-3 mb-4" onSubmit={cadastrarUnidade}>
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
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            Cadastrar
                        </button>
                    </div>
                </form>

                {/* Lista de unidades */}
                <h5 className="mt-4 mb-3">Unidades cadastradas</h5>
                {unidades.length === 0 ? (
                    <p className="text-muted">Nenhuma unidade cadastrada.</p>
                ) : (
                    <ul className="list-group">
                        {unidades.map((unidade) => (
                            <li
                                key={unidade.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <span>{unidade.nome}</span>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={isLoading}
                                    onClick={() => excluirUnidade(unidade.id)}
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

export default UnidadePage;
