from pydantic import BaseModel
from typing import List

from chamados_ti.schemas.userResponse import UserResponse

class UsersResponse(BaseModel):
    users: List[UserResponse]
    total: int
    limit: int
    offset: int
    total_pages: int