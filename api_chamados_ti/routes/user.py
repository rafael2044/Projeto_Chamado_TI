from http import HTTPStatus

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from chamados_ti.core.security import JWTBearer, require_privilegio
from chamados_ti.db.database import get_session
from chamados_ti.schemas.userCreate import UserCreate
from chamados_ti.schemas.usersResponse import UsersResponse
from chamados_ti.schemas.userResponse import UserResponse
from chamados_ti.crud.user import crud_user as crud

router = APIRouter(prefix='/user', tags=['User'])


@router.get(
    '/',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    response_model=UsersResponse,
    status_code=HTTPStatus.OK
)
def listar_users(
    offset: int = 1,
    limit: int = 10,
    search: str = '',
    session: Session = Depends(get_session)
    ):
    
    skip = (offset - 1) * limit
    users = crud.get_users(session, skip, limit, search)
    total = crud.get_total_users(session, search)
    result = []
    for u in users:
        result.append({
            'id': u.id,
            'username': u.username,
            'privilegio': u.privilegio
        })
    
    return {
        'users': result,
        'total': total,
        'offset': offset,
        'limit': limit,
        'total_pages': (total + limit - 1) // limit
    }


@router.post(
    '/',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    response_model= UserResponse,
    status_code=HTTPStatus.CREATED
)
def create_user(
        user: UserCreate,
        session: Session = Depends(get_session),
):
    new_user = crud.insert_user(session, user)
    
    return {
        'id': new_user.id,
        'username': new_user.username,
        'privilegio': new_user.privilegio
    }
