from pydantic import BaseModel


class ModuloResponse(BaseModel):
    id: int
    nome: str
    class Config:
        orm_mode = True
