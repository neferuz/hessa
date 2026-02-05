import httpx
import json
from typing import Dict, Any, List

class AIService:
    def __init__(self):
        self.api_key = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjFrYnhacFJNQGJSI0tSbE1xS1lqIn0.eyJ1c2VyIjoiYmo1MzAyNiIsInR5cGUiOiJhcGlfa2V5IiwiYXBpX2tleV9pZCI6IjdiZmQwMmQ4LTIzNzMtNDQ4NS1iYWI1LTBhYmM2MDExNTZjOSIsImlhdCI6MTc2OTg5MDg5M30.V55-H_xiCd34g91EqxRU_4P1MP07J32NczS-EkA-47FQj-7bW22uBMweI_BIMQVZlFA8AFjuDRpiBx7jbeMNuOTrwH0KQOhYOWAwDwiDb4iaYO-b8iZL57-7RFeSr8EWxHRE0QgdZ-dLnwusUAJrEu9jTDnyE9NOoq4By0uh2v3qpPuy1FcW438pIyMJEnB_heQf55OcbSzNx1-sR6tlH2PezaD7zL35GDwW4K-4SA1RHHox5YJDcG8M6sYtME9HGXj9CEfVbSf9zeTDZIlioqgHzFzyZ0dDAuqM-mEFmqXEvDdal7U4fCWthaB1pxPGWK-eja-IyP92CAmz8HJpFTLHwAaRd2XrlOabk3zbbcRDOJ0NNFxcG7sChWDefjgZrpmKW3BxM_PcVrQZ79EoX4xXQ1ZOZmkMJTfHOwwmJS_rF7KwR04YYbpTnM7A8F4MPYlFZOKJ_PvKOCUzOv3IzUDzElZKcONNexbsnVfiVqUe8vvVZB31FG-Y8NQtnjhD"
        self.endpoint = "https://agent.timeweb.cloud/api/v1/cloud-ai/agents/39ec1a05-e8f7-47c5-bfd9-c06e52c0d1a7/v1/chat/completions"
        self.system_prompt = """
Вы — экспертный ассистент-нутрициолог HESSA. Ваша задача — глубоко проанализировать результаты викторины и подобрать наиболее подходящий продукт из нашего каталога.

ИНСТРУКЦИИ:
1. Тщательно изучите ответы пользователя: его цели, уровень стресса, качество сна, иммунитет и физическую активность.
2. Обратите внимание на пол пользователя (Женский/Мужской) — это критично для выбора специализированных наборов (ID 5 и ID 6).
3. Если главная цель — похудение или метаболизм, рассмотрите набор для похудения (ID 7).
4. Пишите СТРОГО 1-2 предложения.
5. Максимум 30 слов. Тон: премиальный, научный, лаконичный, заботливый.
6. В reasoning объясните, на какой конкретно дефицит или потребность пользователя (на основе его ответов) направлен выбранный продукт.
7. НЕ перечисляйте исходные данные пользователя в ответе.

СПИСОК НАБОРОВ:
{products_context}

ФОРМАТ ОТВЕТА (JSON):
{{
  "product_id": ID_набора, 
  "reasoning": "Ваша краткая профессиональная рекомендация"
}}
"""

    chat_system_prompt = """
Вы — дружелюбный и компетентный AI-консультант бренда HESSA.
Ваша цель — помогать пользователям с вопросами о здоровье, нутрициологии и наших продуктах.

КОНТЕКСТ ПРОДУКТОВ HESSA:
{products_context}

ИНСТРУКЦИИ:
1. Отвечайте кратко, полезно и с заботой (tone of voice: warm, professional, premium).
2. Если пользователь спрашивает о проблеме (сон, стресс, вес), предлагайте подходящий продукт из списка выше.
3. Если вопрос не связан с продуктами HESSA или здоровьем, вежливо верните тему к здоровью.
4. Используйте смадзи умеренно.
5. Не выдумывайте продукты, которых нет в списке.
"""

    async def get_recommendation(self, quiz_answers: Dict[str, Any], products: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Form products context for AI
        ctx = ""
        for p in products:
            desc = p.get("description") or ""
            comp_str = ""
            if p.get("composition"):
                comp_str = f" Состав: {json.dumps(p['composition'], ensure_ascii=False)}"
            
            ctx += f"ID: {p['id']}, Название: {p['name']},{comp_str} Описание: {desc}\n"
        
        user_message = f"Ответы пользователя: {json.dumps(quiz_answers, ensure_ascii=False)}"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messages": [
                {"role": "system", "content": self.system_prompt.format(products_context=ctx)},
                {"role": "user", "content": user_message}
            ]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.endpoint, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                content = data['choices'][0]['message']['content']
                
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                return json.loads(content)
            except Exception as e:
                print(f"AI Service Error: {e}")
                return {
                    "product_id": 5, 
                    "reasoning": "Базовая рекомендация на основе ваших данных."
                }

    async def chat(self, messages: List[Dict[str, str]], products: List[Dict[str, Any]]) -> str:
        ctx = ""
        for p in products:
            desc = p.get("description") or ""
            comp_str = ""
            if p.get("composition"):
                comp_str = f" Состав: {json.dumps(p['composition'], ensure_ascii=False)}"
            ctx += f"ID: {p['id']}, Название: {p['name']},{comp_str} Описание: {desc}\n"
            
        system_message = {"role": "system", "content": self.chat_system_prompt.format(products_context=ctx)}
        
        # Prepend system message
        full_messages = [system_message] + messages
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messages": full_messages
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.endpoint, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                return data['choices'][0]['message']['content']
            except Exception as e:
                print(f"AI Chat Error: {e}")
                return "Извините, сейчас я не могу ответить. Пожалуйста, попробуйте позже."

ai_service = AIService()
