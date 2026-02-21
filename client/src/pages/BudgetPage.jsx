import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import NeonButton from '../components/NeonButton';

const BudgetPage = () => {
    const { user } = useContext(AuthContext);
    const [budgets, setBudgets] = useState([]);
    const [insights, setInsights] = useState(null);
    const [formData, setFormData] = useState({
        category: 'Food',
        limit: '',
        month: 'January',
        year: new Date().getFullYear()
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [budgetRes, insightsRes] = await Promise.all([
                api.get('/budget'),
                api.get('/insights')
            ]);
            setBudgets(budgetRes.data);
            setInsights(insightsRes.data);
        } catch (error) {
            console.error('Failed to fetch data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/budget', formData);
        setFormData({ category: 'Food', limit: '', month: 'January', year: new Date().getFullYear() });
        fetchData();
    };

    const handleDelete = async (id) => {
        await api.delete(`/budget/${id}`);
        fetchData();
    };

    return (
        <Layout>
            <h2 className="text-3xl font-bold mb-8 text-purple-400">Budget Management</h2>

            {insights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <GlassCard className="border-l-4 border-l-purple-500">
                        <p className="text-gray-400 text-sm">Monthly Limit</p>
                        <p className="text-2xl font-bold text-white">${insights.totalBudgetLimit.toLocaleString()}</p>
                    </GlassCard>
                    <GlassCard className="border-l-4 border-l-blue-500">
                        <p className="text-gray-400 text-sm">Amount Used</p>
                        <p className="text-2xl font-bold text-white">${insights.totalSpent.toLocaleString()}</p>
                    </GlassCard>
                    <GlassCard className="border-l-4 border-l-green-500">
                        <p className="text-gray-400 text-sm">Daily Safe Spend</p>
                        <p className="text-2xl font-bold text-green-400">${insights.dailySafeSpend}</p>
                    </GlassCard>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <GlassCard className="h-fit">
                    <h3 className="text-xl font-semibold mb-6">Set Budget</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select
                            className="w-full bg-gray-800/50 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Food</option>
                            <option>Transport</option>
                            <option>Utilities</option>
                            <option>Entertainment</option>
                            <option>Health</option>
                            <option>Other</option>
                        </select>
                        <GlassInput
                            type="number"
                            placeholder="Limit Amount"
                            required
                            value={formData.limit}
                            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                        />
                        <select
                            className="w-full bg-gray-800/50 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        >
                            <option>January</option>
                            <option>February</option>
                            <option>March</option>
                            <option>April</option>
                            <option>May</option>
                            <option>June</option>
                            <option>July</option>
                            <option>August</option>
                            <option>September</option>
                            <option>October</option>
                            <option>November</option>
                            <option>December</option>
                        </select>
                        <GlassInput
                            type="number"
                            placeholder="Year"
                            required
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                        <NeonButton className="w-full bg-purple-600 hover:bg-purple-700 shadow-purple-500/50">
                            Set Budget
                        </NeonButton>
                    </form>
                </GlassCard>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Current Budgets</h3>
                    {budgets.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No budgets set yet.</p>
                    ) : (
                        budgets.map(budget => {
                            const percent = Math.min((budget.spent / budget.limit) * 100, 100);
                            const isExceeded = budget.spent > budget.limit;

                            return (
                                <GlassCard key={budget._id} className="relative overflow-hidden group hover:bg-white/5 transition duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-xl text-white">{budget.category}</p>
                                                {isExceeded && (
                                                    <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/50 animate-pulse">
                                                        Exceeded
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400">{budget.month} {budget.year}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400 mb-1">Budget Limit</p>
                                            <p className="text-2xl font-bold text-purple-400">${budget.limit.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Spent: <span className={`font-bold ${isExceeded ? 'text-red-400' : 'text-green-400'}`}>${budget.spent.toLocaleString()}</span></span>
                                            <span className="text-gray-400">{Math.round((budget.spent / budget.limit) * 100)}%</span>
                                        </div>
                                        {/* Progress Bar Container */}
                                        <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className={`h-full transition-all duration-500 ease-out ${isExceeded ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                                    percent > 80 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                                                        'bg-gradient-to-r from-green-500 to-emerald-500'
                                                    }`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleDelete(budget._id)}
                                            className="text-red-500/70 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete Budget
                                        </button>
                                    </div>
                                </GlassCard>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Notification Settings Section */}
            <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">Notification Settings</h3>
                <GlassCard className="max-w-2xl">
                    <div className="flex items-center justify-between py-4 border-b border-gray-700">
                        <div>
                            <p className="font-semibold text-white">Budget Alerts</p>
                            <p className="text-sm text-gray-400">Receive emails when you reach 70%, 90%, or 100% of your budget.</p>
                        </div>
                        <button
                            onClick={async () => {
                                const newVal = !user.notifications?.budgetAlerts;
                                await api.put('/users/profile', {
                                    notifications: { ...user.notifications, budgetAlerts: newVal }
                                });
                                window.location.reload(); // Quick way to update user context
                            }}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.notifications?.budgetAlerts ? 'bg-purple-600' : 'bg-gray-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.notifications?.budgetAlerts ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="font-semibold text-white">Daily Summary</p>
                            <p className="text-sm text-gray-400">Receive a daily summary of your spending patterns.</p>
                        </div>
                        <button
                            onClick={async () => {
                                const newVal = !user.notifications?.dailySummary;
                                await api.put('/users/profile', {
                                    notifications: { ...user.notifications, dailySummary: newVal }
                                });
                                window.location.reload();
                            }}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.notifications?.dailySummary ? 'bg-purple-600' : 'bg-gray-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.notifications?.dailySummary ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-xs text-gray-500 italic">* Alerts are sent to: {user?.email}</p>
                        <NeonButton
                            variant="primary"
                            className="text-xs py-1 px-3"
                            onClick={async () => {
                                try {
                                    await api.post('/upload/test-alerts');
                                    alert('Budget check triggered! Check your mail (if budget > 70%).');
                                } catch (err) {
                                    alert('Error triggering check.');
                                }
                            }}
                        >
                            Test Alert System
                        </NeonButton>
                    </div>
                </GlassCard>
            </div>
        </Layout>
    );
};

export default BudgetPage;
