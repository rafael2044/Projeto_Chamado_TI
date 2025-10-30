from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session


from api_chamados_ti.core.security import JWTBearer, require_privilegio
from api_chamados_ti.db.database import get_session
from api_chamados_ti.models.privilegio import Privilegio
from api_chamados_ti.schemas.privilegioResponse import PrivilegioResponse
from api_chamados_ti.crud.privilegios import crud_privilegio as crud


router = APIRouter(prefix='/privilegio', tags=['Privilegio'])


@router.get(
    '/',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    response_model=list[PrivilegioResponse]
)
def get_privilegios(session: Session = Depends(get_session)):
    privilegios = crud.get_privilegios(session)
    result = []
    for p in privilegios:
        result.append(PrivilegioResponse.model_validate(p))

    return result
