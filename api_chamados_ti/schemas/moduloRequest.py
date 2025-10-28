from pydantic import BaseModel


class ModuloRequest(BaseModel):
    nome: str
