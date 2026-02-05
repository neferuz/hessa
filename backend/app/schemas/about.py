from pydantic import BaseModel
from typing import List, Optional

class AboutHero(BaseModel):
    heading: str
    heading_uz: str = ""
    heading_en: str = ""
    
    desc_left: str
    desc_left_uz: str = ""
    desc_left_en: str = ""
    
    desc_right: str
    desc_right_uz: str = ""
    desc_right_en: str = ""
    
    image: str

class AboutMetric(BaseModel):
    id: str
    title: str
    title_uz: str = ""
    title_en: str = ""
    
    text: str
    text_uz: str = ""
    text_en: str = ""

class AboutValue(BaseModel):
    id: str
    title: str
    title_uz: str = ""
    title_en: str = ""
    
    desc: str
    desc_uz: str = ""
    desc_en: str = ""
    
    icon: str 

class AboutData(BaseModel):
    hero: AboutHero
    metrics: List[AboutMetric]
    values: List[AboutValue]
