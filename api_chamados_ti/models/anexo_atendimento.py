from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


from api_chamados_ti.db.database import Base
from api_chamados_ti.models.atendimento import Atendimento


class AnexoAtendimento(Base):
    __tablename__ = 'anexos_atendimento'

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    atendimento_id: Mapped[int] = mapped_column(ForeignKey('atendimentos.id'), nullable=False)
    caminho: Mapped[str] = mapped_column(nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False)
    atendimento: Mapped['Atendimento'] = relationship(back_populates='anexo')
