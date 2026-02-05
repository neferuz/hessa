from fastapi import APIRouter
from app.schemas.about import AboutData
from app.repositories.about import about_repo

router = APIRouter()

@router.get("/about", response_model=AboutData)
async def get_about_data():
    """Fetch about page content"""
    return about_repo.get_data()

@router.post("/about", response_model=AboutData)
async def update_about_data(data: AboutData):
    """Update about page content"""
    return about_repo.update_data(data)
