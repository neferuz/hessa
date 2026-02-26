import json
import os
from typing import List
from app.schemas.hero import HeroData, HeroSlide

DATA_FILE = "hero_data.json"

# Default Initial Data (Mirrors current frontend)
DEFAULT_DATA = {
    "slides": [
        {
            "id": 1,
            "headline": "HEALTHCARE. REAL RESULTS",
            "descriptionLeft": "Take the step towards a healthier, more vibrant life – shop now and fuel your body with the best!",
            "descriptionRight": "Our products are carefully formulated with science-backed ingredients, free from artificial additives.",
            "tags": [
                {"label": "Premium Ingredients", "x": -45, "y": 70},
                {"label": "Non-GMO", "x": 45, "y": 70},
                {"label": "Allergen-Free", "x": 45, "y": 30}
            ],
            "image": "/vitamins-2.png",
            "color": "#FFFFFF",
            "buttonText": "Купить сейчас",
            "buttonText_uz": "Sotib olish",
            "buttonText_en": "Shop Now"
        },
        {
            "id": 2,
            "headline": "MUSCLE. PURE POWER",
            "descriptionLeft": "Maximize your recovery and build strength with our premium protein formula.",
            "descriptionRight": "Fast-absorbing whey isolate with essential amino acids for optimal muscle growth.",
            "tags": [
                {"label": "25g Protein", "x": -45, "y": 60},
                {"label": "BCAA Included", "x": 45, "y": 60},
                {"label": "Fast Absorb", "x": 45, "y": 20}
            ],
            "image": "/vitamins-2.png",
            "color": "#FFFFFF",
            "buttonText": "Купить сейчас",
            "buttonText_uz": "Sotib olish",
            "buttonText_en": "Shop Now"
        },
        {
            "id": 3,
            "headline": "FOCUS. MENTAL CLARITY",
            "descriptionLeft": "Unlock your full cognitive potential with our advanced nootropic blend.",
            "descriptionRight": "Clinically proven ingredients to enhance memory, focus, and mental processing speed.",
            "tags": [
                {"label": "No Caffeine", "x": -45, "y": 65},
                {"label": "100% Focus", "x": 45, "y": 65},
                {"label": "Vit B12+B6", "x": 45, "y": 25}
            ],
            "image": "/vitamins-3.png",
            "color": "#FFFFFF",
            "buttonText": "Купить сейчас",
            "buttonText_uz": "Sotib olish",
            "buttonText_en": "Shop Now"
        }
    ]
}

class HeroRepository:
    def __init__(self):
        self.file_path = DATA_FILE
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as f:
                json.dump(DEFAULT_DATA, f, indent=4)

    def get_hero_data(self) -> HeroData:
        if not os.path.exists(self.file_path):
            self._ensure_file_exists()
        
        with open(self.file_path, "r") as f:
            data = json.load(f)
        
        # Ensure all slides have translation fields for the button
        updated = False
        if "slides" in data:
            for slide in data["slides"]:
                if "buttonText" not in slide:
                    slide["buttonText"] = "Купить сейчас"
                    updated = True
                if "buttonText_uz" not in slide:
                    slide["buttonText_uz"] = "Sotib olish"
                    updated = True
                if "buttonText_en" not in slide:
                    slide["buttonText_en"] = "Shop Now"
                    updated = True
        
        if updated:
            with open(self.file_path, "w") as f:
                json.dump(data, f, indent=4)
                
        return HeroData(**data)

    def update_hero_data(self, data: HeroData) -> HeroData:
        with open(self.file_path, "w") as f:
            json.dump(data.model_dump(), f, indent=4)
        return data

hero_repo = HeroRepository()
