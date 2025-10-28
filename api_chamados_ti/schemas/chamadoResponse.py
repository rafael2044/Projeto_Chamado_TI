from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from api_chamados_ti.schemas.atendimentoResponse import AtendimentoResponse


class ChamadoResponse(BaseModel):
    id: int
    titulo: str
    unidade: str
    setor: str
    modulo: str
    urgencia: str
    descricao: str
    status: str
    anexo: bool
    data_abertura: datetime
    data_fechamento: Optional[datetime] = None
    solicitante: str
    atendimentos: Optional[list[AtendimentoResponse]] = []

    class Config:
        orm_mode = True
