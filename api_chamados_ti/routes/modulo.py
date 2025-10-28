from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from chamados_ti.core.security import JWTBearer, require_privilegio
from chamados_ti.db.database import get_session
from chamados_ti.schemas.moduloRequest import ModuloRequest
from chamados_ti.schemas.moduloResponse import ModuloResponse
from chamados_ti.crud.modulo import crud_modulo as crud


router = APIRouter(prefix='/modulo', tags=['Modulo'])


@router.get(
    '/',
    dependencies=[Depends(JWTBearer())],
    response_model=list[ModuloResponse],
    status_code=HTTPStatus.OK
)
def listar_modulos(
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 20,
    search: str = ''):

    result = []
    modulos = crud.get_modulos(session, offset=offset, limit=limit, search=search)

    for m in modulos:
        result.append({
            'id': m.id,
            'nome': m.nome
        })

    return result


@router.post(
    '/',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    response_model=ModuloResponse,
    status_code=HTTPStatus.CREATED
)
def create_modulo(
        modulo: ModuloRequest,
        session: Session = Depends(get_session),
):
    new_modulo = crud.insert_modulo(session, modulo)

    return {
        'id': new_modulo.id,
        'nome': new_modulo.nome
    }


@router.delete(
    '/{modulo_id}',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrator', 'Suporte']))],
    status_code=HTTPStatus.NO_CONTENT
)
def delete_modulo(modulo_id: int, session: Session = Depends(get_session)):
    crud.delete_modulo(session, modulo_id)

