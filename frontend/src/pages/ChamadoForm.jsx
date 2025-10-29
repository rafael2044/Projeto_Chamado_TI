import React, {useEffect, useState} from "react";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import ToastMessage from "../components/ToastMessage";
const ChamadoForm = () => {
  const [titulo, setTitulo] = useState("")
  const [unidade, setUnidade] = useState(1)
  const [setor, setSetor] = useState("")
  const [modulo, setModulo] = useState(1)
  const [urgencia, setUrgencia] = useState("Média")
  const [descricao, setDescricao] = useState("")
  const [anexo, setAnexo] = useState(null);
  const [unidades, setUnidades] = useState([])
  const [modulos, setModulos] = useState([])
  const [loading, setLoading] = useState(true);
    
  const [toast, setToast] = useState({
      show: false,
      message: "",
      type: "info",
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
          const res = await api.get("/unidade/");
          setUnidades(res.data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
    };
    const fetchModulos = async () => {
      try {
        const res = await api.get("/modulo/");
        setModulos(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchUnidades();
    fetchModulos();
  }, []);

  async function enviarAnexo(chamadoId, arquivo) {
      const formData = new FormData();
      formData.append("file", arquivo);
      try {
          console.log(arquivo)
          await api.post(`/chamados/${chamadoId}/anexo`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
      } catch (err) {
          console.error(err);
      }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post("/chamados/",
          {titulo, unidade, setor, modulo, urgencia, descricao}
        );
        const chamado_id = await response.data.chamado_id
        if (anexo){
          await enviarAnexo(chamado_id, anexo)
          setAnexo("")
        }
        showToast(response.data.message, 'success')
        setTitulo("")
        setUnidade(1)
        setSetor("")
        setModulo(1)
        setUrgencia("Média")
        setDescricao("")
    } catch (error) {
      console.error(error);
      showToast("Erro ao enviar chamado", "error")
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
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Abrir Chamado de T.I</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input type="text" name="titulo" value={titulo} onChange={(e)=>setTitulo(e.target.value)} className="form-control" required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Unidade</label>
                  <select name="unidade" value={unidade} onChange={(e)=>setUnidade(e.target.value)} className="form-select" required>
                      {unidades.map((u, index) => (
                          <option value={u.id} key={u.id}>{u.nome}</option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Setor</label>
                  <input type="text" name="setor" value={setor} onChange={(e)=>setSetor(e.target.value)} className="form-control" required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Modulo</label>
                  <select name="modulo" value={modulo} onChange={(e)=>setModulo(e.target.value)} className="form-select" required>
                      {modulos.map((m, index) => (
                          <option value={m.id} key={m.id}>{m.nome}</option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Urgência</label>
                  <select name="urgencia" value={urgencia} onChange={(e)=>setUrgencia(e.target.value)} className="form-select" required>
                    <option>Alta</option>
                    <option>Média</option>
                    <option>Baixa</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea name="descricao" value={descricao} onChange={(e)=>setDescricao(e.target.value)} className="form-control" rows="5" required />
                </div>
                  <input name="anexo" type="file" onChange={e => setAnexo(e.target.files[0])}/>
                <button type="submit" className="btn btn-primary w-100">Enviar Chamado</button>
              </form>
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

export default ChamadoForm;
