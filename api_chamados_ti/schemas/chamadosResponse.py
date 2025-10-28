from pydantic import BaseModel
from typing import List

from api_chamados_ti.schemas.chamadoResponse import ChamadoResponse

class ChamadosResponse(BaseModel):
    chamados: List[ChamadoResponse]
    total: int
    offset: int
    limit: int
    total_pages: int