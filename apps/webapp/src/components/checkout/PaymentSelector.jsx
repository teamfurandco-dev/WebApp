import { CreditCard, Smartphone, Landmark } from 'lucide-react';
import { cn } from '@fur-co/utils';

const PAYMENT_METHODS = [
    {
        id: 'upi',
        label: 'UPI',
        description: 'Google Pay, PhonePe, Paytm',
        icon: Smartphone,
        color: 'bg-black text-[#ffcc00]',
        accent: '#ffcc00'
    },
    {
        id: 'card',
        label: 'Card',
        description: 'Credit / Debit Cards',
        icon: CreditCard,
        color: 'bg-black text-[#ffcc00]',
        accent: '#ffcc00'
    },
    {
        id: 'netbanking',
        label: 'Net Banking',
        description: 'All Indian Banks',
        icon: Landmark,
        color: 'bg-black text-[#ffcc00]',
        accent: '#ffcc00'
    }
];

export default function PaymentSelector({ selectedMethod, onSelect }) {
    return (
        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-xl overflow-hidden">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-900 font-peace-sans uppercase tracking-tighter">
                <div className="p-2 bg-black rounded-lg">
                    <CreditCard className="w-5 h-5 text-[#ffcc00]" />
                </div>
                Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_METHODS.map(method => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <button
                            key={method.id}
                            onClick={() => onSelect(method.id)}
                            className={cn(
                                'group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all relative overflow-hidden text-left',
                                isSelected
                                    ? 'border-black bg-white shadow-xl scale-[1.02]'
                                    : 'border-white/60 bg-white/20 hover:border-black/20 hover:bg-white/40 hover:scale-[1.01]'
                            )}
                        >
                            <div className={cn(
                                'w-12 h-12 flex items-center justify-center rounded-2xl transition-all',
                                isSelected ? method.color : 'bg-white/60 text-gray-400 group-hover:text-black'
                            )}>
                                <Icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-gray-900 uppercase tracking-tight text-sm">{method.label}</span>
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest line-clamp-1">
                                    {method.description}
                                </p>
                            </div>

                            {isSelected && (
                                <div className="absolute right-[-10px] bottom-[-10px] opacity-5">
                                    <Icon className="w-20 h-20 text-black" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-black/5 border border-black/5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-4 h-4 rounded-full border-2 border-dashed border-black opacity-40 animate-spin-slow" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Secure Transaction</p>
                    <p className="text-[10px] font-bold text-gray-600 leading-tight">
                        All payments are processed through Razorpay's secure payment gateway. Your data is protected by 256-bit SSL encryption.
                    </p>
                </div>
            </div>
        </div>
    );
}
