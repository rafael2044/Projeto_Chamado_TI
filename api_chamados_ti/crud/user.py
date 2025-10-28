from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from http import HTTPStatus


from api_chamados_ti.schemas.userCreate import UserCreate
from api_chamados_ti.schemas.userRegister import UserRegister
from api_chamados_ti.models.user import User
from api_chamados_ti.core.security import hash_password


class CRUDUser:

    def get_users(
            self,
            session: Session,
            skip: int = 0,
            limit: int = 10,
            search: str = ''
        ) -> list[User]:
        try:
            smtm = select(User).options(joinedload(User.privilegio)).offset(skip).limit(limit)
            if search:
                smtm = (select(User).where(User.username.ilike(f'%{search}%'))
                        .options(joinedload(User.privilegio)).offset(skip).limit(limit))
            users = session.scalars(smtm).all()
            return users
        except Exception as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail="Erro no servidor"
            )
        
    
    def get_total_users(self, session: Session, search: str = ''):
        try:
            smtm = select(User)
            if search:
                smtm = (select(User).where(User.username.ilike(f'%{search}%')))

            total = session.execute(select(func.count()).select_from(smtm)).scalar()
            return total
        except Exception as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail="Erro no servidor"
            )

    def get_user_by_id(self, session: Session, user_id: int) -> User:
        user_db = session.scalar(select(User).where(User.id == user_id))
        if not user_db:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail='Usuário não existe'
            )

        return user_db
    
    def get_user_by_username(self, session: Session, username: str) -> User:
        user_db = session.scalar(select(User).where(User.username == username))
        if not user_db:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail='Usuário não existe'
            )
        return user_db
    
    def register_user(self, session: Session, user: UserRegister) -> User:
        if self.user_exists(session, user.username):
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT,
                detail='Nome de usuário já existe'
            )

        new_user = User(
            username = user.username,
            hashed_password = hash_password(user.password),
            privilegio_id = 1
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user

    def insert_user(self, session: Session, user: UserCreate):
        user_db = session.scalar(select(User).where(User.username == user.username))
        if user_db:
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT,
                detail='Nome de usuário já existe'
            )

        new_user = User(
            username=user.username,
            hashed_password=hash_password(user.password),
            privilegio_id = user.privilegio
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    
    def delete_user(self, session:Session, user_id: int):
        user_db = self.get_user_by_id(user_id)
        
        session.delete(user_db)
        session.commit

    def user_exists(self, session:Session, username):
        user_db = session.scalar(select(User).where(User.username == username))
        if not user_db:
            return False
        return True

crud_user = CRUDUser()