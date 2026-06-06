import React, { useState } from 'react';
import { X, MessageCircle, Loader2, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useMembershipStore, membershipPlans } from '../../stores/membershipStore';
import { useToast } from '../common/Toast';
import type { PaymentMethod } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { selectedPlan, processPayment, closePaymentModal } = useMembershipStore();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plan = selectedPlan ? membershipPlans.find(p => p.id === selectedPlan) : null;

  const handlePayment = async (method: PaymentMethod) => {
    setIsProcessing(true);
    setSelectedMethod(method);

    try {
      const success = await processPayment(method);
      
      if (success) {
        setPaymentSuccess(true);
        showToast('success', plan?.price === 0 ? '领取成功！' : '支付成功！');
      }
    } catch (error) {
      showToast('error', '支付失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPaymentSuccess(false);
      setSelectedMethod(null);
      closePaymentModal();
    }
  };

  const paymentMethods = [
    {
      id: 'wechat' as PaymentMethod,
      name: '微信支付',
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      recommended: true
    },

  ];

  if (!plan) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={paymentSuccess ? '支付成功' : '选择支付方式'}
      size="md"
    >
      <div className="p-6">
        {paymentSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.price === 0 ? '领取成功！' : '支付成功！'}
            </h3>
            <p className="text-gray-600 mb-6">
              {plan.price === 0 
                ? '您已获得免费下载次数' 
                : `您已成功购买「${plan.name}」`}
            </p>
            <Button
              size="lg"
              onClick={handleClose}
            >
              确定
            </Button>
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">
                    ¥{plan.price}
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-400 line-through">
                      ¥{plan.originalPrice}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">选择支付方式</h4>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePayment(method.id)}
                    disabled={isProcessing}
                    className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                      isProcessing && selectedMethod === method.id
                        ? `${method.color} border-amber-500`
                        : `${method.color} hover:border-amber-400`
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
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {method.name}
                        </span>
                        {method.recommended && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            推荐
                          </span>
                        )}
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
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <div className="text-amber-500 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p>
                您的支付信息将被安全加密处理，我们不会保存您的银行卡信息。
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
