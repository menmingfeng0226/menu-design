import React, { useState, useEffect } from 'react';
import { X, Smartphone, MessageCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { useMembershipStore } from '../../stores/membershipStore';
import { useToast } from '../common/Toast';
import { authAPI } from '../../services/api';
import type { RegistrationMethod } from '../../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

type RegisterStep = 'select' | 'phone_form';

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { setCurrentUser } = useMembershipStore();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<RegistrationMethod | null>(null);
  const [currentStep, setCurrentStep] = useState<RegisterStep>('select');
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [codeButtonText, setCodeButtonText] = useState('获取验证码');
  const [codeButtonDisabled, setCodeButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && codeButtonText !== '获取验证码') {
      setCodeButtonText('获取验证码');
      setCodeButtonDisabled(false);
    }
  }, [countdown, codeButtonText]);

  const handleSendCode = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('error', '请输入有效的手机号码');
      return;
    }

    setCodeButtonDisabled(true);
    setIsProcessing(true);

    try {
      const response = await authAPI.sendVerificationCode(phone);
      if (response.success) {
        showToast('success', response.message);
        setCodeButtonText(`${response.expiresIn}秒后重试`);
        setCountdown(response.expiresIn || 300);
      } else {
        showToast('error', response.message);
        setCodeButtonDisabled(false);
      }
    } catch (error) {
      showToast('error', '发送验证码失败');
      setCodeButtonDisabled(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhoneRegister = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('error', '请输入有效的手机号码');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      showToast('error', '请输入6位验证码');
      return;
    }

    if (password.length < 6) {
      showToast('error', '密码长度不能少于6位');
      return;
    }

    if (password !== confirmPassword) {
      showToast('error', '两次输入的密码不一致');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await authAPI.registerWithPhone(phone, code, password);
      if (response.success && response.user) {
        setCurrentUser(response.user);
        showToast('success', response.message);
        onClose();
      } else {
        showToast('error', response.message);
      }
    } catch (error) {
      showToast('error', '注册失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSocialRegister = async () => {
    setIsProcessing(true);
    setSelectedMethod('wechat');

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
      showToast('error', '注册失败，请重试');
    } finally {
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };

  const registrationMethods = [
    {
      id: 'wechat' as RegistrationMethod,
      name: '微信登录',
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      description: '使用微信账号快速登录',
      color: 'bg-green-50 border-green-200 hover:border-green-300',
      borderColor: 'border-green-200',
      activeColor: 'border-green-500'
    },

    {
      id: 'phone' as RegistrationMethod,
      name: '手机号注册',
      icon: <Smartphone className="w-6 h-6 text-gray-500" />,
      description: '使用手机号注册账号',
      color: 'bg-gray-50 border-gray-200 hover:border-gray-300',
      borderColor: 'border-gray-200',
      activeColor: 'border-gray-500'
    }
  ];

  const handleBack = () => {
    setCurrentStep('select');
    setPhone('');
    setCode('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentStep === 'select' ? '注册账号' : '手机号注册'}
      size="md"
    >
      <div className="p-6">
        {currentStep === 'select' ? (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-600">
                选择一种方式注册账号，即可享受会员权益
              </p>
            </div>

            <div className="space-y-4">
              {registrationMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    if (method.id === 'phone') {
                      setCurrentStep('phone_form');
                    } else {
                      handleSocialRegister();
                    }
                  }}
                  disabled={isProcessing}
                  className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                    isProcessing && selectedMethod === method.id
                      ? `${method.color} ${method.activeColor} shadow-md`
                      : `${method.color}`
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isProcessing && selectedMethod === method.id ? (
                      <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    ) : (
                      method.icon
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">
                      {method.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.description}
                    </div>
                  </div>
                  {!isProcessing && (
                    <div className="text-gray-400">
                      →
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                已有账号？
                <button
                  onClick={onSwitchToLogin}
                  className="text-amber-600 hover:text-amber-700 font-medium ml-1"
                >
                  立即登录
                </button>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                注册即表示同意我们的
                <a href="#" className="text-amber-600 hover:underline">服务条款</a>
                和
                <a href="#" className="text-amber-600 hover:underline">隐私政策</a>
              </p>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              返回选择注册方式
            </button>

            <div className="space-y-4">
              <Input
                label="手机号码"
                type="tel"
                placeholder="请输入手机号码"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                error={phone && !/^1[3-9]\d{9}$/.test(phone) ? '请输入有效的手机号码' : undefined}
              />

              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    label="验证码"
                    type="text"
                    placeholder="请输入6位验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    error={code && !/^\d{6}$/.test(code) ? '请输入6位数字验证码' : undefined}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSendCode}
                    disabled={codeButtonDisabled || isProcessing}
                    loading={isProcessing}
                    className="h-[42px] px-4"
                  >
                    {codeButtonText}
                  </Button>
                </div>
              </div>

              <Input
                label="设置密码"
                type="password"
                placeholder="请设置登录密码（至少6位）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={password && password.length < 6 ? '密码长度不能少于6位' : undefined}
              />

              <Input
                label="确认密码"
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword && password !== confirmPassword ? '两次输入的密码不一致' : undefined}
              />
            </div>

            <Button
              onClick={handlePhoneRegister}
              className="w-full mt-6"
              loading={isProcessing}
              disabled={isProcessing}
            >
              注册并登录
            </Button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                注册即表示同意我们的
                <a href="#" className="text-amber-600 hover:underline">服务条款</a>
                和
                <a href="#" className="text-amber-600 hover:underline">隐私政策</a>
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default RegistrationModal;
