from pydantic import BaseModel

from api_chamados_ti.schemas.privilegioResponse import PrivilegioResponse


class UserResponse(BaseModel):
    id: int
    username: str
    privilegio: PrivilegioResponse

    class Config:
        orm_mode = True
