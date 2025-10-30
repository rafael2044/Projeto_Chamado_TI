import { useEffect, useState } from "react";
import api from "../services/api";
import ToastMessage from "../components/ToastMessage";
import ChamadoItem from "../components/ChamadoItem";
import ModalAtendimento from "../components/ModalAtendimento";

const ITEMS_PER_PAGE = 3;

const Chamados = () => {
  //const [dataInfo, setDataInfo] = useState();
  const [data, setData] = useState({
    chamados: [],
    total: 0,
    offset: 0,
    limit: ITEMS_PER_PAGE,
    total_pages: 0
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info",
      });
  

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const res = await api.get(`/chamados/?offset=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${search}`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        showToast("Erro ao carregar Chamados", 'error')
        setLoading(false);
      }
    };

    fetchChamados();
  }, [currentPage, search]);
  
  const handleAtender = (chamadoId) => {
    const chamado = data.chamados.find((c) => c.id === chamadoId);
    setChamadoSelecionado(chamado);
    setModalAberto(true);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
    setChamadoSelecionado(null);
  };

  const handleSubmit = (chamadoId, formData) => {
    onSubmitAtendimento(chamadoId, formData);
    handleCloseModal();
  };
  
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset para página 1
  };

  const onSubmitAtendimento = async (idChamado, data)=>{
    setIsLoading(true);
    try {
      const response = await api.post(
        `/atendimento/${idChamado}`,
        data,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const new_atendimento = await response.data
      setData(prevData => ({
        ...prevData,
        chamados: prevData.chamados.map(
          chamado => chamado.id === idChamado
          ? 
          { 
            ...chamado, 
            status: 'Em andamento', 
            atendimentos: [...chamado.atendimentos, new_atendimento] 
          }
          : chamado
        )
        })
      )
      showToast("Atendimento registrado com sucesso", "success");
    } catch (error) {
      console.error(error);
      showToast("Erro ao registrar atendimento", "error")
    }finally{
      setIsLoading(false);
    }
  }

  const onFinalizar = async (chamadoId) => {
    setIsLoading(true);
    try {
      const response = await api.patch(
          `/chamados/${chamadoId}/finalizar`);
      showToast(`Chamado #${chamadoId} finalizado.`, "success")
      setData(prevData => ({
        ...prevData,
        chamados: prevData.chamados.map(
        chamado => chamado.id === chamadoId
        ? {
          ...chamado,
          status: 'Concluído',
          data_fechamento: response.data.data_fechamento
        }
        : chamado
        )
        })
      )
    } catch (error) {
      console.error(error);
      showToast("Aconteceu um erro ao tentar finalizar o chamado.", 'error');
    }finally{
      setIsLoading(false);
    }
  }

  const downloadAnexoAtendimento = async (atendimento_id) => {
    setIsLoading(true);
    try{
      const response = await api.get(
        `/atendimento/${atendimento_id}/anexo`, 
        {responseType: 'blob'});
      const blob = response.data;

      const contentDisposition = response.headers['content-disposition']; 
      
      let filename = 'anexo_atendimento'; // Nome padrão
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
          console.log("Filename extraído:", filename);
        } else {
          console.error("Não foi possível extrair o filename do header.");
        }
      }

      // ... (O resto do código para criar o link e clicar)
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);


    }catch(error){
      console.error(error)
      showToast("Erro ao baixar anexo", "error")
    }finally{
      setIsLoading(false);
    }
  }

  const downloadAnexoChamado = async (chamado_id) => {
    setIsLoading(true);
    try{
      const response = await api.get(
        `/chamados/${chamado_id}/anexo`, 
        {responseType: 'blob'});
      const blob = response.data;

      const contentDisposition = response.headers['content-disposition']; 
      
      let filename = 'anexo_atendimento'; // Nome padrão
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
          console.log("Filename extraído:", filename);
        } else {
          console.error("Não foi possível extrair o filename do header.");
        }
      }

      // ... (O resto do código para criar o link e clicar)
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);


    }catch(error){
      console.error(error)
      showToast("Erro ao baixar anexo", "error")
    }finally{
      setIsLoading(false);
    }
  }

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
      <h2 className="mb-4 text-center">Meus Chamados</h2>
      <div className="row mb-4">
        <div className="col-12">
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar chamados..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {data.chamados.length === 0 && !loading ? (
            <div className="text-center py-5 text-muted">
              {search ? 'Nenhum chamado encontrado' : 'Nenhum chamado cadastrado'}
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {data.chamados.map((chamado) => (
                <ChamadoItem
                  key={chamado.id}
                  chamado={chamado}
                  onAtender={handleAtender}
                  handlerFinalizar={onFinalizar}
                  handlerDownloadAnexo={downloadAnexoAtendimento}
                  handlerDownloadAnexoChamado = {downloadAnexoChamado}
                  isLoading = {isLoading}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

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
        Mostrando {data.chamados.length} de {data.total} chamados
        {search && ` (filtrados por: "${search}")`}
      </div>

      {chamadoSelecionado && (
        <ModalAtendimento
          show={modalAberto}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          chamado={chamadoSelecionado}
        />
      )}

      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        position="bottom-end"
      />
    </div>
  );
};

export default Chamados;
