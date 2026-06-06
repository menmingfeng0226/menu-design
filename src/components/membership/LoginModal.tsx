import React, { useState } from 'react';
import { X, MessageCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { useMembershipStore } from '../../stores/membershipStore';
import { useToast } from '../common/Toast';
import { authAPI } from '../../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

type LoginTab = 'phone' | 'social';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { setCurrentUser } = useMembershipStore();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<LoginTab>('phone');
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handlePhoneLogin = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('error', '请输入有效的手机号码');
      return;
    }

    if (!password) {
      showToast('error', '请输入密码');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await authAPI.loginWithPhone(phone, password);
      if (response.success && response.user) {
        setCurrentUser(response.user);
        showToast('success', response.message);
        onClose();
      } else {
        showToast('error', response.message);
      }
    } catch (error) {
      showToast('error', '登录失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSocialLogin = async () => {
    setIsProcessing(true);

    try {
      const response = await authAPI.registerWithWechat();
      
      if (response.success && response.user) {
        setCurrentUser(response.user);
        showToast('success', response.message);
        onClose();
      } else {
        showToast('error', response.message);
      }
    } catch (error) {
      showToast('error', '登录失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="登录账号"
      size="md"
    >
      <div className="p-6">
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === 'phone'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            账号密码登录
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === 'social'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            快捷登录
          </button>
        </div>

        {activeTab === 'phone' ? (
          <div className="space-y-4">
            <Input
              label="手机号码"
              type="tel"
              placeholder="请输入手机号码"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              error={phone && !/^1[3-9]\d{9}$/.test(phone) ? '请输入有效的手机号码' : undefined}
            />

            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="text-right text-sm text-amber-600 hover:text-amber-700">
              忘记密码？
            </button>

            <Button
              onClick={handlePhoneLogin}
              className="w-full"
              loading={isProcessing}
              disabled={isProcessing}
            >
              登录
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleSocialLogin}
              disabled={isProcessing}
              className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                isProcessing ? 'bg-green-50 border-green-500' : 'bg-green-50 border-green-200 hover:border-green-300'
              }`}
            >
              <div className="flex-shrink-0">
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                ) : (
                  <MessageCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">微信登录</div>
                <div className="text-sm text-gray-600">使用微信账号快速登录</div>
              </div>
              {!isProcessing && (
                <div className="text-gray-400">→</div>
              )}
            </button>


          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            还没有账号？
            <button
              onClick={onSwitchToRegister}
              className="text-amber-600 hover:text-amber-700 font-medium ml-1 flex items-center justify-center gap-1"
            >
              立即注册
              <ArrowRight className="w-4 h-4" />
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
