from datetime import datetime

from pydantic import BaseModel


class AtendimentoResponse(BaseModel):
    id: int
    suporte: str
    descricao: str
    data_atendimento: datetime
    anexo: bool = False
    class Config:
        orm_mode = True
