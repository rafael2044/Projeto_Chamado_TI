from sqlalchemy.orm import Session
from sqlalchemy import select

from api_chamados_ti.models.privilegio import Privilegio

class CRUDPrivilegio:

    def get_privilegios(self, session: Session) -> list[Privilegio]:
        privilegios = session.scalars(select(Privilegio)).all()
        return privilegios
    
crud_privilegio = CRUDPrivilegio()