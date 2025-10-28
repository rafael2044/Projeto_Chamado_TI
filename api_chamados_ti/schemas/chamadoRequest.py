from pydantic import BaseModel


class ChamadoRequest(BaseModel):
    titulo: str
    unidade: int
    setor: str
    modulo: int
    urgencia: str
    descricao: str
