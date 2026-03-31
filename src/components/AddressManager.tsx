import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { Address, dataService, handleDataError, OperationType } from '../services/dataService';

const emptyForm: Partial<Address> = {
  label: '',
  fullName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Thailand',
  isDefault: false,
};

const AddressManager: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>(emptyForm);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    dataService.getAddresses(user.uid)
      .then(setAddresses)
      .catch((nextError) => {
        const normalized = handleDataError(nextError, OperationType.LIST, 'addresses');
        setError(normalized.message || 'Failed to load addresses.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setError(null);
    const payload = { ...formData, uid: user.uid } as Omit<Address, 'id'>;

    try {
      const updated = editingId
        ? await dataService.updateAddress(user.uid, editingId, payload)
        : await dataService.createAddress(user.uid, payload);
      setAddresses(updated);
      resetForm();
    } catch (nextError) {
      const normalized = handleDataError(
        nextError,
        editingId ? OperationType.UPDATE : OperationType.CREATE,
        'addresses'
      );
      setError(normalized.message || 'Failed to save address.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    setError(null);
    try {
      const updated = await dataService.deleteAddress(user.uid, id);
      setAddresses(updated);
    } catch (nextError) {
      const normalized = handleDataError(nextError, OperationType.DELETE, 'addresses');
      setError(normalized.message || 'Failed to delete address.');
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
          onClick={() => {
            setEditingId(null);
            setFormData(emptyForm);
            setIsAdding(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSave} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Label (e.g. Home, Work)</label>
              <input
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.label}
                onChange={(event) => setFormData({ ...formData, label: event.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Full Name</label>
              <input
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.fullName}
                onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Street Address</label>
              <input
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.street}
                onChange={(event) => setFormData({ ...formData, street: event.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">City</label>
              <input
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.city}
                onChange={(event) => setFormData({ ...formData, city: event.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">State / Province</label>
              <input
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.state}
                onChange={(event) => setFormData({ ...formData, state: event.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">ZIP / Postal Code</label>
              <input
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.zipCode}
                onChange={(event) => setFormData({ ...formData, zipCode: event.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Country</label>
              <input
                required
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                value={formData.country}
                onChange={(event) => setFormData({ ...formData, country: event.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={Boolean(formData.isDefault)}
              onChange={(event) => setFormData({ ...formData, isDefault: event.target.checked })}
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
              onClick={resetForm}
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
              <div className="absolute top-4 right-4 flex items-center gap-1 text-primary bg-secondary/25 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
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
