from pydantic import BaseModel
from typing import List, Optional

class HeroTag(BaseModel):
    label: str
    x: float
    y: float

class HeroSlide(BaseModel):
    id: int
    headline: str
    headline_uz: Optional[str] = ""
    headline_en: Optional[str] = ""
    descriptionLeft: str
    descriptionLeft_uz: Optional[str] = ""
    descriptionLeft_en: Optional[str] = ""
    descriptionRight: str
    descriptionRight_uz: Optional[str] = ""
    descriptionRight_en: Optional[str] = ""
    buttonText: Optional[str] = "Купить сейчас"
    buttonText_uz: Optional[str] = "Sotib olish"
    buttonText_en: Optional[str] = "Shop Now"
    tags: List[HeroTag]
    image: str
    color: str

class HeroData(BaseModel):
    slides: List[HeroSlide]
