import type { User, RegistrationMethod } from '../types';

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}

interface SendCodeResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}

const mockUsers: Record<string, User> = {};
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {};

export const authAPI = {
  sendVerificationCode: async (phone: string): Promise<SendCodeResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { success: false, message: '请输入有效的手机号码' };
    }
    
    const code = Math.random().toString(10).substring(2, 8);
    verificationCodes[phone] = {
      code,
      expiresAt: Date.now() + 60000 * 5
    };
    
    console.log(`验证码已发送到 ${phone}: ${code}`);
    
    return { 
      success: true, 
      message: '验证码已发送，有效期5分钟',
      expiresIn: 300
    };
  },

  verifyCode: (phone: string, code: string): boolean => {
    const stored = verificationCodes[phone];
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) return false;
    return stored.code === code;
  },

  registerWithPhone: async (phone: string, code: string, password: string): Promise<RegisterResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { success: false, message: '请输入有效的手机号码' };
    }
    
    if (!authAPI.verifyCode(phone, code)) {
      return { success: false, message: '验证码错误或已过期' };
    }
    
    if (password.length < 6) {
      return { success: false, message: '密码长度不能少于6位' };
    }
    
    if (mockUsers[phone]) {
      return { success: false, message: '该手机号已注册' };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      registrationMethod: 'phone',
      registrationDate: new Date(),
      isMember: true,
      membershipExpiry: new Date(Date.now() + 60000 * 60 * 24 * 7),
      downloadsRemaining: Infinity,
      totalDownloads: 0,
      freeDownloadsFromReferral: 0,
      referralCode: crypto.randomUUID().slice(0, 8),
      referredBy: localStorage.getItem('pendingReferralCode') || undefined,
      referrals: [],
    };
    
    mockUsers[phone] = newUser;
    delete verificationCodes[phone];
    
    if (newUser.referredBy) {
      localStorage.removeItem('pendingReferralCode');
    }
    
    return { success: true, message: '注册成功', user: newUser };
  },

  registerWithWechat: async (): Promise<RegisterResponse> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const wechatOpenId = `wx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    if (mockUsers[wechatOpenId]) {
      return { success: true, message: '登录成功', user: mockUsers[wechatOpenId] };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      registrationMethod: 'wechat',
      registrationDate: new Date(),
      isMember: true,
      membershipExpiry: new Date(Date.now() + 60000 * 60 * 24 * 7),
      downloadsRemaining: Infinity,
      totalDownloads: 0,
      freeDownloadsFromReferral: 0,
      referralCode: crypto.randomUUID().slice(0, 8),
      referredBy: localStorage.getItem('pendingReferralCode') || undefined,
      referrals: [],
    };
    
    mockUsers[wechatOpenId] = newUser;
    
    if (newUser.referredBy) {
      localStorage.removeItem('pendingReferralCode');
    }
    
    return { success: true, message: '微信注册成功', user: newUser };
  },

  registerWithAlipay: async (): Promise<RegisterResponse> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const alipayUserId = `alipay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    if (mockUsers[alipayUserId]) {
      return { success: true, message: '登录成功', user: mockUsers[alipayUserId] };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      registrationMethod: 'alipay',
      registrationDate: new Date(),
      isMember: true,
      membershipExpiry: new Date(Date.now() + 60000 * 60 * 24 * 7),
      downloadsRemaining: Infinity,
      totalDownloads: 0,
      freeDownloadsFromReferral: 0,
      referralCode: crypto.randomUUID().slice(0, 8),
      referredBy: localStorage.getItem('pendingReferralCode') || undefined,
      referrals: [],
    };
    
    mockUsers[alipayUserId] = newUser;
    
    if (newUser.referredBy) {
      localStorage.removeItem('pendingReferralCode');
    }
    
    return { success: true, message: '支付宝注册成功', user: newUser };
  },

  loginWithPhone: async (phone: string, password: string): Promise<RegisterResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers[phone];
    if (!user) {
      return { success: false, message: '账号不存在' };
    }
    
    return { success: true, message: '登录成功', user };
  }
};
