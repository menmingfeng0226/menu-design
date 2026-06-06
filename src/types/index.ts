export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
}

export interface MenuStyle {
  backgroundColor?: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundMask?: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  layoutType: 'vertical' | 'horizontal' | 'grid' | 'card' | 'list' | 'magazine' | 'compact' | 'premium' | 'carousel' | 'polaroid' | 'featured' | 'masonry' | 'alternating' | 'minimal' | 'elegant' | 'mosaic' | 'custom' | 'spotlight' | 'gallery' | 'newspaper' | 'tag';
  customLayout?: {
    columns: number;
    rows?: number;
  };
  spacing: {
    categoryGap: number;
    dishGap: number;
  };
  pageMargin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pageMarginUnit?: 'mm' | 'cm' | 'px';
  currency: string;
  pageSize: string;
  nameStyle?: TextStyle;
  priceStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export interface ImageTransform {
  scale: number;
  x: number;
  y: number;
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  priceString: string;
  originalPrice?: number;
  originalPriceString?: string;
  unit?: string;
  description?: string;
  image?: string;
  imageTransform?: ImageTransform;
  order: number;
  nameStyle?: TextStyle;
  priceStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  backgroundImage?: string;
  textAlign?: 'left' | 'center' | 'right';
  dishes: Dish[];
  order: number;
}

export interface Menu {
  id: string;
  name: string;
  templateId: string;
  style: MenuStyle;
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  pinned?: boolean;
  pinnedAt?: Date;
}

export interface BackgroundOption {
  label: string;
  type: 'solid' | 'gradient' | 'image';
  value: string;
  preview?: string;
}

export type TemplateDish = Omit<Dish, 'id' | 'priceString' | 'originalPriceString'> & {
  priceString?: string;
  originalPriceString?: string;
};

export interface TemplateCategory {
  name: string;
  icon?: string;
  dishes: TemplateDish[];
  layoutType?: MenuStyle['layoutType'];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  style: MenuStyle;
  usageCount: number;
  backgroundOptions: BackgroundOption[];
  initialContent: {
    menuName: string;
    categories: TemplateCategory[];
  };
}

// 会员相关类型
export type MembershipPlanType = 'trial_0' | 'pay_1_month' | 'pay_3_times' | 'pay_3_months' | 'pay_6_months' | 'pay_1_year' | 'pay_lifetime';

export interface MembershipPlan {
  id: MembershipPlanType;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  duration?: number; // 天数，undefined表示永久或按次
  downloadLimit?: number; // undefined表示不限次数
  isPopular?: boolean;
}

export type PaymentMethod = 'wechat' | 'alipay' | 'bank';

export interface Payment {
  id: string;
  planId: MembershipPlanType;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}

export type RegistrationMethod = 'wechat' | 'alipay' | 'phone';

export interface User {
  id: string;
  registrationMethod: RegistrationMethod;
  registrationDate: Date;
  isMember: boolean;
  membershipExpiry?: Date;
  downloadsRemaining: number;
  totalDownloads: number;
  freeDownloadsFromReferral: number;
  referralCode?: string;
  referredBy?: string;
  referrals: string[];
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  createdAt: Date;
  rewardGiven: boolean;
}
