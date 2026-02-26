
import json

file_path = "backend/hero_data.json"
try:
    with open(file_path, "r") as f:
        data = json.load(f)

    if "slides" in data:
        for slide in data["slides"]:
            if "buttonText" not in slide:
                slide["buttonText"] = "Купить сейчас"
                slide["buttonText_uz"] = "Sotib olish"
                slide["buttonText_en"] = "Shop Now"
    
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)
        print("Updated hero_data.json successfully with button text fields")
except Exception as e:
    print(f"Error: {e}")
