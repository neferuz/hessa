from pydantic import BaseModel
from typing import List, Optional

class QuizOption(BaseModel):
    id: str
    text: str
    text_uz: Optional[str] = ""
    text_en: Optional[str] = ""

class QuizQuestion(BaseModel):
    id: str
    section: str
    section_uz: Optional[str] = ""
    section_en: Optional[str] = ""
    label: str
    label_uz: Optional[str] = ""
    label_en: Optional[str] = ""
    type: str  # "input" or "options"
    placeholder: Optional[str] = ""
    placeholder_uz: Optional[str] = ""
    placeholder_en: Optional[str] = ""
    options: Optional[List[QuizOption]] = []
    gender: str = "both"  # "both", "male", "female"
    multiple: bool = False # Multiple choice support
    order: int  # Порядок отображения

class QuizData(BaseModel):
    questions: List[QuizQuestion]
