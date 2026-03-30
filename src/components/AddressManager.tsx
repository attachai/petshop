import React, { useState, useEffect } from 'react';
import { authStore } from '../services/authService';
import { dataService, Address, OperationType, handleDataError } from '../services/dataService';
import { MapPin, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';

const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    label: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false
  });

  useEffect(() => {
    if (!authStore.currentUser) return;
    dataService.getAddresses(authStore.currentUser.uid)
      .then(setAddresses)
      .catch(e => handleDataError(e, OperationType.LIST, 'addresses'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authStore.currentUser) return;
    const uid = authStore.currentUser.uid;
    const data = { ...formData, uid } as Omit<Address, 'id'>;
    const reset = () => {
      setIsAdding(false);
      setEditingId(null);
      setFormData({ label: '', fullName: '', street: '', city: '', state: '', zipCode: '', country: 'Thailand', isDefault: false });
    };
    try {
      const updated = editingId
        ? await dataService.updateAddress(uid, editingId, data)
        : await dataService.createAddress(uid, data);
      setAddresses(updated);
      reset();
    } catch (error) {
      handleDataError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'addresses');
    }
  };

  const handleDelete = async (id: string) => {
    if (!authStore.currentUser) return;
    try {
      const updated = await dataService.deleteAddress(authStore.currentUser.uid, id);
      setAddresses(updated);
    } catch (error) {
      handleDataError(error, OperationType.DELETE, 'addresses');
    }
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAdding(true);
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading addresses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-zinc-900">Saved Addresses</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Label (e.g. Home, Work)</label>
              <input 
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.label}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Full Name</label>
              <input 
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Street Address</label>
              <input 
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.street}
                onChange={e => setFormData({ ...formData, street: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">City</label>
              <input 
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">State / Province</label>
              <input 
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">ZIP / Postal Code</label>
              <input 
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.zipCode}
                onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Country</label>
              <input 
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isDefault"
              checked={formData.isDefault}
              onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
            />
            <label htmlFor="isDefault" className="text-sm text-zinc-600">Set as default address</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="submit"
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button 
              type="button"
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-6 py-2 bg-white text-zinc-600 border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm relative group">
            {address.isDefault && (
              <div className="absolute top-4 right-4 flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" />
                Default
              </div>
            )}
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-zinc-50 rounded-lg">
                <MapPin className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900">{address.label}</h4>
                <p className="text-sm text-zinc-600">{address.fullName}</p>
              </div>
            </div>
            <div className="text-sm text-zinc-500 space-y-0.5">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>
            <div className="flex gap-4 mt-6 pt-4 border-t border-zinc-50">
              <button 
                onClick={() => handleEdit(address)}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button 
                onClick={() => handleDelete(address.id)}
                className="text-xs font-medium text-rose-500 hover:text-rose-700 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !isAdding && (
        <div className="p-12 text-center bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
          <h3 className="text-lg font-medium text-zinc-900">No addresses saved</h3>
          <p className="text-zinc-500">Add your shipping addresses for a faster checkout experience.</p>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
