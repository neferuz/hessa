from pydantic import BaseModel
from typing import List, Optional

class TickerItem(BaseModel):
    text: str
    text_uz: Optional[str] = ""
    text_en: Optional[str] = ""

class BenefitItem(BaseModel):
    title: str
    title_uz: Optional[str] = ""
    title_en: Optional[str] = ""
    text: str
    text_uz: Optional[str] = ""
    text_en: Optional[str] = ""

class DifferenceItem(BaseModel):
    id: int
    title: str
    title_uz: Optional[str] = ""
    title_en: Optional[str] = ""
    desc: str
    desc_uz: Optional[str] = ""
    desc_en: Optional[str] = ""
    full_text: Optional[str] = ""
    full_text_uz: Optional[str] = ""
    full_text_en: Optional[str] = ""
    image: str
    product_ids: List[int] = []

class ProductItem(BaseModel):
    id: int
    name: str
    name_uz: Optional[str] = ""
    name_en: Optional[str] = ""
    category: str
    category_uz: Optional[str] = ""
    category_en: Optional[str] = ""
    price: str
    image: str
    isNew: bool = False

class FooterData(BaseModel):
    slogan: str
    slogan_uz: Optional[str] = ""
    slogan_en: Optional[str] = ""
    phone: str
    email: str
    instagram: str
    telegram: str
    location: str
    location_uz: Optional[str] = ""
    location_en: Optional[str] = ""
    copyright_text: str

class CompaniesData(BaseModel):
    # Hero
    hero_badge: str
    hero_badge_uz: Optional[str] = ""
    hero_badge_en: Optional[str] = ""
    hero_title: str
    hero_title_uz: Optional[str] = ""
    hero_title_en: Optional[str] = ""
    hero_desc: str
    hero_desc_uz: Optional[str] = ""
    hero_desc_en: Optional[str] = ""
    hero_image: str = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=50&w=1200&auto=format&fit=crop"
    button_text: str
    button_text_uz: Optional[str] = ""
    button_text_en: Optional[str] = ""

    # Benefits
    benefits_title: str
    benefits_title_uz: Optional[str] = ""
    benefits_title_en: Optional[str] = ""
    
    benefit_1_title: str
    benefit_1_title_uz: Optional[str] = ""
    benefit_1_title_en: Optional[str] = ""
    benefit_1_text: str
    benefit_1_text_uz: Optional[str] = ""
    benefit_1_text_en: Optional[str] = ""

    benefit_2_title: str
    benefit_2_title_uz: Optional[str] = ""
    benefit_2_title_en: Optional[str] = ""
    benefit_2_text: str
    benefit_2_text_uz: Optional[str] = ""
    benefit_2_text_en: Optional[str] = ""

    benefit_3_title: str
    benefit_3_title_uz: Optional[str] = ""
    benefit_3_title_en: Optional[str] = ""
    benefit_3_text: str
    benefit_3_text_uz: Optional[str] = ""
    benefit_3_text_en: Optional[str] = ""

    # Case Study
    case_badge: str
    case_badge_uz: Optional[str] = ""
    case_badge_en: Optional[str] = ""
    case_title: str
    case_title_uz: Optional[str] = ""
    case_title_en: Optional[str] = ""
    case_image: str = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=40&w=800&auto=format&fit=crop"
    
    case_step_1_text: str
    case_step_1_text_uz: Optional[str] = ""
    case_step_1_text_en: Optional[str] = ""
    
    case_step_2_text: str
    case_step_2_text_uz: Optional[str] = ""
    case_step_2_text_en: Optional[str] = ""

    case_step_3_text: str
    case_step_3_text_uz: Optional[str] = ""
    case_step_3_text_en: Optional[str] = ""

    # Product Showcase
    products_badge: str
    products_badge_uz: Optional[str] = ""
    products_badge_en: Optional[str] = ""
    products_title: str
    products_title_uz: Optional[str] = ""
    products_title_en: Optional[str] = ""
    
    product_1_name: str
    product_1_name_uz: Optional[str] = ""
    product_1_name_en: Optional[str] = ""
    product_1_goal: str
    product_1_goal_uz: Optional[str] = ""
    product_1_goal_en: Optional[str] = ""
    product_1_image: str = "/images/antistress.png"

    product_2_name: str
    product_2_name_uz: Optional[str] = ""
    product_2_name_en: Optional[str] = ""
    product_2_goal: str
    product_2_goal_uz: Optional[str] = ""
    product_2_goal_en: Optional[str] = ""
    product_2_image: str = "/images/immunity.png"

    product_3_name: str
    product_3_name_uz: Optional[str] = ""
    product_3_name_en: Optional[str] = ""
    product_3_goal: str
    product_3_goal_uz: Optional[str] = ""
    product_3_goal_en: Optional[str] = ""
    product_3_image: str = "/images/beauty.png"

    product_4_name: str
    product_4_name_uz: Optional[str] = ""
    product_4_name_en: Optional[str] = ""
    product_4_goal: str
    product_4_goal_uz: Optional[str] = ""
    product_4_goal_en: Optional[str] = ""
    product_4_image: str = "/images/productivity.png"

    # Audience
    audience_badge: str
    audience_badge_uz: Optional[str] = ""
    audience_badge_en: Optional[str] = ""
    audience_title: str
    audience_title_uz: Optional[str] = ""
    audience_title_en: Optional[str] = ""
    
    audience_1_name: str
    audience_1_name_uz: Optional[str] = ""
    audience_1_name_en: Optional[str] = ""
    audience_1_goal: str
    audience_1_goal_uz: Optional[str] = ""
    audience_1_goal_en: Optional[str] = ""
    audience_1_image: str = "/images/audience_colleagues.png"

    audience_2_name: str
    audience_2_name_uz: Optional[str] = ""
    audience_2_name_en: Optional[str] = ""
    audience_2_goal: str
    audience_2_goal_uz: Optional[str] = ""
    audience_2_goal_en: Optional[str] = ""
    audience_2_image: str = "/images/audience_dms.png"

    audience_3_name: str
    audience_3_name_uz: Optional[str] = ""
    audience_3_name_en: Optional[str] = ""
    audience_3_goal: str
    audience_3_goal_uz: Optional[str] = ""
    audience_3_goal_en: Optional[str] = ""
    audience_3_image: str = "/images/audience_partners.png"

    audience_4_name: str
    audience_4_name_uz: Optional[str] = ""
    audience_4_name_en: Optional[str] = ""
    audience_4_goal: str
    audience_4_goal_uz: Optional[str] = ""
    audience_4_goal_en: Optional[str] = ""
    audience_4_image: str = "/images/audience_welcome.png"

    # Process
    process_badge: str
    process_badge_uz: Optional[str] = ""
    process_badge_en: Optional[str] = ""
    process_title: str
    process_title_uz: Optional[str] = ""
    process_title_en: Optional[str] = ""
    process_desc: str
    process_desc_uz: Optional[str] = ""
    process_desc_en: Optional[str] = ""
    
    process_1_title: str
    process_1_title_uz: Optional[str] = ""
    process_1_title_en: Optional[str] = ""
    process_1_text: str
    process_1_text_uz: Optional[str] = ""
    process_1_text_en: Optional[str] = ""
    process_1_image: str = "/images/process_design.png"

    process_2_title: str
    process_2_title_uz: Optional[str] = ""
    process_2_title_en: Optional[str] = ""
    process_2_text: str
    process_2_text_uz: Optional[str] = ""
    process_2_text_en: Optional[str] = ""
    process_2_image: str = "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=40&w=800&auto=format&fit=crop"

    process_3_title: str
    process_3_title_uz: Optional[str] = ""
    process_3_title_en: Optional[str] = ""
    process_3_text: str
    process_3_text_uz: Optional[str] = ""
    process_3_text_en: Optional[str] = ""
    process_3_image: str = "https://images.unsplash.com/photo-1549463512-23f29241b212?q=40&w=800&auto=format&fit=crop"

    # Stats
    stat_1_val: str
    stat_1_label: str
    stat_1_label_uz: Optional[str] = ""
    stat_1_label_en: Optional[str] = ""

    stat_2_val: str
    stat_2_label: str
    stat_2_label_uz: Optional[str] = ""
    stat_2_label_en: Optional[str] = ""

    stat_3_val: str
    stat_3_label: str
    stat_3_label_uz: Optional[str] = ""
    stat_3_label_en: Optional[str] = ""

    stat_4_val: str
    stat_4_label: str
    stat_4_label_uz: Optional[str] = ""
    stat_4_label_en: Optional[str] = ""

    # Contact
    contact_title: str
    contact_title_uz: Optional[str] = ""
    contact_title_en: Optional[str] = ""
    contact_desc: str
    contact_desc_uz: Optional[str] = ""
    contact_desc_en: Optional[str] = ""

class ContentData(BaseModel):
    ticker: List[TickerItem]
    benefits: List[BenefitItem]
    difference: List[DifferenceItem] = []
    products: List[ProductItem] = []
    footer: Optional[FooterData] = None
    companies: Optional[CompaniesData] = None
