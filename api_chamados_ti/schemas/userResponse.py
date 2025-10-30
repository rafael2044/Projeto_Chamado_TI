from pydantic import BaseModel, ConfigDict


from api_chamados_ti.schemas.privilegioResponse import PrivilegioResponse


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore", from_attributes=True)

    id: int
    username: str
    privilegio: PrivilegioResponse
