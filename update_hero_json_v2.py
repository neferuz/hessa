
import json
import os

file_path = "/Users/notferuz/Desktop/hessa-main/backend/hero_data.json"
try:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
    else:
        with open(file_path, "r") as f:
            data = json.load(f)

        if "slides" in data:
            for slide in data["slides"]:
                slide["buttonText"] = slide.get("buttonText", "Купить сейчас")
                slide["buttonText_uz"] = slide.get("buttonText_uz", "Sotib olish")
                slide["buttonText_en"] = slide.get("buttonText_en", "Shop Now")
        
        with open(file_path, "w") as f:
            json.dump(data, f, indent=4)
            print("Updated hero_data.json successfully with button text fields")
except Exception as e:
    print(f"Error: {e}")
