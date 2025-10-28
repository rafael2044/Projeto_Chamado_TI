from sqlalchemy import select, func, inspect, update
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi import HTTPException
from fastapi import UploadFile
from http import HTTPStatus
import os


from api_chamados_ti.schemas.chamadoRequest import ChamadoRequest
from api_chamados_ti.models.chamado import Chamado

UPLOAD_DIR = 'uploads/'

class CRUDChamado:

    def get_chamados(
            self,
            session: Session,
            offset: int = 1,
            limit: int = 10,
            search: str = ''
        ) -> list[Chamado]:
        
        skip = (offset - 1) * limit
        smtm = (
            select(Chamado)
            .options(joinedload(Chamado.usuario),
                    selectinload(Chamado.atendimentos),
                    joinedload(Chamado.unidade),
                    joinedload(Chamado.modulo),
                    joinedload(Chamado.status))
            .offset(skip).limit(limit).order_by(Chamado.status_id)
        )

        if search:
            smtm = (select(Chamado).where(
                Chamado.titulo.ilike(f'%{search}%')
            )
            .options(joinedload(Chamado.usuario),
                    selectinload(Chamado.atendimentos),
                    joinedload(Chamado.unidade),
                    joinedload(Chamado.modulo),
                    joinedload(Chamado.status))
            .offset(skip).limit(limit).order_by(Chamado.status_id)
            )
        
    
        return session.scalars(smtm).all()
    
    def get_total_chamados(self, session: Session, search: str = ''):
        smtm = select(Chamado)
        if search:
            smtm = (select(Chamado).where(Chamado.titulo.ilike(f'%{search}%')))

        total = session.execute(select(func.count()).select_from(smtm)).scalar()
        return total

    def get_chamado_by_id(self, session: Session, chamado_id: int) -> Chamado:
        chamado_db = session.scalars(select(Chamado).where(Chamado.id == chamado_id)).first()
        if not chamado_db:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail='Chamado não existe'
            )

        return chamado_db
    
    def exists_chamado(self, session: Session, chamado_id: int) -> bool:
        chamado_db = session.scalars(
            select(Chamado)
            .where(Chamado.id == chamado_id)).first()
        if not chamado_db:
            return False
        return True
    
    def insert_chamado(self, session: Session, chamado: ChamadoRequest, user_id: int) -> Chamado:
        novo_chamado = Chamado(
            titulo=chamado.titulo,
            unidade_id=chamado.unidade,
            setor=chamado.setor,
            modulo_id=chamado.modulo,
            urgencia=chamado.urgencia,
            descricao=chamado.descricao,
            usuario_id=user_id,
            status_id = 1
        )
        session.add(novo_chamado)
        session.commit()
        session.refresh(novo_chamado)
        return novo_chamado


    def update_chamado(self, session:Session, chamado_id, chamado_update: dict) -> Chamado:
        chamado_db = self.get_chamado_by_id(session, chamado_id)
        mapper = inspect(Chamado)
        valid_keys = {c.key for c in mapper.column_attrs}
        filtered_data = {k: v for k, v in chamado_update.items() if k in valid_keys}

        if not filtered_data:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail='Erro ao tentar atualizar chamado'
            )
        
        smtm = (update(Chamado)
                .where(Chamado.id == chamado_id)
                .values(**filtered_data)
                .execution_options(synchronize_session=False))

        try:
            result = session.execute(smtm)
            session.commit()
            session.refresh(chamado_db)
                
        except Exception as e:
            session.rollback()
            raise e
        return chamado_db

    async def insert_anexo_chamado(self, session: Session, file: UploadFile, chamado_id:int):
        chamado_db = self.get_chamado_by_id(session, chamado_id)
        # Verifica extensão permitida
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail='Formato de arquivo não permitido')

        # Define o caminho para salvar
        save_path = os.path.join(UPLOAD_DIR, f'chamado_{chamado_id}_{file.filename}')

        # Salva o arquivo
        with open(save_path, 'wb') as f:
            content = await file.read()
            f.write(content)

        chamado_db.caminho_anexo = save_path
        chamado_db.tipo_anexo = file_ext
        
        return chamado_db

    def get_anexo_chamado(self, session: Session, chamado_id: int) -> dict:
        chamado_db = self.get_chamado_by_id(session, chamado_id)

        if not os.path.isfile(chamado_db.caminho_anexo):
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail="Arquivo não existe"
            )
        
        return {
            "caminho": chamado_db.caminho_anexo,
            "tipo": chamado_db.tipo_anexo
        }

crud_chamado = CRUDChamado()