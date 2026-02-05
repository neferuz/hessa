from fastapi import APIRouter
from app.schemas.hero import HeroData
from app.repositories.hero import hero_repo

router = APIRouter()

@router.get("/hero", response_model=HeroData)
async def get_hero_content():
    """Fetch the main page hero slider data"""
    return hero_repo.get_hero_data()

@router.post("/hero", response_model=HeroData)
async def update_hero_content(data: HeroData):
    """Update the main page hero slider data"""
    return hero_repo.update_hero_data(data)
