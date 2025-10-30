from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AtendimentoResponse(BaseModel):
    model_config = ConfigDict(extra="ignore", from_attributes=True)

    id: int
    suporte: str
    descricao: str
    data_atendimento: datetime
    anexo: bool = False
    
