
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from api_chamados_ti.core.security import JWTBearer, require_privilegio
from api_chamados_ti.db.database import get_session
from api_chamados_ti.models.privilegio import Privilegio
from api_chamados_ti.schemas.privilegioResponse import PrivilegioResponse

router = APIRouter(prefix='/privilegio', tags=['Privilegio'])


@router.get(
    '/',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    response_model=list[PrivilegioResponse]
)
def listar_privilegios(session: Session = Depends(get_session)):
    sql = select(Privilegio)
    privilegios = session.scalars(sql).all()

    return privilegios
