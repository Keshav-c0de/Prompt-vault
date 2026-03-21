from sqlalchemy import String, Integer , ForeignKey , func
from sqlalchemy.orm import mapped_column, relationship, Mapped, DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from datetime import datetime
from typing import Optional

DATABASE_URL = "sqlite+aiosqlite:///./vault.db"

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'
    
    id : Mapped[int]= mapped_column(Integer, primary_key=True, index=True)
    name : Mapped[str]= mapped_column(String,nullable=False)
    username : Mapped[str]= mapped_column(String, unique=True, index=True, nullable=False)
    password : Mapped[str]= mapped_column(String, index=True , nullable=False)
    prompts: Mapped[list["Prompt"]] = relationship(back_populates="owner" ,cascade="all, delete-orphan")

class Prompt(Base):
    __tablename__ = 'prompt_list'
    
    id : Mapped[int]= mapped_column(Integer, primary_key=True, index=True)
    title : Mapped[str]= mapped_column(String, nullable=False)
    description : Mapped[str]= mapped_column(String)
    prompt : Mapped[str]= mapped_column(String, nullable=False)
    timestamp : Mapped[datetime]= mapped_column(server_default=func.now())
    user_id : Mapped[int]= mapped_column(ForeignKey(User.id)) 
    owner: Mapped["User"] = relationship(back_populates="prompts")    

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit= False)

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

