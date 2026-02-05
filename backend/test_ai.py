import asyncio
import httpx
import json

async def test_ai():
    api_key = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjFrYnhacFJNQGJSI0tSbE1xS1lqIn0.eyJ1c2VyIjoiYmo1MzAyNiIsInR5cGUiOiJhcGlfa2V5IiwiYXBpX2tleV9pZCI6IjdiZmQwMmQ4LTIzNzMtNDQ4NS1iYWI1LTBhYmM2MDExNTZjOSIsImlhdCI6MTc2OTg5MDg5M30.V55-H_xiCd34g91EqxRU_4P1MP07J32NczS-EkA-47FQj-7bW22uBMweI_BIMQVZlFA8AFjuDRpiBx7jbeMNuOTrwH0KQOhYOWAwDwiDb4iaYO-b8iZL57-7RFeSr8EWxHRE0QgdZ-dLnwusUAJrEu9jTDnyE9NOoq4By0uh2v3qpPuy1FcW438pIyMJEnB_heQf55OcbSzNx1-sR6tlH2PezaD7zL35GDwW4K-4SA1RHHox5YJDcG8M6sYtME9HGXj9CEfVbSf9zeTDZIlioqgHzFzyZ0dDAuqM-mEFmqXEvDdal7U4fCWthaB1pxPGWK-eja-IyP92CAmz8HJpFTLHwAaRd2XrlOabk3zbbcRDOJ0NNFxcG7sChWDefjgZrpmKW3BxM_PcVrQZ79EoX4xXQ1ZOZmkMJTfHOwwmJS_rF7KwR04YYbpTnM7A8F4MPYlFZOKJ_PvKOCUzOv3IzUDzElZKcONNexbsnVfiVqUe8vvVZB31FG-Y8NQtnjhD"
    endpoint = "https://agent.timeweb.cloud/api/v1/cloud-ai/agents/39ec1a05-e8f7-47c5-bfd9-c06e52c0d1a7/v1/chat/completions"
    system_prompt = "You are a helpful assistant. Return JSON object."
    user_message = "Hello"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    }
    
    print(f"Connecting to {endpoint}...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(endpoint, headers=headers, json=payload, timeout=20.0)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_ai())
