from pwdlib import PasswordHash
from jose import jwt, JWTError
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone 
import os

load_dotenv()
secret_key = os.getenv("SECRET_KEY")
hashers = PasswordHash.recommended()

def hash_password(password):
    return hashers.hash(password)

def verify_password(password, hashed):
    return hashers.verify(password, hashed)

def create_access_token(data: dict, expires_delta: int| None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta or 15)

    to_encode.update({"exp":int(expire.timestamp())})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm="HS256")
    return encoded_jwt

def verify_access_token(token: str):
    try:
        decoded_jwt = jwt.decode(token, secret_key, algorithms=["HS256"])
        return decoded_jwt
    except Exception as e:
        return None