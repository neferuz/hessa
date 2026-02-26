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

class TrustBlock(BaseModel):
    title: str
    description: str

class RecommendationStats(BaseModel):
    rating: float
    reviews_count: int
    effectiveness: int
    stat1_label: str
    stat1_value: int
    stat2_label: str
    stat2_value: int
    stat3_label: str
    stat3_value: int
    trust_blocks: List[TrustBlock] = []

class RecommendationResult(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    products: List[RecommendationProduct]
    subscription_plans: List[dict] # {months: 1, price: 100, discount: 0}
    stats: Optional[RecommendationStats] = None
