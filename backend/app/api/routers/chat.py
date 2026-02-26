from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Dict

from app.core.database import get_db
from app.models.product import Product
from app.services.ai_service import ai_service
from pydantic import BaseModel

router = APIRouter(prefix="/chat")

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]

class ChatResponse(BaseModel):
    content: str

@router.post("/messages", response_model=ChatResponse)
async def chat_messages(
    request: ChatRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    # Fetch products for context
    stmt = select(Product).options(selectinload(Product.category))
    result = await db.execute(stmt)
    db_products = result.scalars().all()
    
    products_list = []
    for p in db_products:
        p_dict = {
            "id": p.id,
            "name": p.name,
            "composition": p.composition,
            "description": p.description_short
        }
        products_list.append(p_dict)
        
    ai_response = await ai_service.chat(request.messages, products_list)
    
    return ChatResponse(content=ai_response)
