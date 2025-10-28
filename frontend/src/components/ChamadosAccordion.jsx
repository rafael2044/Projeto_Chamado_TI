import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ChamadosAccordion = ({ chamados }) => {
  return (
    <div className="accordion" id="chamadosAccordion">
      {chamados.map((c, index) => (
        <div className="accordion-item" key={c.id}>
          <h2 className="accordion-header" id={`heading${index}`}>
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${index}`}
              aria-expanded="false"
              aria-controls={`collapse${index}`}
            >
              <div className="d-flex justify-content-between w-100">
                <span><strong>{c.titulo}</strong></span>
                <span>
                  {new Date(c.data_abertura).toLocaleString()} | {c.unidade} | {c.setor}
                </span>
              </div>
            </button>
          </h2>

          <div
            id={`collapse${index}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading${index}`}
            data-bs-parent="#chamadosAccordion"
          >
            <div className="accordion-body">
              <p><strong>Módulo:</strong> {c.modulo}</p>
              <p>
                <strong>Urgência:</strong>{" "}
                <span
                  className={`badge ${
                    c.urgencia === "Alta"
                      ? "bg-danger"
                      : c.urgencia === "Média"
                      ? "bg-warning text-dark"
                      : "bg-success"
                  }`}
                >
                  {c.urgencia}
                </span>
              </p>
              <p><strong>Usuário:</strong> {c.solicitante}</p>
              <p><strong>Descrição:</strong> {c.descricao}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChamadosAccordion;
