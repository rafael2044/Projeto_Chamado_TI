from pydantic import BaseModel


class UnidadeResponse(BaseModel):
    id: int
    nome: str
    class Config:
        orm_mode = True
