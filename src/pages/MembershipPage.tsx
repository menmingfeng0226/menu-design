import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Gift, 
  Check, 
  Zap, 
  Share2, 
  Users, 
  Download, 
  Star, 
  ArrowRight,
  Smartphone,
  MessageSquare,
  LogOut,
  User,
  CreditCard,
  Clock,
  History,
  ChevronDown,
  FileText
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import RegistrationModal from '../components/membership/RegistrationModal';
import LoginModal from '../components/membership/LoginModal';
import { useMembershipStore, membershipPlans } from '../stores/membershipStore';
import { useMenuStore } from '../stores/menuStore';
import { useToast } from '../components/common/Toast';
import type { MembershipPlanType } from '../types';

const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    openPaymentModal, 
    openRegistrationModal,
    closeRegistrationModal,
    generateReferralLink,
    logout,
    payments
  } = useMembershipStore();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { menus } = useMenuStore();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [showAllDownloads, setShowAllDownloads] = useState(false);

  // 判断用户是否已使用过0元试用
  const hasUsedTrial = payments.some(p => p.planId === 'trial_0' && p.status === 'success');

  // 处理点击菜单名称进入预览页面
  const handlePreviewMenu = (menuId: string) => {
    navigate(`/preview/${menuId}`);
  };

  const handleSelectPlan = (planId: MembershipPlanType) => {
    if (!currentUser) {
      showToast('error', '请先登录');
      openRegistrationModal();
      return;
    }
    openPaymentModal(planId);
  };

  const handleCopyReferralLink = () => {
    const link = generateReferralLink();
    if (link) {
      navigator.clipboard.writeText(link);
      showToast('success', '分享链接已复制到剪贴板！');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('success', '已退出登录');
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatExpiryDate = (date?: Date) => {
    if (!date) return '永久有效';
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRemainingDays = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const displayedPayments = showAllPayments ? payments : payments.slice(0, 2);
  const hasMorePayments = payments.length > 2;
  // 按时间倒序排列购买记录（最新在前）
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const sortedDisplayedPayments = showAllPayments ? sortedPayments : sortedPayments.slice(0, 2);

  // 计算剩余下载/天数显示文本
  const getRemainingDisplayText = () => {
    if (currentUser.isMember && currentUser.membershipExpiry) {
      const days = getRemainingDays(currentUser.membershipExpiry);
      if (days === null) return '永久有效';
      if (days <= 0) return '已到期';
      return `${days}天`;
    }
    return currentUser.downloadsRemaining === Infinity ? '无限次' : currentUser.downloadsRemaining;
  };

  // 获取标签文本
  const getRemainingLabelText = () => {
    return currentUser.isMember && currentUser.membershipExpiry ? '剩余天数' : '剩余下载';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header - 压缩高度 */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <Crown className="w-10 h-10" />
              <h1 className="text-2xl md:text-3xl font-bold">
                会员权益中心
              </h1>
            </motion.div>
            
            {/* 右上角登录/注册按钮或头像 */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="w-4 h-4 mr-2" />
                登录/注册
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 用户状态与权益组件 - 合并 */}
      {currentUser && (
        <section className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              {/* 用户信息头部 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                  {currentUser.isMember ? (
                    <Crown className="w-7 h-7 text-amber-500" />
                  ) : (
                    <Users className="w-7 h-7 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentUser.isMember ? '尊贵会员' : '普通用户'}
                  </h3>
                  <p className="text-gray-600">
                    {currentUser.isMember ? (
                      <>会员有效期至：{formatExpiryDate(currentUser.membershipExpiry)}</>
                    ) : (
                      <>注册于：{formatDate(currentUser.registrationDate)}</>
                    )}
                  </p>
                </div>
              </div>

              {/* 快捷数据 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {getRemainingDisplayText()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {getRemainingLabelText()}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentUser.freeDownloadsFromReferral}
                  </div>
                  <div className="text-xs text-gray-600">分享赠送</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentUser.totalDownloads}
                  </div>
                  <div className="text-xs text-gray-600">累计下载</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {payments.length}
                  </div>
                  <div className="text-xs text-gray-600">购买次数</div>
                </div>
              </div>

              {/* 购买记录 */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-500" />
                    购买记录
                  </h4>
                  {hasMorePayments && (
                    <button
                      onClick={() => setShowAllPayments(!showAllPayments)}
                      className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      {showAllPayments ? '收起' : `查看全部 (${payments.length})`}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAllPayments ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {sortedDisplayedPayments.length > 0 ? (
                    sortedDisplayedPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {membershipPlans.find(p => p.id === payment.planId)?.name || payment.planId}
                        </span>
                        <span className="text-gray-500">
                          ¥{payment.amount} - {formatDate(payment.createdAt)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">暂无购买记录</p>
                  )}
                </div>
              </div>

              {/* 已下载菜单 */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    已下载菜单
                  </h4>
                  {menus.length > 2 && (
                    <button
                      onClick={() => setShowAllDownloads(!showAllDownloads)}
                      className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      {showAllDownloads ? '收起' : `查看全部 (${menus.length})`}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAllDownloads ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {menus.length > 0 ? (
                    (showAllDownloads ? menus : menus.slice(0, 2)).map((menu) => (
                      <div 
                        key={menu.id} 
                        className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                        onClick={() => handlePreviewMenu(menu.id)}
                      >
                        <span className="text-gray-700 hover:text-amber-600 flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          {menu.name}
                        </span>
                        <span className="text-gray-400 text-xs">点击预览</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">暂无下载记录</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* 用户状态 - 未登录 */}
      {!currentUser && (
        <section className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">访客</h3>
                  <p className="text-sm text-gray-600">请登录查看完整权益</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* 0元试用套餐 - 独立展示 */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Card 
            className={`relative overflow-hidden transition-all ${
              hasUsedTrial 
                ? 'bg-gray-100 opacity-75' 
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
            }`}
          >
            {hasUsedTrial && (
              <div className="absolute top-0 right-0 bg-gray-500 text-white px-4 py-1 text-sm font-bold">
                已使用
              </div>
            )}
            
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  首次下载试用
                </h3>
                <p className="text-gray-600 mb-2">
                  新用户专享，免费试用1个月
                </p>
                <ul className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <li className="flex items-center gap-1 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    试用期1个月
                  </li>
                  <li className="flex items-center gap-1 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    试用期内无限下载
                  </li>
                  <li className="flex items-center gap-1 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    支持所有格式
                  </li>
                  <li className="flex items-center gap-1 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    高分辨率输出
                  </li>
                </ul>
              </div>

              <div className="flex-shrink-0">
                <div className="text-center">
                  <span className="text-3xl font-bold text-green-600">¥0</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button
                  size="md"
                  variant={hasUsedTrial ? 'secondary' : 'primary'}
                  disabled={hasUsedTrial}
                  onClick={() => handleSelectPlan('trial_0')}
                >
                  {hasUsedTrial ? '已领取' : '立即领取'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Plans Section - 改为一排2个 */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              选择适合你的套餐
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              多种套餐选择，总有一款适合你
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {membershipPlans.filter(plan => plan.price > 0).map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  hover 
                  className={`relative overflow-hidden bg-white ${
                    plan.isPopular ? 'border-2 border-amber-500 shadow-lg' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-xs font-bold">
                      最受欢迎
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-3 text-xs">
                      {plan.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-amber-600">
                          ¥{plan.price}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ¥{plan.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-1.5 mb-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      size="sm"
                      fullWidth
                      variant={plan.isPopular ? 'primary' : 'secondary'}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {plan.price === 0 ? '立即领取' : '立即购买'}
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Gift className="w-8 h-8 text-amber-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    邀请好友，免费下载
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  将你的专属分享链接发送给好友，好友注册成功后，你和好友都将获得7天免费下载机会！
                  多邀多得，上不封顶！
                </p>
                
                {currentUser ? (
                  <div className="flex gap-2">
                    <Button
                      size="md"
                      variant="secondary"
                      onClick={handleCopyReferralLink}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      复制分享链接
                    </Button>
                    <Button
                      size="md"
                      variant="secondary"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      分享到微信
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="md"
                    onClick={openRegistrationModal}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    注册获取分享链接
                  </Button>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <div className="text-center p-3">
                    <Users className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-amber-600">
                      +1
                    </div>
                    <div className="text-xs text-gray-600">
                      每邀请1人
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              为什么选择我们
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Download className="w-8 h-8 text-amber-500" />,
                title: '无限下载',
                description: '会员期内无下载限制'
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-500" />,
                title: '高速输出',
                description: '高分辨率图片，专业打印质量'
              },
              {
                icon: <Star className="w-8 h-8 text-amber-500" />,
                title: '专属模板',
                description: '会员专属精美模板，持续更新'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RegistrationModal
        isOpen={false}
        onClose={() => {}}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          openRegistrationModal();
        }}
      />
    </div>
  );
};

export default MembershipPage;
