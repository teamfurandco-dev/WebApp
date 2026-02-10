import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@fur-co/utils';
import { api } from '@/services/api';
import { toast } from 'sonner';
import AddressForm from './AddressForm';

export default function AddressSection({ selectedAddressId, onSelect }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const data = await api.getAddresses();
            setAddresses(data);

            // Auto-select default if none selected
            if (!selectedAddressId) {
                const defaultAddr = data.find(a => a.isDefault);
                if (defaultAddr) onSelect(defaultAddr.id);
                else if (data.length > 0) onSelect(data[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
            toast.error('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (formData) => {
        try {
            setSaving(true);
            const newAddress = await api.addAddress(formData);
            setAddresses(prev => [...prev, newAddress]);
            onSelect(newAddress.id);
            setShowForm(false);
            toast.success('Address added successfully');
        } catch (err) {
            console.error('Failed to add address:', err);
            toast.error('Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-xl overflow-hidden min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-xl font-black flex items-center gap-3 text-gray-900 font-peace-sans uppercase tracking-tighter">
                    <div className="p-2 bg-black rounded-lg">
                        <MapPin className="w-5 h-5 text-[#ffcc00]" />
                    </div>
                    Delivery Address
                </h2>
                {!showForm && addresses.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowForm(true)}
                        className="text-[10px] font-black uppercase tracking-widest text-black hover:bg-black/5"
                    >
                        <Plus className="w-3 h-3 mr-1" /> New Address
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest">Loading stored addresses...</p>
                </div>
            ) : showForm ? (
                <AddressForm
                    onSubmit={handleAddAddress}
                    onCancel={() => setShowForm(false)}
                    loading={saving}
                />
            ) : addresses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-black/10 rounded-3xl bg-black/5 animate-pulse">
                    <MapPin className="w-10 h-10 text-gray-300 mb-4" />
                    <p className="text-sm font-bold text-gray-600 mb-4">No addresses found</p>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-black text-[#ffcc00] hover:bg-gray-800 rounded-xl font-black px-6"
                    >
                        Add Your First Address
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                        <button
                            key={addr.id}
                            onClick={() => onSelect(addr.id)}
                            className={cn(
                                'relative text-left p-5 rounded-3xl border-2 transition-all group overflow-hidden',
                                selectedAddressId === addr.id
                                    ? 'border-black bg-white shadow-xl scale-[1.02]'
                                    : 'border-white/60 bg-white/20 hover:border-black/20 hover:bg-white/30 hover:scale-[1.01]'
                            )}
                        >
                            {selectedAddressId === addr.id && (
                                <div className="absolute top-3 right-3 bg-black text-[#ffcc00] p-1 rounded-full">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black bg-black text-[#ffcc00] px-2 py-0.5 rounded uppercase tracking-widest">
                                        {addr.label || 'Address'}
                                    </span>
                                    {addr.isDefault && (
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default</span>
                                    )}
                                </div>
                                <div className="font-black text-gray-900 mb-1 uppercase tracking-tight line-clamp-1">{addr.fullName}</div>
                                <div className="text-xs text-gray-600 font-bold leading-relaxed line-clamp-3">
                                    {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                                    {addr.city}, {addr.state} - {addr.postalCode}
                                </div>
                                <div className="mt-4 pt-4 border-t border-black/5 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    Phone: <span className="text-gray-900">{addr.phone}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
