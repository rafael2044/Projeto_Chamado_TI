from fastapi import FastAPI
from sqlalchemy.exc import OperationalError
from fastapi.middleware.cors import CORSMiddleware

from chamados_ti.db.database import Base, engine
from chamados_ti.routes import (
    atendimento,
    auth,
    chamados,
    modulo,
    privilegio,
    unidade,
    user,
)
from chamados_ti.core.exception_handlers import db_connection_exception_handler

Base.metadata.create_all(bind=engine)


app = FastAPI(title='FastAPI Login System')

app.add_exception_handler(OperationalError, db_connection_exception_handler)

origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
    expose_headers=["Content-Disposition"]
)

app.include_router(auth.router)
app.include_router(chamados.router)
app.include_router(unidade.router)
app.include_router(modulo.router)
app.include_router(atendimento.router)
app.include_router(privilegio.router)
app.include_router(user.router)
