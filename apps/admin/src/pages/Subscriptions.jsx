import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RefreshCw, User, Package, Calendar, Tag, ChevronRight, X } from 'lucide-react';
import Loading from '../components/Loading';

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [error, setError] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/unlimited-fur/admin/subscriptions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSubscriptions(data.data || []);
            } else {
                setError('Failed to fetch subscriptions');
            }
        } catch (err) {
            setError('Error loading subscriptions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch =
            sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || sub.planStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-700 border-green-200',
            paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200',
            draft: 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading && subscriptions.length === 0) {
        return <Loading text="Loading subscriptions..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
                    <p className="text-gray-500 mt-1">Manage Unlimited Fur monthly plans</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="draft">Draft</option>
                </select>
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all w-full"
                    />
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}><X className="w-5 h-5" /></button>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pet / Budget</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Next Billing</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredSubscriptions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold mr-3">
                                            {sub.user?.name?.[0] || sub.user?.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{sub.user?.name || 'Anonymous'}</div>
                                            <div className="text-xs text-gray-500">{sub.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 capitalize">{sub.petType} Pack</div>
                                    <div className="text-xs text-gray-500">{formatCurrency(sub.monthlyBudget)}/mo</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(sub.planStatus)}`}>
                                        {sub.planStatus.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setSelectedSub(sub)}
                                        className="text-furco-yellow hover:text-yellow-600 flex items-center justify-end ml-auto"
                                    >
                                        Details <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredSubscriptions.length === 0 && (
                    <div className="text-center py-20">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <div className="text-gray-500 font-medium">No subscriptions found matching your filters.</div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSub && (
                <div className="fixed inset-0 z-50 flex items-center justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedSub(null)} />
                    <div className="relative bg-white w-full max-w-lg h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold font-peace-sans text-gray-900">Subscription Detail</h2>
                                    <p className="text-sm text-gray-500 mt-1">ID: {selectedSub.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSub(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* User Info */}
                                <div className="bg-gray-50 p-6 rounded-2xl">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Info</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-furco-yellow flex items-center justify-center text-white font-bold text-xl">
                                            {selectedSub.user?.name?.[0] || selectedSub.user?.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{selectedSub.user?.name}</div>
                                            <div className="text-sm text-gray-500">{selectedSub.user?.email}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-gray-100 p-4 rounded-2xl">
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Status</div>
                                        <div className={`text-sm font-bold capitalize ${selectedSub.planStatus === 'active' ? 'text-green-600' :
                                                selectedSub.planStatus === 'paused' ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {selectedSub.planStatus}
                                        </div>
                                    </div>
                                    <div className="border border-gray-100 p-4 rounded-2xl">
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Monthly Budget</div>
                                        <div className="text-sm font-bold text-gray-900">{formatCurrency(selectedSub.monthlyBudget)}</div>
                                    </div>
                                    <div className="border border-gray-100 p-4 rounded-2xl">
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Billing Day</div>
                                        <div className="text-sm font-bold text-gray-900">{selectedSub.billingCycleDay || 'N/A'}</div>
                                    </div>
                                    <div className="border border-gray-100 p-4 rounded-2xl">
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Next Billing</div>
                                        <div className="text-sm font-bold text-gray-900">
                                            {selectedSub.nextBillingDate ? new Date(selectedSub.nextBillingDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Products */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Product Pack</h3>
                                    <div className="space-y-3">
                                        {selectedSub.products?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                                                        {item.product?.images?.[0] && (
                                                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{item.product?.name}</div>
                                                        <div className="text-xs text-gray-500">{item.variant?.name} × {item.quantity}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(item.lockedPrice * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions placeholder */}
                                <div className="pt-6 border-t border-gray-100">
                                    <button
                                        disabled
                                        className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold cursor-not-allowed"
                                    >
                                        Force Sync (Coming Soon)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
