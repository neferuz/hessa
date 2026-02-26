from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ...core.database import get_db
from ...models.analysis import AnalysisRequest
from ...models.user import User
from ...schemas.analysis import AnalysisRequestCreate, AnalysisRequestUpdate, AnalysisRequestOut
from datetime import datetime

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/", response_model=AnalysisRequestOut)
async def create_analysis_request(
    request: AnalysisRequestCreate,
    db: AsyncSession = Depends(get_db)
):
    # Verify user exists
    user_result = await db.execute(select(User).filter(User.id == request.user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_request = AnalysisRequest(
        user_id=request.user_id,
        address=request.address or user.address,
        scheduled_date=request.scheduled_date
    )
    
    db.add(new_request)
    await db.commit()
    await db.refresh(new_request)
    return new_request

@router.get("/user/{user_id}", response_model=List[AnalysisRequestOut])
async def get_user_analysis_requests(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AnalysisRequest)
        .filter(AnalysisRequest.user_id == user_id)
        .order_by(AnalysisRequest.created_at.desc())
    )
    return result.scalars().all()

@router.get("/all", response_model=List[AnalysisRequestOut])
async def get_all_analysis_requests(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(AnalysisRequest).order_by(AnalysisRequest.created_at.desc())
    )
    return result.scalars().all()

@router.put("/{request_id}", response_model=AnalysisRequestOut)
async def update_analysis_request(
    request_id: int,
    update_data: AnalysisRequestUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(AnalysisRequest).filter(AnalysisRequest.id == request_id))
    db_request = result.scalars().first()
    
    if not db_request:
        raise HTTPException(status_code=404, detail="Analysis request not found")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    
    # If status is changing to 'completed', set completed_at
    if "status" in update_dict and update_dict["status"] == "completed" and db_request.status != "completed":
        db_request.completed_at = datetime.utcnow()
        
    for key, value in update_dict.items():
        setattr(db_request, key, value)
        
    await db.commit()
    await db.refresh(db_request)
    return db_request
