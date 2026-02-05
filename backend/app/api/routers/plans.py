from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ...core.database import get_db
from ...models.plan import Plan
from ...schemas.plan import PlanCreate, PlanRead, PlanUpdate

router = APIRouter(prefix="/plans", tags=["plans"])

@router.get("/", response_model=List[PlanRead])
async def get_plans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plan))
    plans = result.scalars().all()
    return plans

@router.get("/{plan_id}", response_model=PlanRead)
async def get_plan(plan_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.post("/", response_model=PlanRead)
async def create_plan(plan_data: PlanCreate, db: AsyncSession = Depends(get_db)):
    plan = Plan(**plan_data.model_dump())
    db.add(plan)
    await db.commit()
    await db.refresh(plan)
    return plan

@router.put("/{plan_id}", response_model=PlanRead)
async def update_plan(plan_id: int, plan_data: PlanUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    update_data = plan_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(plan, key, value)
    
    await db.commit()
    await db.refresh(plan)
    return plan

@router.delete("/{plan_id}")
async def delete_plan(plan_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    await db.delete(plan)
    await db.commit()
    return {"message": "Plan deleted successfully"}
