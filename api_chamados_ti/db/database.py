from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session


from api_chamados_ti.core.settings import Settings


engine = create_engine(
    Settings().DATABASE_URL
)
Base = declarative_base()


def get_session():
    with Session(engine) as session:
        yield session
