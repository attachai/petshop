import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, CreditCard, ExternalLink, MapPin, Package, Phone, Truck, Award } from 'lucide-react';
import { auth } from '../firebase';
import { dataService, OperationType, handleDataError } from '../services/dataService';
import { CartItem } from '../types';

export const CheckoutPage = ({ 
  cart, 
  loyaltyPoints, 
  onOrderComplete 
}: { 
  cart: CartItem[], 
  loyaltyPoints: number,
  onOrderComplete: (pointsRedeemed: number) => void
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pointsRedeemed = location.state?.pointsRedeemed || 0;
  
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'instant'>('standard');
  const [selectedBranch, setSelectedBranch] = useState(1);
  const [selectedInstantService, setSelectedInstantService] = useState('grab');
  const [selectedStandardService, setSelectedStandardService] = useState('kerry');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    details: '',
    province: '',
    zip: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'qr'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [orderNote, setOrderNote] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = pointsRedeemed * 0.01;

  const BRANCHES = [
    { id: 1, name: "Pet Shop Central World", address: "999/9 Rama I Rd, Pathum Wan, Bangkok 10330", lat: 13.7462, lng: 100.5399, phone: "02-640-7000" },
    { id: 2, name: "Pet Shop Siam Paragon", address: "991 Rama I Rd, Pathum Wan, Bangkok 10330", lat: 13.7468, lng: 100.5350, phone: "02-610-8000" },
    { id: 3, name: "Pet Shop EmQuartier", address: "693 Sukhumvit Rd, Khlong Tan Nuea, Watthana, Bangkok 10110", lat: 13.7317, lng: 100.5698, phone: "02-269-1000" },
  ];

  const INSTANT_SERVICES = [
    { id: 'grab', name: 'GrabExpress', icon: '🛵', price: 50 },
    { id: 'lalamove', name: 'Lalamove', icon: '🚚', price: 45 },
    { id: 'lineman', name: 'LINE MAN', icon: '🏍️', price: 40 },
  ];

  const STANDARD_SERVICES = [
    { id: 'kerry', name: 'Kerry Express', icon: '📦', price: 25 },
    { id: 'flash', name: 'Flash Express', icon: '⚡', price: 20 },
    { id: 'thai-post', name: 'Thailand Post', icon: '📮', price: 15 },
  ];

  const getShippingFee = () => {
    if (deliveryMethod === 'pickup') return 0;
    if (deliveryType === 'instant') {
      return INSTANT_SERVICES.find(s => s.id === selectedInstantService)?.price || 50;
    }
    return STANDARD_SERVICES.find(s => s.id === selectedStandardService)?.price || 20;
  };

  const shippingFee = getShippingFee();
  const total = Math.max(0, subtotal - discount + shippingFee);

  const validateStep1 = () => {
    setError(null);
    if (deliveryMethod === 'delivery') {
      if (!address.name || !address.phone || !address.details || !address.province || !address.zip) {
        setError('Please fill in all address fields');
        return false;
      }
      // Basic phone validation
      if (!/^\d{9,10}$/.test(address.phone.replace(/[-\s]/g, ''))) {
        setError('Please enter a valid phone number');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      if (validateStep1()) setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      setCheckoutStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setError(null);
    if (!validateStep1()) {
      setCheckoutStep(1);
      return;
    }
    
    if (!auth.currentUser) {
      setError('Please sign in to place an order');
      return;
    }

    setIsProcessing(true);

    const orderNumber = `TPS${Date.now().toString().slice(-8)}`;
    const trackingNumber = `TH${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const shippingCarrier = deliveryMethod === 'pickup'
      ? 'รับที่สาขา'
      : (deliveryType === 'instant'
        ? (INSTANT_SERVICES.find(s => s.id === selectedInstantService)?.name || 'Express')
        : (STANDARD_SERVICES.find(s => s.id === selectedStandardService)?.name || 'Standard'));

    const orderItems = cart.map(item => ({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice || null,
      quantity: item.quantity,
      image: item.image,
      isFreeGift: item.isFreeGift || false,
      freeGift: item.freeGift || null,
      selectableGifts: item.selectableGifts || null,
      badge: item.badge || null,
    }));

    try {
      await dataService.createOrder(auth.currentUser.uid, {
        id: `ord-${Date.now()}`,
        orderNumber,
        status: 'pending',
        totalAmount: total,
        currency: 'THB',
        trackingNumber,
        carrier: shippingCarrier,
        createdAtMs: Date.now(),
        items: orderItems,
      });
      setIsProcessing(false);
      setCompletedOrderNumber(orderNumber);
      setIsSuccess(true);
      onOrderComplete(pointsRedeemed);
    } catch (err) {
      handleDataError(err, OperationType.CREATE, 'orders');
      setError('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-10 text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">สั่งซื้อสำเร็จ!</h2>
          {completedOrderNumber && (
            <p className="text-xs font-mono text-slate-400 mb-4">เลขที่อ้างอิง #{completedOrderNumber}</p>
          )}
          <p className="text-slate-500 mb-8">
            ขอบคุณที่สั่งซื้อสินค้ากับเรา คำสั่งซื้อของคุณได้รับการยืนยันและกำลังดำเนินการ
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Package size={18} />
              ดูสถานะสั่งซื้อ
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="text-emerald-600 font-bold hover:underline">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group w-fit"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Cart</span>
          </button>

          {/* Progress Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            {[
              { step: 1, label: 'Delivery', icon: Truck },
              { step: 2, label: 'Payment', icon: CreditCard },
              { step: 3, label: 'Review', icon: CheckCircle2 }
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4 flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 relative">
                  <motion.div 
                    initial={false}
                    animate={{
                      backgroundColor: checkoutStep >= s.step ? '#10b981' : '#ffffff',
                      color: checkoutStep >= s.step ? '#ffffff' : '#cbd5e1',
                      scale: checkoutStep === s.step ? 1.1 : 1,
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                      checkoutStep >= s.step ? 'border-emerald-600 shadow-lg shadow-emerald-100' : 'border-slate-200'
                    }`}
                  >
                    <s.icon size={20} />
                  </motion.div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    checkoutStep >= s.step ? 'text-emerald-600' : 'text-slate-400'
                  }`}>{s.label}</span>
                  
                  {checkoutStep > s.step && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white"
                    >
                      <CheckCircle2 size={10} />
                    </motion.div>
                  )}
                </div>
                {i < 2 && (
                  <div className="h-[2px] flex-1 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: checkoutStep > s.step ? '100%' : '0%' }}
                      className="h-full bg-emerald-600"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8">
          {checkoutStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Delivery Method */}
              <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Truck className="text-emerald-600" size={20} />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-slate-900">Delivery Method</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <button 
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-5 ${deliveryMethod === 'delivery' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-emerald-200'}`}
                  >
                    <div className={`p-4 rounded-2xl ${deliveryMethod === 'delivery' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                      <Package size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Home Delivery</h3>
                      <p className="text-sm text-slate-500 mt-1">Ship to your doorstep</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-5 ${deliveryMethod === 'pickup' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-emerald-200'}`}
                  >
                    <div className={`p-4 rounded-2xl ${deliveryMethod === 'pickup' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                      <MapPin size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Self-Pickup</h3>
                      <p className="text-sm text-slate-500 mt-1">Collect from our branch</p>
                    </div>
                  </button>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div className="space-y-8">
                    <div className="p-1.5 bg-slate-100 rounded-2xl w-fit flex gap-2">
                      <button 
                        onClick={() => setDeliveryType('standard')}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${deliveryType === 'standard' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Standard Delivery
                      </button>
                      <button 
                        onClick={() => setDeliveryType('instant')}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${deliveryType === 'instant' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Instant Delivery
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(deliveryType === 'instant' ? INSTANT_SERVICES : STANDARD_SERVICES).map(service => (
                        <button
                          key={service.id}
                          onClick={() => deliveryType === 'instant' ? setSelectedInstantService(service.id) : setSelectedStandardService(service.id)}
                          className={`p-5 rounded-2xl border-2 transition-all flex flex-col gap-3 ${
                            (deliveryType === 'instant' ? selectedInstantService : selectedStandardService) === service.id 
                              ? 'border-emerald-500 bg-emerald-50/50' 
                              : 'border-slate-100 hover:border-emerald-100'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-2xl">{service.icon}</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded-lg">${service.price}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">{service.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Recipient Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. John Doe" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                          value={address.name}
                          onChange={e => setAddress({...address, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. 0812345678" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                          value={address.phone}
                          onChange={e => setAddress({...address, phone: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Address Details</label>
                        <textarea 
                          placeholder="Street name, Building, House No." 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all h-24 resize-none"
                          value={address.details}
                          onChange={e => setAddress({...address, details: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Province</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Bangkok" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                          value={address.province}
                          onChange={e => setAddress({...address, province: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Zip Code</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 10110" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                          value={address.zip}
                          onChange={e => setAddress({...address, zip: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-sm font-bold text-slate-900 mb-2">Select a Pickup Branch</p>
                    <div className="grid grid-cols-1 gap-4">
                      {BRANCHES.map(branch => (
                        <button
                          key={branch.id}
                          onClick={() => setSelectedBranch(branch.id)}
                          className={`w-full p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-6 group ${selectedBranch === branch.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-emerald-100'}`}
                        >
                          <div className={`p-4 rounded-2xl transition-all ${selectedBranch === branch.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                            <MapPin size={24} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-lg">{branch.name}</h4>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Open Now</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{branch.address}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink size={12} />
                                View on Map
                              </a>
                              <span className="text-slate-300 text-xs">|</span>
                              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                <Phone size={12} />
                                {branch.phone}
                              </span>
                            </div>
                          </div>
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedBranch === branch.id ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                            {selectedBranch === branch.id && <CheckCircle2 size={18} className="text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <button 
                onClick={handleNextStep}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                Continue to Payment
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {checkoutStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Payment Method */}
              <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="text-emerald-600" size={20} />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-slate-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  {[
                    { id: 'card', name: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
                    { id: 'qr', name: 'PromptPay', icon: 'QR', desc: 'Instant QR Payment' },
                    { id: 'transfer', name: 'Bank Transfer', icon: 'BK', desc: 'K-Bank, SCB, BBL' }
                  ].map(method => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 text-center group ${paymentMethod === method.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 hover:border-emerald-100'}`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold transition-all ${paymentMethod === method.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                        {typeof method.icon === 'string' ? (
                          <span className="text-xl">{method.icon}</span>
                        ) : (
                          <method.icon size={32} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{method.name}</h3>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Payment Details */}
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                        <input type="text" placeholder="e.g. JOHN DOE" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                        <div className="relative">
                          <input type="text" placeholder="**** **** **** ****" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                            <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                            <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                          <input type="password" placeholder="***" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                        </div>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'qr' && (
                    <div className="text-center space-y-6">
                      <div className="w-48 h-48 bg-white p-4 rounded-3xl mx-auto shadow-sm border border-slate-100 flex items-center justify-center">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PromptPay_PetShop_Store" alt="PromptPay QR" className="w-full h-full" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Scan with any Banking App</p>
                        <p className="text-sm text-slate-500 mt-1">Pet Shop Co., Ltd.</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'transfer' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Name</p>
                          <p className="font-bold text-slate-900">Kasikorn Bank (K-Bank)</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">KB</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</p>
                          <p className="font-bold text-slate-900">012-3-45678-9</p>
                        </div>
                        <button className="text-xs font-bold text-emerald-600 hover:underline">Copy</button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Name</p>
                          <p className="font-bold text-slate-900">Pet Shop Co., Ltd.</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 text-center italic">Please upload your transfer slip after placing the order.</p>
                    </div>
                  )}
                </div>
              </section>

              <div className="flex gap-4">
                <button 
                  onClick={() => setCheckoutStep(1)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-3xl font-bold hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleNextStep}
                  className="flex-[2] bg-slate-900 text-white py-5 rounded-3xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                >
                  Review Order
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {checkoutStep === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Order Review */}
              <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-slate-900">Final Review</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery to</h3>
                      {deliveryMethod === 'delivery' ? (
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                          <p className="font-bold text-slate-900 text-lg">{address.name}</p>
                          <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                            <Phone size={14} className="text-slate-400" />
                            {address.phone}
                          </p>
                          <p className="text-sm text-slate-500 mt-3 leading-relaxed flex items-start gap-2">
                            <MapPin size={14} className="text-slate-400 mt-1 flex-shrink-0" />
                            <span>{address.details}, {address.province}, {address.zip}</span>
                          </p>
                          <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <span className="text-xl">{(deliveryType === 'instant' ? INSTANT_SERVICES : STANDARD_SERVICES).find(s => s.id === (deliveryType === 'instant' ? selectedInstantService : selectedStandardService))?.icon}</span>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</p>
                                <p className="text-xs font-bold text-slate-900">{(deliveryType === 'instant' ? INSTANT_SERVICES : STANDARD_SERVICES).find(s => s.id === (deliveryType === 'instant' ? selectedInstantService : selectedStandardService))?.name}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
                              {deliveryType === 'instant' ? 'Express' : 'Standard'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                          <p className="font-bold text-slate-900 text-lg">{BRANCHES.find(b => b.id === selectedBranch)?.name}</p>
                          <p className="text-sm text-slate-500 mt-2 leading-relaxed flex items-start gap-2">
                            <MapPin size={14} className="text-slate-400 mt-1 flex-shrink-0" />
                            <span>{BRANCHES.find(b => b.id === selectedBranch)?.address}</span>
                          </p>
                          <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                                <Clock size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Time</p>
                                <p className="text-xs font-bold text-slate-900">Ready in 30-60 mins</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-widest">Self-Pickup</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Payment via</h3>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          {paymentMethod === 'card' ? <CreditCard size={20} /> : paymentMethod === 'qr' ? 'QR' : 'BK'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'qr' ? 'PromptPay' : 'Bank Transfer'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {paymentMethod === 'card' ? 'Visa **** 4242' : paymentMethod === 'qr' ? 'Scan QR Code' : 'K-Bank 012-3-45678-9'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Order Notes</h3>
                      <textarea 
                        placeholder="Add special instructions for your order..." 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-emerald-500 h-24 resize-none"
                        value={orderNote}
                        onChange={e => setOrderNote(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex gap-4">
                <button 
                  onClick={() => setCheckoutStep(2)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-3xl font-bold hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-[2] bg-emerald-600 text-white py-5 rounded-3xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Clock size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Confirm & Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 sticky top-32">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900">Summary</h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>
            
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
              {cart.map(item => {
                const hasDiscount = item.originalPrice && item.price < item.originalPrice;
                const badgeText = item.badge || (hasDiscount ? 'SALE' : (item.freeGift || item.selectableGifts) ? 'FREE GIFT' : null);
                
                return (
                  <div key={item.isFreeGift ? `gift-${item.id}-${item.linkedToProductId}` : item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {badgeText && !item.isFreeGift && (
                        <div className={`absolute top-0.5 left-0.5 z-10 px-1 py-0.5 rounded text-[6px] font-bold text-white shadow-sm flex items-center gap-1 ${
                          badgeText.toUpperCase() === 'SALE' ? 'bg-rose-500' : 
                          badgeText.toUpperCase() === 'FREE GIFT' ? 'bg-emerald-500' : 
                          'bg-slate-900'
                        }`}>
                          {badgeText}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        <span className="text-sm font-bold text-slate-900">
                          {item.isFreeGift ? (
                            <span className="text-emerald-600">FREE</span>
                          ) : (
                            `$${(item.price * item.quantity).toFixed(2)}`
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              {pointsRedeemed > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Points Discount</span>
                  </div>
                  <span className="font-bold text-emerald-600">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Shipping</span>
                </div>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-6 border-t border-slate-100">
                <span className="text-xl font-display font-bold text-slate-900">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-display font-bold text-emerald-600 block">${total.toFixed(2)}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Incl. VAT</p>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">!</div>
                {error}
              </motion.div>
            )}

            {checkoutStep === 3 && (
              <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
                By confirming your order, you agree to our <br />
                <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
