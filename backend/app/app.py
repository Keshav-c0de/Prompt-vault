import asyncio
from fastapi import FastAPI, Depends , HTTPException, Form
from fastapi.security import OAuth2PasswordBearer ,OAuth2PasswordRequestForm
from typing import Annotated
from .db import create_db_and_tables, get_session, Prompt, User
from .schema import UserRead , PromptCreate , PromptUpdate, UserCreate, Token, PromptRead
from sqlalchemy.ext.asyncio import  AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import select, insert, update, delete
from .auth import hash_password, verify_password, create_access_token
from .user import get_current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan= lifespan)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.post("/login")
async def login(OAuth2_form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Annotated[AsyncSession, Depends(get_session)]):
        query = select(User).where(User.username == OAuth2_form_data.username)
        response = await session.execute(query)
        user = response.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        if not verify_password(OAuth2_form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        access_token_expires = 30
        access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
        return Token(access_token = access_token, token_type = "bearer")
    
@app.post("/register")
async def register(user_data: Annotated[UserCreate,Form()], session: AsyncSession = Depends(get_session)):
    try:
        query = select(User).where(User.username == user_data.username)
        response =await session.execute(query)
        user_exist = response.scalar_one_or_none()
        if user_exist:
            raise HTTPException(status_code=400, detail="already registered")

        hashed_pwt =hash_password(user_data.password)
        new_user = User(
            name= user_data.name,
            username= user_data.username,
            password= hashed_pwt
        )
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/prompts")
async def get_prompts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    try:
        prompts = select(Prompt).where(Prompt.user_id == current_user.id)
        result = await session.execute(prompts)
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/create" , response_model=PromptCreate)
async def create_prompt(prompt: PromptCreate, session: AsyncSession = Depends(get_session), current_user: User= Depends(get_current_user)):
    try:
        #new_prompt = model_dump(**prompt)
        new_prompt = Prompt(
            title= prompt.title,
            description= prompt.description,
            prompt= prompt.prompt,
            user_id= current_user.id
        )
        session.add(new_prompt)
        await session.commit()
        await session.refresh(new_prompt)
        return new_prompt
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

@app.delete("/delete/{prompt_id}", status_code=204)
async def delete_prompt( prompt_id: int,session: AsyncSession = Depends(get_session), current_user: User= Depends(get_current_user)):
    try:
        prompt =select(Prompt).where(Prompt.id == prompt_id,Prompt.user_id == current_user.id)
        result = await session.execute(prompt)
        prompt_data = result.scalar_one_or_none()
        if not prompt_data:
            raise HTTPException(status_code=404, detail="Prompt not found")
        await session.delete(prompt_data)
        await session.commit()
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/update/{prompt_id}" ,response_model =PromptUpdate)
async def update_prompt( prompt_id: int, updated_prompt: PromptUpdate, session: AsyncSession = Depends(get_session), current_user: User= Depends(get_current_user)):
    try:
        prompt =select(Prompt).where(Prompt.id == prompt_id, Prompt.user_id == current_user.id)
        result = await session.execute(prompt)
        prompt_data = result.scalar_one_or_none()
        if not prompt_data:
            raise HTTPException(status_code=404, detail="Prompt not found")

        update_dict = updated_prompt.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(prompt_data, key, value)

        await session.commit()
        await session.refresh(prompt_data)
        return prompt_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))