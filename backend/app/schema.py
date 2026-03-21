from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str 
    username: EmailStr

class UserRead(UserBase):
    id: int

class UserCreate(UserBase):
    password: str = Field(...,min_length = 8)

class Token(BaseModel):
    access_token: str
    token_type: str

class PromptUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    prompt : Optional[str]

class PromptBase(BaseModel):
    title: str
    description: str
    prompt: str

class PromptCreate(PromptBase):
    pass


class PromptRead(PromptBase):
    id: int
    updated_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str