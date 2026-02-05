from pydantic import BaseModel
from typing import List, Optional

class RecommendationProduct(BaseModel):
    id: int
    name: str
    price: float
    image: Optional[str] = None
    category: str
    details: Optional[str] = None
    composition_data: Optional[List[dict]] = None

class RecommendationResult(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    products: List[RecommendationProduct]
    subscription_plans: List[dict] # {months: 1, price: 100, discount: 0}
