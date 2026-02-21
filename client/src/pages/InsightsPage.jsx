import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';

const InsightsPage = () => {
    const [insightsData, setInsightsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const { data } = await api.get('/insights');
                setInsightsData(data);
            } catch (error) {
                console.error('Failed to fetch insights');
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    if (loading) return (
        <Layout>
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <h2 className="text-3xl font-bold mb-8 text-cyan-400 text-glow">Smart Financial Insights</h2>

            {insightsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <GlassCard className="border-l-4 border-l-purple-500">
                        <p className="text-gray-400 text-sm">Monthly Remaining</p>
                        <p className="text-3xl font-bold text-purple-400">${insightsData.remainingBudget.toLocaleString()}</p>
                    </GlassCard>
                    <GlassCard className="border-l-4 border-l-green-500">
                        <p className="text-gray-400 text-sm">Safe Daily Spend</p>
                        <p className="text-3xl font-bold text-green-400">${insightsData.dailySafeSpend}</p>
                    </GlassCard>
                    <GlassCard className="border-l-4 border-l-orange-500">
                        <p className="text-gray-400 text-sm">Total Spent</p>
                        <p className="text-3xl font-bold text-orange-400">${insightsData.totalSpent.toLocaleString()}</p>
                    </GlassCard>
                    <GlassCard className="border-l-4 border-l-blue-500">
                        <p className="text-gray-400 text-sm">Days Left in Month</p>
                        <p className="text-3xl font-bold text-blue-400">{insightsData.daysRemaining}</p>
                    </GlassCard>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">AI-Powered Insights</h3>
                    {insightsData?.insights.length === 0 ? (
                        <GlassCard className="text-center py-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p className="text-gray-400">Everything looks great! No significant variances detected yet.</p>
                        </GlassCard>
                    ) : (
                        insightsData?.insights.map((insight, idx) => (
                            <GlassCard
                                key={idx}
                                className={`flex items-start gap-4 transition-transform hover:scale-[1.01] ${insight.type === 'danger' ? 'bg-red-500/5' :
                                        insight.type === 'warning' ? 'bg-orange-500/5' :
                                            insight.type === 'success' ? 'bg-green-500/5' : 'bg-blue-500/5'
                                    }`}
                            >
                                <div className={`mt-1 p-2 rounded-lg ${insight.type === 'danger' ? 'bg-red-500/20 text-red-500' :
                                        insight.type === 'warning' ? 'bg-orange-500/20 text-orange-500' :
                                            insight.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                                    }`}>
                                    {insight.type === 'danger' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    )}
                                    {(insight.type === 'warning' || insight.type === 'info') && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {insight.type === 'success' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold uppercase text-xs mb-1 ${insight.type === 'danger' ? 'text-red-400' :
                                            insight.type === 'warning' ? 'text-orange-400' :
                                                insight.type === 'success' ? 'text-green-400' : 'text-blue-400'
                                        }`}>
                                        {insight.category}
                                    </p>
                                    <p className="text-gray-300">{insight.message}</p>
                                </div>
                            </GlassCard>
                        ))
                    )}
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Budget Outlook</h3>
                    <GlassCard>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Total Budget Status</span>
                                    <span className="text-gray-300">{Math.round((insightsData?.totalSpent / insightsData?.totalBudgetLimit) * 100) || 0}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        style={{ width: `${Math.min((insightsData?.totalSpent / insightsData?.totalBudgetLimit) * 100, 100) || 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-700">
                                <p className="text-xs text-gray-500 italic">"Wealth consists not in having great possessions, but in having few wants." - Epictetus</p>
                            </div>
                        </div>
                    </GlassCard>

                    <h3 className="text-xl font-semibold text-gray-200">Quick Tips</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-400">
                            💡 Use the <span className="text-blue-400 font-medium">Upload Statement</span> feature to avoid manual entry.
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-400">
                            📊 Check <span className="text-purple-400 font-medium">Daily Safe Spend</span> frequently to stay on track.
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InsightsPage;
