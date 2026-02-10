import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@fur-co/utils';

export default function AddressForm({ onSubmit, onCancel, initialData = null, loading = false }) {
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || '',
        phone: initialData?.phone || '',
        addressLine1: initialData?.addressLine1 || '',
        addressLine2: initialData?.addressLine2 || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        postalCode: initialData?.postalCode || '',
        isDefault: initialData?.isDefault || false,
        label: initialData?.label || 'Home'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="rounded-xl border-white/60 bg-white/50 focus:bg-white transition-all font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 99999 99999"
                        required
                        className="rounded-xl border-white/60 bg-white/50 focus:bg-white transition-all font-bold"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="addressLine1" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Address line 1</Label>
                <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="House No, Street Name"
                    required
                    className="rounded-xl border-white/60 bg-white/50 focus:bg-white transition-all font-bold"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="addressLine2" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Address line 2 (Optional)</Label>
                <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, Landmark, etc."
                    className="rounded-xl border-white/60 bg-white/50 focus:bg-white transition-all font-bold"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-gray-500">City</Label>
                    <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        required
                        className="rounded-xl border-white/60 bg-white/50 focus:bg-white transition-all font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state" className="text-[10px] font-black uppercase tracking-widest text-gray-500">State</Label>
                    <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        required
                        className="rounded-xl border-white/60 bg-white/50 focus:bg-white transition-all font-bold"
                    />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="postalCode" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Postal Code</Label>
                    <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="400001"
                        required
                        className="rounded-xl border-white/60 bg-white/50 focus:bg-white transition-all font-bold"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
                <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData(p => ({ ...p, isDefault: !!checked }))}
                />
                <Label htmlFor="isDefault" className="text-xs font-bold text-gray-600 cursor-pointer">Set as default address</Label>
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 rounded-xl h-12 font-black border-black/10 hover:bg-black/5"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-3 bg-black text-[#ffcc00] hover:bg-gray-800 rounded-xl h-12 font-black shadow-lg"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Address'}
                </Button>
            </div>
        </form>
    );
}
