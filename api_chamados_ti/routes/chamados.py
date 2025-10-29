import os
from http import HTTPStatus

from datetime import datetime
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from api_chamados_ti.core.security import JWTBearer, get_current_user, require_privilegio
from api_chamados_ti.db.database import get_session
from api_chamados_ti.models.chamado import Chamado
from api_chamados_ti.models.user import User
from api_chamados_ti.crud.chamado import crud_chamado as crud
from api_chamados_ti.schemas.chamadoRequest import ChamadoRequest
from api_chamados_ti.schemas.chamadoResponse import ChamadoResponse
from api_chamados_ti.schemas.chamadosResponse import ChamadosResponse


router = APIRouter(prefix='/chamados', tags=['Chamados'])

UPLOAD_DIR = 'uploads/'

# Certifique-se de criar o diretório 'uploads' se ainda não existir
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get(
    '/',
    response_model=ChamadosResponse,
    dependencies=[Depends(JWTBearer())],
    status_code=HTTPStatus.OK
)
def listar_chamados(session: Session = Depends(get_session), offset: int = 1, limit: int = 10, search: str = ''):
    chamados = crud.get_chamados(session, offset=offset, limit=limit, search=search)
    total = crud.get_total_chamados(session, search=search)
    result = []
    for c in chamados:
        result.append({
            'id': c.id,
            'titulo': c.titulo,
            'unidade': c.unidade.nome if c.unidade else '—',
            'setor': c.setor,
            'modulo': c.modulo.nome if c.modulo else '—',
            'urgencia': c.urgencia,
            'descricao': c.descricao,
            'status': c.status.nome,
            'anexo': True if c.caminho_anexo else False,
            'data_abertura': c.data_abertura,
            'data_fechamento': c.data_fechamento,
            'solicitante': c.usuario.username if c.usuario else 'Desconhecido',
            'atendimentos': [
                {
                    'id': a.id,
                    'descricao': a.descricao,
                    'data_atendimento': a.data_atendimento,
                    'suporte': a.suporte.username if a.suporte else None,
                    'anexo': True if a.anexo else False
                }
                for a in (c.atendimentos or [])
            ]
        })
    return {
        'chamados': result,
        'total': total,
        'offset': offset,
        'limit': limit,
        'total_pages': (total + limit - 1) // limit
        }


@router.get('/{chamado_id}/anexo')
def get_anexo(chamado_id: int, session: Session = Depends(get_session)):
    anexo = crud.get_anexo_chamado(session, chamado_id)
    return FileResponse(path=anexo.get('caminho'), filename=f'anexo-chamado-{chamado_id}.{anexo.get('tipo')}')

@router.post(
    '/',
    dependencies=[Depends(JWTBearer())],
    status_code=HTTPStatus.CREATED
)
def criar_chamado(
    chamado: ChamadoRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_chamado = crud.insert_chamado(session, chamado, current_user.id)
    return {'chamado_id': new_chamado.id, 'message': f'Chamado #{new_chamado.id} aberto com sucesso'}


@router.post('/{chamado_id}/anexo', dependencies=[Depends(JWTBearer())], status_code=HTTPStatus.CREATED)
async def upload_anexo(
    chamado_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    chamado_db = await crud.insert_anexo_chamado(session, file, chamado_id)
    
    session.commit()

    return {'message': 'Arquivo enviado com sucesso'}


@router.patch(
        '/{chamado_id}/finalizar',
        dependencies=[Depends(JWTBearer()),
                    Depends(require_privilegio(['Administrador', 'Suporte']))],
        status_code=HTTPStatus.OK
              )
def finalizar_chamado(chamado_id: int,
                      session: Session = Depends(get_session)):
    
    chamado_db= crud.finalizar_chamado(session, chamado_id)

    return {
        'message': f'Chamado #{chamado_id} finalizado com sucesso',
        'data_fechamento': chamado_db.data_fechamento
    }
