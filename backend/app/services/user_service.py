from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.user_repository import UserRepository
from ..schemas.user import UserCreate, UserUpdate
from ..models.user import User

class UserService:
    def __init__(self, db: AsyncSession):
        self.repository = UserRepository(db)

    async def create_user(self, user_data: UserCreate):
        # Business logic here (e.g. password hashing, validation)
        # For demo, just simple creation
        import random
        import string
        
        # Generate unique referral code
        prefix = "HESSA-"
        while True:
            code = f"{prefix}{''.join(random.choices(string.ascii_uppercase + string.digits, k=6))}"
            # Check if code already exists
            existing = await self.repository.get_by_referral_code(code)
            if not existing:
                break

        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=user_data.password,  # In real app: hash_password(user_data.password)
            referral_code=code,
            tokens=1500 # Give initial tokens to new users
        )
        return await self.repository.create(db_user)

    async def get_user(self, user_id: int):
        return await self.repository.get_by_id(user_id)

    async def update_user(self, user_id: int, user_data: UserUpdate):
        update_dict = user_data.model_dump(exclude_unset=True)
        return await self.repository.update(user_id, update_dict)

    async def get_all_users(self):
        return await self.repository.get_all()
