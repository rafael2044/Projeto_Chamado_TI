import os
from http import HTTPStatus
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from zoneinfo import ZoneInfo

from api_chamados_ti.core.security import JWTBearer, get_current_user, require_privilegio
from api_chamados_ti.db.database import get_session
from api_chamados_ti.models.user import User
from api_chamados_ti.schemas.atendimentoResponse import AtendimentoResponse
from api_chamados_ti.crud.atendimento import crud_atendimento as crud


router = APIRouter(prefix='/atendimento', tags=['Atendimento'])

UPLOAD_DIR = 'uploads/'
TARGET_TIMEZONE = ZoneInfo("America/Sao_Paulo")


os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    '/{chamado_id}',
    dependencies=[Depends(JWTBearer()), Depends(require_privilegio(['Administrador', 'Suporte']))],
    response_model=AtendimentoResponse,
    status_code=HTTPStatus.OK
)
async def insert_atendimento(
    chamado_id: int,
    descricao: str = Form(...),
    anexo: UploadFile | None = File(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_atendimento = await crud.insert_atendimento(
        session, descricao, chamado_id, current_user.id, anexo)
    return {
        'id': new_atendimento.id,
        'suporte': current_user.username,
        'descricao': new_atendimento.descricao,
        'data_atendimento': new_atendimento.data_atendimento.astimezone(TARGET_TIMEZONE),
        'anexo': True if new_atendimento.anexo else False
    }


@router.get('/{atendimento_id}/anexo',
           dependencies=[Depends(JWTBearer())]
           )
def get_anexo_atendimento(atendimento_id: int, session: Session = Depends(get_session)):
    
    anexo = crud.get_anexo_atendimento(session, atendimento_id)
    
    return FileResponse(path=anexo.caminho, filename=f'anexo-{anexo.id}-{anexo.atendimento.suporte.username}.{anexo.tipo}')
    