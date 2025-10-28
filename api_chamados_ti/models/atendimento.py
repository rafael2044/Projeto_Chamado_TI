from datetime import datetime

from sqlalchemy import ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api_chamados_ti.db.database import Base
from api_chamados_ti.models.user import User


class Atendimento(Base):
    __tablename__ = 'atendimentos'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    chamado_id: Mapped[int] = mapped_column(ForeignKey('chamado.id'))
    suporte_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    descricao: Mapped[str] = mapped_column(Text, nullable=False)
    data_atendimento: Mapped[datetime] = mapped_column(default=datetime.now())

    suporte: Mapped['User'] = relationship(back_populates='atendimentos')
    chamado: Mapped['Chamado'] = relationship(back_populates='atendimentos')
    anexo: Mapped['AnexoAtendimento'] = relationship(back_populates='atendimento')


from api_chamados_ti.models.chamado import Chamado
from api_chamados_ti.models.anexo_atendimento import AnexoAtendimento