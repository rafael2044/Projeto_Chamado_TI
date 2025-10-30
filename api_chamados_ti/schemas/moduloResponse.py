from pydantic import BaseModel, ConfigDict


class ModuloResponse(BaseModel):
    model_config = ConfigDict(extra="ignore", from_attributes=True)

    id: int
    nome: str
