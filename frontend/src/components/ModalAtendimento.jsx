import { useState } from "react";

function ModalAtendimento({ show, onClose, onSubmit, chamado }) {
  const [descricao, setDescricao] = useState("");
  const [anexo, setAnexo] = useState(null);

  if (!show) return null; // não renderiza o modal se estiver oculto

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("descricao", descricao);
    if (anexo) {
      formData.append("anexo", anexo);
    }
    onSubmit(chamado.id, formData);
    setDescricao("");
    setAnexo(null);
  };

  return (
    <div
      className="modal show fade"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              Realizar Atendimento - Chamado #{chamado.id}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Descrição do Atendimento</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Anexo (opcional)</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setAnexo(e.target.files[0])}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                Enviar Atendimento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalAtendimento;
