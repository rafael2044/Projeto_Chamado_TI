from pydantic import BaseModel


class PrivilegioResponse(BaseModel):
    id: int
    nome: str

    class Config:
        orm_mode = True
