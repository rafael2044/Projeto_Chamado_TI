from pydantic import BaseModel


class UnidadeRequest(BaseModel):
    nome: str
