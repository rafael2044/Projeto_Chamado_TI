from http import HTTPStatus
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from api_chamados_ti.core.security import JWTBearer, require_privilegio
from api_chamados_ti.db.database import get_session
from api_chamados_ti.schemas.unidadeRequest import UnidadeRequest
from api_chamados_ti.schemas.unidadeResponse import UnidadeResponse
from api_chamados_ti.crud.unidade import crud_unidade as crud


router = APIRouter(prefix='/unidade', tags=['Unidade'])


@router.get(
        '/',
        dependencies=[Depends(JWTBearer())],
        response_model=list[UnidadeResponse],
        status_code=HTTPStatus.OK
)
def get_unidades(
    session: Session = Depends(get_session),
    offset: int = 1,
    limit: int = 100,
    search: str = ''):

    unidades = crud.get_unidades(session, offset, limit, search)
    result = []
    for u in unidades:
        result.append(UnidadeResponse.model_validate(u))

    return result


@router.post(
    '/',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    response_model=UnidadeResponse,
    status_code=HTTPStatus.CREATED
)
def create_unidade(unidade: UnidadeRequest, session: Session = Depends(get_session)):
    new_unidade = crud.insert_unidade(session, unidade)
    
    return UnidadeResponse.model_validate(new_unidade)


@router.delete(
    '/{unidade_id}',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    status_code=HTTPStatus.NO_CONTENT
)
def delete_unidade(unidade_id: int, session: Session = Depends(get_session)):
    crud.delete_unidade(session, unidade_id)

