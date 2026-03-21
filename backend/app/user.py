from .auth import verify_access_token, create_access_token
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import  AsyncSession
from fastapi import Depends, HTTPException, status
from typing import Annotated
from .db import User, get_session
from sqlalchemy import select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: Annotated[AsyncSession, Depends(get_session)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_access_token(token)
        user_id: int = payload.get("sub")
        if not user_id:
            raise credentials_exception

        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()   
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user        

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

