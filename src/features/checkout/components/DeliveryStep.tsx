import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ExternalLink, MapPin, Package, Phone, Truck } from 'lucide-react';

import { PickupBranch, ShippingService, AddressForm, DeliveryMethod, DeliveryType } from '../types';

interface DeliveryStepProps {
  deliveryMethod: DeliveryMethod;
  deliveryType: DeliveryType;
  selectedBranch: number;
  selectedInstantService: string;
  selectedStandardService: string;
  address: AddressForm;
  branches: PickupBranch[];
  instantServices: ShippingService[];
  standardServices: ShippingService[];
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  onDeliveryTypeChange: (type: DeliveryType) => void;
  onSelectedBranchChange: (branchId: number) => void;
  onSelectedInstantServiceChange: (serviceId: string) => void;
  onSelectedStandardServiceChange: (serviceId: string) => void;
  onAddressChange: (field: keyof AddressForm, value: string) => void;
  onContinue: () => void;
}

export const DeliveryStep = ({
  deliveryMethod,
  deliveryType,
  selectedBranch,
  selectedInstantService,
  selectedStandardService,
  address,
  branches,
  instantServices,
  standardServices,
  onDeliveryMethodChange,
  onDeliveryTypeChange,
  onSelectedBranchChange,
  onSelectedInstantServiceChange,
  onSelectedStandardServiceChange,
  onAddressChange,
  onContinue,
}: DeliveryStepProps) => {
  const activeServices = deliveryType === 'instant' ? instantServices : standardServices;
  const selectedServiceId = deliveryType === 'instant' ? selectedInstantService : selectedStandardService;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-secondary/25 rounded-xl flex items-center justify-center">
            <Truck className="text-primary" size={20} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Delivery Method</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <button
            onClick={() => onDeliveryMethodChange('delivery')}
            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-5 ${deliveryMethod === 'delivery' ? 'border-primary bg-secondary/30' : 'border-slate-100 hover:border-secondary'}`}
          >
            <div className={`p-4 rounded-2xl ${deliveryMethod === 'delivery' ? 'bg-primary text-white shadow-lg shadow-secondary/70' : 'bg-slate-100 text-slate-400'}`}>
              <Package size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Home Delivery</h3>
              <p className="text-sm text-slate-500 mt-1">Ship to your doorstep</p>
            </div>
          </button>

          <button
            onClick={() => onDeliveryMethodChange('pickup')}
            className={`p-6 rounded-3xl border-2 transition-all text-left flex items-start gap-5 ${deliveryMethod === 'pickup' ? 'border-primary bg-secondary/30' : 'border-slate-100 hover:border-secondary'}`}
          >
            <div className={`p-4 rounded-2xl ${deliveryMethod === 'pickup' ? 'bg-primary text-white shadow-lg shadow-secondary/70' : 'bg-slate-100 text-slate-400'}`}>
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
                onClick={() => onDeliveryTypeChange('standard')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${deliveryType === 'standard' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Standard Delivery
              </button>
              <button
                onClick={() => onDeliveryTypeChange('instant')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${deliveryType === 'instant' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Instant Delivery
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    if (deliveryType === 'instant') {
                      onSelectedInstantServiceChange(service.id);
                      return;
                    }

                    onSelectedStandardServiceChange(service.id);
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col gap-3 ${selectedServiceId === service.id ? 'border-primary bg-secondary/45' : 'border-slate-100 hover:border-secondary/70'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="text-xs font-bold text-primary bg-secondary/60 px-2 py-1 rounded-lg">${service.price}</span>
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
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={address.name}
                  onChange={(event) => onAddressChange('name', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 0812345678"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={address.phone}
                  onChange={(event) => onAddressChange('phone', event.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Address Details</label>
                <textarea
                  placeholder="Street name, Building, House No."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all h-24 resize-none"
                  value={address.details}
                  onChange={(event) => onAddressChange('details', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Province</label>
                <input
                  type="text"
                  placeholder="e.g. Bangkok"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={address.province}
                  onChange={(event) => onAddressChange('province', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Zip Code</label>
                <input
                  type="text"
                  placeholder="e.g. 10110"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={address.zip}
                  onChange={(event) => onAddressChange('zip', event.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm font-bold text-slate-900 mb-2">Select a Pickup Branch</p>
            <div className="grid grid-cols-1 gap-4">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => onSelectedBranchChange(branch.id)}
                  className={`w-full p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-6 group ${selectedBranch === branch.id ? 'border-primary bg-secondary/30' : 'border-slate-100 hover:border-secondary/70'}`}
                >
                  <div className={`p-4 rounded-2xl transition-all ${selectedBranch === branch.id ? 'bg-primary text-white shadow-lg shadow-secondary/70' : 'bg-slate-100 text-slate-400 group-hover:bg-secondary/25 group-hover:text-primary'}`}>
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
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                        onClick={(event) => event.stopPropagation()}
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
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedBranch === branch.id ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                    {selectedBranch === branch.id && <CheckCircle2 size={18} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <button
        onClick={onContinue}
        className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
      >
        Continue to Payment
        <ArrowRight size={20} />
      </button>
    </motion.div>
  );
};


