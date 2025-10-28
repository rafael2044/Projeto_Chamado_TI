from sqlalchemy import select, func
from sqlalchemy.orm import Session 
from fastapi import HTTPException, UploadFile, File
from http import HTTPStatus
import os

from api_chamados_ti.models.atendimento import Atendimento
from api_chamados_ti.models.anexo_atendimento import AnexoAtendimento
from api_chamados_ti.crud.chamado import crud_chamado

UPLOAD_DIR = 'uploads/'

class CRUDAtendimento:

    def get_atendimentos(
            self,
            session: Session,
            offset: int = 1,
            limit: int = 100,
            search: str = ''
        ) -> list[Atendimento]:
        skip = (offset - 1) * limit
        smtm = select(Atendimento).offset(skip).limit(limit)
        if search:
            smtm = (select(Atendimento)
                    .where(Atendimento.nome.ilike(f'%{search}%'))
                    .offset(skip)
                    .limit(limit))
        
        return session.scalars(smtm).all()
    
    def get_total_atendimentos(self, session: Session, search: str = '') -> int:
        smtm = select(Atendimento)
        if search:
            smtm = (select(Atendimento).where(Atendimento.descricao.ilike(f'%{search}%')))

        total = session.execute(select(func.count()).select_from(smtm)).scalar()
        return total

    def get_atendimento_by_id(self, session: Session, atendimento_id: int) -> Atendimento:
        atendimento_db = session.scalars(select(Atendimento).where(Atendimento.id == atendimento_id)).first()
        if not atendimento_db:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail='Unidade não existe'
            )

        return atendimento_db
    
    def exists_atendimento(self, session: Session, descricao: str) -> bool:
        atendimento_db = session.scalars(
            select(Atendimento)
            .where(Atendimento.descricao == descricao)).first()
        if not atendimento_db:
            return False
        return True
    
    async def insert_atendimento(self, session: Session,
                           descricao: str,
                           chamado_id: int, 
                           suporte_id: int,
                           anexo: UploadFile | None = File(None)) -> Atendimento:
        chamado_db = crud_chamado.get_chamado_by_id(session, chamado_id)
        if chamado_db.status_id != 3:
            
            new_atendimento = Atendimento(
                descricao=descricao,
                chamado_id=chamado_db.id,
                suporte_id=suporte_id,
            )
            session.add(new_atendimento)
            session.commit()
            session.refresh(new_atendimento)
            if anexo:
                new_anexo = await self.insert_anexo_atendimento(session, new_atendimento.id,
                                                chamado_id, anexo)
                session.refresh(new_atendimento)

            if chamado_db.status_id == 1:
                crud_chamado.update_chamado(session, chamado_id,
                                            {"status_id": 2})
            return new_atendimento
        else:   
            raise HTTPException(
                status_code=HTTPStatus.CONFLICT,
                detail="O chamado já está finalizado!"
            )
    
    async def insert_anexo_atendimento(self, 
                                 session: Session,
                                 atendimento_id: int, 
                                 chamado_id: int,
                                 anexo: UploadFile | None = File(None)):
        
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
        file_ext = os.path.splitext(anexo.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail='Formato de arquivo não permitido')

        save_path = os.path.join(UPLOAD_DIR, f'chamado_{chamado_id}_{anexo.filename}')

        with open(save_path, 'wb') as f:
            content = await anexo.read()
            f.write(content)

        new_anexo = AnexoAtendimento(
            atendimento_id=atendimento_id,
            caminho=save_path,
            tipo=file_ext
        )  
        session.add(new_anexo)
        session.commit()
    
        return new_anexo

    def get_anexo_atendimento(self, session: Session, atendimento_id: int) -> AnexoAtendimento:
        anexo = session.scalar(
            select(AnexoAtendimento).where(AnexoAtendimento.atendimento_id == atendimento_id)
            )
        
        if not os.path.isfile(anexo.caminho):
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail="Arquivo não existe"
            )
        
        return anexo
       

crud_atendimento = CRUDAtendimento()