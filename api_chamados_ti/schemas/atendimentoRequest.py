from pydantic import BaseModel


class AtendimentoRequest(BaseModel):
    descricao: str
