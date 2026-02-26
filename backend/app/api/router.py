from fastapi import APIRouter
from .routers import user, hero, upload, content, products, quiz, auth, order, employees, plans, chat

api_router = APIRouter()
api_router.include_router(user.router)
api_router.include_router(hero.router, tags=["hero"])
api_router.include_router(upload.router, tags=["upload"])
api_router.include_router(content.router, tags=["content"])
api_router.include_router(products.router)
api_router.include_router(quiz.router, tags=["quiz"])
api_router.include_router(auth.router)
api_router.include_router(order.router)
api_router.include_router(employees.router)
api_router.include_router(chat.router, tags=["chat"])
from .routers import stats
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
from .routers import about, analysis
api_router.include_router(about.router, tags=["about"])
api_router.include_router(plans.router)
api_router.include_router(analysis.router)