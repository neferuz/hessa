
import json

file_path = "backend/content_data.json"
try:
    with open(file_path, "r") as f:
        data = json.load(f)

    diff = data.get("difference", [])
    if len(diff) >= 6:
        diff[0]["image"] = "https://i.pinimg.com/1200x/61/3b/8e/613b8e0a364a7b11aea705cdc1c52cdf.jpg"
        diff[1]["image"] = "https://i.pinimg.com/736x/4c/d1/59/4cd1593a97579fb2163701e3d701fa95.jpg"
        diff[2]["image"] = "https://i.pinimg.com/1200x/39/b3/88/39b388b8fcfa39f846d540a4b6f166f4.jpg"
        diff[3]["image"] = "https://i.pinimg.com/736x/b9/88/79/b98879cff9c13acf7236db5696489614.jpg"
        diff[4]["image"] = "https://i.pinimg.com/1200x/0e/9a/30/0e9a301f572ee577ab4adf8ca2370f3f.jpg"
        diff[5]["image"] = "https://i.pinimg.com/736x/3b/69/6c/3b696c917be980793b0cf628b4c24f53.jpg"
    
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)
        print("Restored Pinterest URLs in content_data.json successfully")
except Exception as e:
    print(f"Error: {e}")
