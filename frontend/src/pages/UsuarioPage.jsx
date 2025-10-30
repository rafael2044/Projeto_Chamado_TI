import {useEffect, useState} from "react";
import api from "../services/api";
import ToastMessage from "../components/ToastMessage";

const ITEMS_PER_PAGE = 5;

const UsuarioPage = () => {
    const [nome, setNome] = useState("")
    const [password, setPassword] = useState("");
    const [privilegio, setPrivilegio] = useState(1);
    const [privilegios, setPrivilegios] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        users: [],
        total: 0,
        offset: 0,
        limit: ITEMS_PER_PAGE,
        total_pages: 0
    })
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info",
    });

    const showToast = (message, type = "info") => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        const fetchPrivilegios = async () => {
            try {
                const res = await api.get("/privilegio/");
                setPrivilegios(res.data);
            } catch (err) {
                console.error(err);
                showToast("Erro ao carregar privilégios", "error")
            }
        };
        const fetchUsuarios = async () => {
            try {
                const res = await api.get(`/user/?offset=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${search}`);
                setData(res.data);
                setLoading(false)
            } catch (err) {
                console.error(err);
                setLoading(false)
                showToast("Erro ao carregar usuários", "error")
            }
        };
        fetchPrivilegios();
        fetchUsuarios();
    }, [currentPage, search]);

    const cadastrarUsuario = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post("/user/", {username: nome, password, privilegio});
            showToast("Usuário cadastrado com sucesso", "success")
            setNome('')
            setPassword('')
            setData(prevData => ({
                ...prevData,
                users: [...prevData.users, response.data]
            }))
        } catch (error) {
            console.error(error);
            showToast("Erro ao cadastrar usuário", "error")
        }finally{
            setIsLoading(false);
        }
    };

    const excluirUsuario = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta unidade?")) return;
        setIsLoading(false);
        try {
            await api.delete(`/user/${id}`);
            showToast("Usuário deletado com sucesso", "success")
            setData(prevData => ({
                ...prevData,
                users: prevData.users.filter(user => user.id !== id)
            }))
        } catch (error) {
            console.error("Erro ao excluir unidade:", error);
            showToast("Erro ao deletar usuário", "error")
        }finally{
            setIsLoading(true);
        }
    };

    const handlePageChange = (page) => {
    setCurrentPage(page);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
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
                <h3 className="text-center mb-4">Gerenciar Usuarios</h3>

                {/* Formulário */}
                <form className="row g-3 mb-4" onSubmit={cadastrarUsuario}>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nome do usuário"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={privilegio}
                            onChange={(e) => setPrivilegio(e.target.value)}
                        >
                            {privilegios.map((p) => (
                                <option value={p.id} key={p.id}>{p.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-1 d-grid">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            +
                        </button>
                    </div>
                </form>
                <div className="input-group mb-3">
                <span className="input-group-text">
                <i className="bi bi-search"></i>
                </span>
                <input
                type="text"
                className="form-control"
                placeholder="Buscar usuário..."
                value={search}
                onChange={handleSearch}
                />
                </div>
                {/* Lista de unidades */}
                <h5 className="mt-4 mb-3">Usuários cadastrados</h5>
                {data.users.length === 0 ? (
                    <p className="text-muted">Nenhum usuário cadastrado.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Privilégio</th>
                                <th className="text-end">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.users.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.username}</td>
                                    <td>{usuario.privilegio.nome}</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            disabled={isLoading}
                                            onClick={() => excluirUsuario(usuario.id)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            {data.total_pages > 1 && (
                <nav aria-label="Paginação" className="mt-4">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    </li>
                    {Array.from({ length: data.total_pages }, (_, i) => i + 1).map((page) => (
                    <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                    >
                        <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                        >
                        {page}
                        </button>
                    </li>
                    ))}
                    <li className={`page-item ${currentPage === data.total_pages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === data.total_pages}
                    >
                        Próxima
                    </button>
                    </li>
                </ul>
                </nav>
            )}

            <div className="text-center mt-3 text-muted small">
                Mostrando {data.users.length} de {data.total} chamados
                {search && ` (filtrados por: "${search}")`}
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

export default UsuarioPage;
