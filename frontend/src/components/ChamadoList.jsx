import { useState } from "react";
import ChamadoItem from "./ChamadoItem";
import ModalAtendimento from "./ModalAtendimento";

function ChamadoList({ chamados, onSubmitAtendimento, onFinalizar }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  const handleAtender = (chamadoId) => {
    const chamado = chamados.find((c) => c.id === chamadoId);
    setChamadoSelecionado(chamado);
    setModalAberto(true);
  };

  const handleFinalizar = (chamadoId) => {
    const confirmacao = window.confirm("Deseja realmente finalizar este chamado?");
    if (!confirmacao) return;
    onFinalizar(chamadoId)
  }

  const handleCloseModal = () => {
    setModalAberto(false);
    setChamadoSelecionado(null);
  };

  const handleSubmit = (chamadoId, formData) => {
    onSubmitAtendimento(chamadoId, formData); // envia para a API
    handleCloseModal();
  };

  return (
    <div className="container mt-4">
      {chamados.map((chamado) => (
        <ChamadoItem
          key={chamado.id}
          chamado={chamado}
          onAtender={handleAtender}
          onFinalizar={handleFinalizar}
        />
      ))}

      {chamadoSelecionado && (
        <ModalAtendimento
          show={modalAberto}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          chamado={chamadoSelecionado}
        />
      )}
    </div>
  );
}

export default ChamadoList;
