from fastapi import APIRouter
from app.schemas.content import ContentData
from app.repositories.content import content_repo

router = APIRouter()

@router.get("/content", response_model=ContentData)
async def get_content():
    """Fetch additional main page content (ticker, benefits)"""
    return content_repo.get_content()

@router.post("/content", response_model=ContentData)
async def update_content(data: ContentData):
    """Update additional main page content"""
    return content_repo.update_content(data)
