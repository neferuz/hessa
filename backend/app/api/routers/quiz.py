from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ...core.database import get_db
from ...models.plan import Plan
from app.schemas.quiz import QuizData
from app.repositories.quiz import quiz_repo
from app.schemas.recommendation import RecommendationResult, RecommendationProduct
from app.services.ai_service import ai_service
from ...models.product import Product
from typing import Dict, List
import json

router = APIRouter()

@router.get("/quiz", response_model=QuizData)
async def get_quiz():
    """Fetch quiz questions"""
    return quiz_repo.get_quiz()

@router.post("/quiz", response_model=QuizData)
async def update_quiz(data: QuizData):
    """Update quiz questions"""
    return quiz_repo.update_quiz(data)

@router.post("/quiz/recommend", response_model=RecommendationResult)
async def get_recommendations(answers: Dict[str, str] = Body(...), db: AsyncSession = Depends(get_db)):
    # 1. Fetch all products with categories from DB for AI context
    stmt = select(Product).options(selectinload(Product.category))
    result = await db.execute(stmt)
    db_products = result.scalars().all()
    
    # Format for AI service
    products_list = []
    for p in db_products:
        p_dict = {
            "id": p.id,
            "name": p.name,
            "composition": p.composition,
            "description": p.description_short
        }
        products_list.append(p_dict)
        
    # 2. Enrich answers with question text and option text for AI
    quiz_data = quiz_repo.get_quiz()
    enriched_answers = {}
    
    for q in quiz_data.questions:
        user_val = answers.get(q.id)
        if user_val:
            if q.type == "options":
                if q.multiple:
                    selected_ids = user_val.split(',')
                    option_texts = [next((opt.text for opt in q.options if opt.id == sid), sid) for sid in selected_ids]
                    enriched_answers[q.label] = ", ".join(option_texts)
                else:
                    option_text = next((opt.text for opt in q.options if opt.id == user_val), user_val)
                    enriched_answers[q.label] = option_text
            else:
                enriched_answers[q.label] = user_val
                
    # 3. Get recommendation from AI
    ai_resp = await ai_service.get_recommendation(enriched_answers, products_list)
    product_id_raw = ai_resp.get("product_id")
    
    # CRITICAL: Ensure product_id is an integer for matching
    try:
        product_id = int(product_id_raw)
    except (ValueError, TypeError):
        product_id = 5 # Default to female set
        
    ai_reasoning = ai_resp.get("reasoning", "Персональный баланс микронутриентов для вашего организма.")
    
    # 4. Fetch recommended product from DB (already loaded in db_products)
    rec_product = next((p for p in db_products if p.id == product_id), db_products[0])

    # --- Helpers ---
    def get_product_by_name(name_query):
        if not name_query: return None
        name_query = name_query.lower().replace("+", " ").strip()
        # Find product where our query is in name or name is in query
        for p in db_products:
            p_name = p.name.lower().replace("+", " ").strip()
            if name_query in p_name or p_name in name_query:
                return p
        return None

    def resolve_image(img_data, product_name=""):
        if not img_data or img_data == "/product_bottle.png":
            # Smart fallbacks for Hessa based on product names
            name_lower = product_name.lower()
            if "женск" in name_lower:
                return "/female_set.png"
            if "мужск" in name_lower:
                return "/male_set.png"
            if "похуден" in name_lower or "метаболизм" in name_lower:
                return "/weight_set.png"
            if "энерг" in name_lower:
                return "/energy_capsules.png"
            return "/product_bottle.png"
            
        if isinstance(img_data, list) and img_data:
            return img_data[0]
        if isinstance(img_data, str):
            if img_data.startswith("["):
                try:
                    parsed = json.loads(img_data)
                    return parsed[0] if parsed and isinstance(parsed, list) else img_data
                except:
                    pass
            return img_data
        return "/product_bottle.png"

    main_image = resolve_image(rec_product.images, rec_product.name)

    # 5. Fetch subscription plans
    plans_result = await db.execute(select(Plan))
    all_plans = plans_result.scalars().all()
    
    subscription_plans = []
    for plan in all_plans:
        try:
            months = int(''.join(filter(str.isdigit, plan.title)))
        except ValueError:
            months = 1
            
        discount = 0
        if plan.old_price and plan.old_price > plan.price:
            discount = int(round((plan.old_price - plan.price) / plan.old_price * 100))

        subscription_plans.append({
            "months": months,
            "price": plan.price,
            "discount": discount,
            "title": plan.title,
            "items": plan.items or f"Курс на {months} {'месяц' if months == 1 else 'месяца'}"
        })
    
    # 6. Prepare products list for frontend
    recommendation_products = []
    
    if rec_product.composition:
        # It's a set - show its core components as actual products
        items_to_process = []
        if isinstance(rec_product.composition, dict):
            items_to_process = list(rec_product.composition.items())
        elif isinstance(rec_product.composition, list):
            items_to_process = [(item.get("name", "Компонент"), item.get("ingredients", [])) for item in rec_product.composition]

        for i, (comp_name, comp_data) in enumerate(items_to_process):
            # Handle new structure vs old
            if isinstance(comp_data, dict):
                ingredients = comp_data.get("ingredients", [])
                comp_image = comp_data.get("image")
            else:
                ingredients = comp_data
                comp_image = None

            matched_p = get_product_by_name(comp_name)
            
            # Format ingredients list for display
            details_str = ""
            if isinstance(ingredients, list):
                details_str = ", ".join([ing.get("component", "") for ing in ingredients if ing.get("component")])
            
            # Resolve image: prioritizing comp_image
            final_image = comp_image if comp_image else (resolve_image(matched_p.images, matched_p.name) if matched_p else "/static/vitamins-1.png")

            if matched_p:
                # Use real product data
                recommendation_products.append(
                    RecommendationProduct(
                        id=matched_p.id,
                        name=matched_p.name,
                        price=0,
                        category=matched_p.category.name if matched_p.category else "Витамины",
                        image=final_image,
                        details=details_str or matched_p.description_short,
                        composition_data=ingredients if isinstance(ingredients, list) else None
                    )
                )
            else:
                # Fallback labels if no match
                recommendation_products.append(
                    RecommendationProduct(
                        id=rec_product.id * 1000 + i,
                        name=comp_name,
                        price=0,
                        category="В наборе",
                        image=final_image,
                        details=details_str,
                        composition_data=ingredients if isinstance(ingredients, list) else None
                    )
                )
    else:
        # It's a single product - add it and recommend others
        recommendation_products.append(
            RecommendationProduct(
                id=rec_product.id,
                name=rec_product.name,
                price=int(rec_product.sale_price),
                category=rec_product.category.name if rec_product.category else "Основной продукт",
                image=main_image
            )
        )
        
        # Add basic complementary products
        basics = [1, 3, 4] # Multivitamins, Mg, Omega-3
        for b_id in basics:
            if b_id != rec_product.id:
                bp = next((p for p in db_products if p.id == b_id), None)
                if bp:
                    recommendation_products.append(
                        RecommendationProduct(
                            id=bp.id,
                            name=bp.name,
                            price=0,
                            category="Рекомендуем",
                            image=resolve_image(bp.images, bp.name)
                        )
                    )
            
    # Extract stats from AI response
    stats_data = ai_resp.get("stats")
    recommendation_stats = None
    if stats_data:
        try:
            from app.schemas.recommendation import RecommendationStats
            recommendation_stats = RecommendationStats(**stats_data)
        except Exception as e:
            print(f"Stats validation error: {e}")
            pass

    return RecommendationResult(
        title=rec_product.name,
        description=ai_reasoning,
        image=main_image, 
        products=recommendation_products,
        subscription_plans=subscription_plans,
        stats=recommendation_stats
    )
