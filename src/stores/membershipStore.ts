import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, MembershipPlan, MembershipPlanType, Payment, Referral, PaymentMethod, RegistrationMethod } from '../types';

// 会员套餐配置
export const membershipPlans: MembershipPlan[] = [
  {
    id: 'trial_0',
    name: '首次下载试用',
    price: 0,
    description: '新用户专享，免费试用1个月',
    features: ['试用期1个月', '试用期内无限下载', '支持所有格式', '高分辨率输出'],
    duration: 30,
  },
  {
    id: 'pay_1_month',
    name: '9.9元1个月无限下载',
    price: 9.9,
    originalPrice: 29.9,
    description: '1个月内无限下载',
    features: ['1个月会员期', '无限次数下载', '支持所有格式', '高分辨率输出'],
    duration: 30,
  },
  {
    id: 'pay_3_months',
    name: '19.9元3个月无限下载',
    price: 19.9,
    originalPrice: 59.9,
    description: '3个月内无限下载',
    features: ['3个月会员期', '无限次数下载', '所有格式支持', '优先客服支持'],
    duration: 90,
  },
  {
    id: 'pay_6_months',
    name: '29.9元6个月无限下载',
    price: 29.9,
    originalPrice: 99.9,
    description: '半年无限下载，更实惠',
    features: ['6个月会员期', '无限次数下载', '支持所有格式', '优先客服支持'],
    duration: 180,
    isPopular: true,
  },
  {
    id: 'pay_1_year',
    name: '49.9元1年无限下载',
    price: 49.9,
    originalPrice: 199.9,
    description: '一年无限下载，性价比之选',
    features: ['1年会员期', '无限次数下载', '支持所有格式', '优先客服支持'],
    duration: 365,
  },
];

interface MembershipStore {
  currentUser: User | null;
  payments: Payment[];
  referrals: Referral[];
  isRegistrationModalOpen: boolean;
  isPaymentModalOpen: boolean;
  selectedPlan: MembershipPlanType | null;

  // 用户操作
  setCurrentUser: (user: User | null) => void;
  registerUser: (method: RegistrationMethod, referralCode?: string) => User;
  logout: () => void;

  // 支付操作
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
  openPaymentModal: (planId: MembershipPlanType) => void;
  closePaymentModal: () => void;
  processPayment: (method: PaymentMethod) => Promise<boolean>;

  // 下载操作
  canDownload: () => boolean;
  useDownload: () => boolean;

  // 分享裂变
  generateReferralLink: () => string;
  handleReferral: (referralCode: string) => void;
}

// 创建新用户
const createNewUser = (method: RegistrationMethod, referralCode?: string): User => {
  return {
    id: `user-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
    registrationMethod: method,
    registrationDate: new Date(),
    isMember: false,
    downloadsRemaining: 0,
    totalDownloads: 0,
    freeDownloadsFromReferral: 0,
    referralCode: crypto.randomUUID().slice(0, 8),
    referredBy: referralCode,
    referrals: [],
  };
};

export const useMembershipStore = create<MembershipStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      payments: [],
      referrals: [],
      isRegistrationModalOpen: false,
      isPaymentModalOpen: false,
      selectedPlan: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      registerUser: (method, referralCode) => {
        // 检查是否有保存的推荐码
        const savedReferralCode = localStorage.getItem('pendingReferralCode');
        const finalReferralCode = referralCode || savedReferralCode;
        
        const newUser = createNewUser(method, finalReferralCode);
        
        // 如果有推荐码，处理推荐关系
        if (finalReferralCode) {
          const { referrals, currentUser: existingUsers } = get();
          
          // 在真实场景中，这里需要查询推荐人，现在我们简化处理
          // 创建推荐记录
          const newReferral: Referral = {
            id: `referral-${Date.now()}`,
            referrerId: finalReferralCode, // 在真实场景中，这里应该是推荐人的ID
            referredId: newUser.id,
            createdAt: new Date(),
            rewardGiven: false,
          };
          
          // 给新用户赠送7天会员
          newUser.isMember = true;
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 7);
          newUser.membershipExpiry = expiry;
          newUser.downloadsRemaining = Infinity;
          
          // 如果能找到推荐人，给推荐人也赠送1次下载
          // 在这个简化版本中，我们暂时不处理推荐人的奖励
          
          set({ referrals: [...referrals, newReferral] });
          
          // 清除保存的推荐码
          localStorage.removeItem('pendingReferralCode');
        }

        set({ currentUser: newUser, isRegistrationModalOpen: false });
        return newUser;
      },

      logout: () => set({ currentUser: null }),

      openRegistrationModal: () => set({ isRegistrationModalOpen: true }),

      closeRegistrationModal: () => set({ isRegistrationModalOpen: false }),

      openPaymentModal: (planId) => {
        const { currentUser, openRegistrationModal } = get();
        
        if (!currentUser) {
          openRegistrationModal();
          return;
        }
        
        set({ selectedPlan: planId, isPaymentModalOpen: true });
      },

      closePaymentModal: () => set({ isPaymentModalOpen: false, selectedPlan: null }),

      processPayment: async (method) => {
        const { currentUser, selectedPlan, payments } = get();
        if (!currentUser || !selectedPlan) return false;

        const plan = membershipPlans.find(p => p.id === selectedPlan);
        if (!plan) return false;

        // 创建支付记录
        const newPayment: Payment = {
          id: `payment-${Date.now()}`,
          planId: selectedPlan,
          amount: plan.price,
          method,
          status: 'pending',
          createdAt: new Date(),
        };

        // 模拟支付过程
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 支付成功
        newPayment.status = 'success';

        // 更新用户会员状态
        const updatedUser = { ...currentUser };
        
        if (plan.duration) {
          // 有时限的会员 - 累加有效期
          updatedUser.isMember = true;
          let expiry;
          
          if (updatedUser.membershipExpiry && new Date(updatedUser.membershipExpiry) > new Date()) {
            // 如果有未过期的会员，在原基础上延长
            expiry = new Date(updatedUser.membershipExpiry);
          } else {
            // 否则从现在开始计算
            expiry = new Date();
          }
          expiry.setDate(expiry.getDate() + plan.duration);
          updatedUser.membershipExpiry = expiry;
          updatedUser.downloadsRemaining = Infinity; // 时间会员无限下载
        } else if (plan.downloadLimit) {
          // 按次的会员 - 累加下载次数
          // 如果之前是时间会员，不修改会员状态
          if (!(updatedUser.isMember && updatedUser.downloadsRemaining === Infinity)) {
            updatedUser.downloadsRemaining += plan.downloadLimit;
            // 按次套餐不设置会员有效期（永久有效）
            if (plan.id !== 'trial_0') {
              updatedUser.isMember = true;
              updatedUser.membershipExpiry = undefined; // 永久有效
            }
          }
        } else {
          // 永久会员
          updatedUser.isMember = true;
          updatedUser.membershipExpiry = undefined; // 永久有效
          updatedUser.downloadsRemaining = Infinity;
        }

        set({
          currentUser: updatedUser,
          payments: [...payments, newPayment],
          isPaymentModalOpen: false,
          selectedPlan: null,
        });

        return true;
      },

      canDownload: () => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        // 检查会员是否在有效期内
        if (currentUser.isMember && currentUser.membershipExpiry) {
          if (new Date() > currentUser.membershipExpiry) {
            // 会员已过期
            const updatedUser = { ...currentUser, isMember: false };
            set({ currentUser: updatedUser });
            return currentUser.downloadsRemaining > 0 || currentUser.freeDownloadsFromReferral > 0;
          }
          return true;
        }
        
        // 检查是否有剩余下载次数
        return currentUser.isMember || 
               currentUser.downloadsRemaining > 0 || 
               currentUser.freeDownloadsFromReferral > 0;
      },

      useDownload: () => {
        const { currentUser } = get();
        if (!currentUser || !get().canDownload()) return false;

        const updatedUser = { ...currentUser };
        updatedUser.totalDownloads += 1;

        // 优先使用推荐赠送的下载次数
        if (updatedUser.freeDownloadsFromReferral > 0) {
          updatedUser.freeDownloadsFromReferral -= 1;
        } else if (updatedUser.downloadsRemaining > 0 && updatedUser.downloadsRemaining !== Infinity) {
          updatedUser.downloadsRemaining -= 1;
        }

        set({ currentUser: updatedUser });
        return true;
      },

      generateReferralLink: () => {
        const { currentUser } = get();
        if (!currentUser || !currentUser.referralCode) return '';
        
        return `${window.location.origin}?ref=${currentUser.referralCode}`;
      },

      handleReferral: (referralCode) => {
        const { currentUser } = get();
        
        // 如果当前没有用户，保存推荐码到localStorage，注册时使用
        if (!currentUser) {
          localStorage.setItem('pendingReferralCode', referralCode);
          return;
        }

        // 如果当前用户已存在且还没有使用过推荐码，可以处理
        // 在这个简化版本中，我们不处理已注册用户的推荐
      },
    }),
    {
      name: 'membership-storage',
    }
  )
);
