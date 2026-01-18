import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await api.get('/summary');
                setSummary(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSummary();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Chart Data
    const barData = summary ? {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                label: 'Amount ($)',
                data: [summary.totalIncome, summary.totalExpense],
                backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)'],
                borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
                borderWidth: 1,
            },
        ],
    } : null;

    return (
        <Layout>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user?.name}</span>
                    <NeonButton variant="danger" onClick={handleLogout}>
                        Logout
                    </NeonButton>
                </div>
            </header>

            {summary ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <GlassCard>
                            <h3 className="text-gray-400 mb-2">Total Income</h3>
                            <p className="text-3xl font-bold text-green-400">${summary.totalIncome.toLocaleString()}</p>
                        </GlassCard>
                        <GlassCard>
                            <h3 className="text-gray-400 mb-2">Total Expense</h3>
                            <p className="text-3xl font-bold text-red-400">${summary.totalExpense.toLocaleString()}</p>
                        </GlassCard>
                        <GlassCard>
                            <h3 className="text-gray-400 mb-2">Balance</h3>
                            <p className="text-3xl font-bold text-blue-400">${summary.balance.toLocaleString()}</p>
                        </GlassCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-4">Financial Overview</h3>
                            <div className="h-64">
                                <Bar
                                    data={barData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: false }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                                            },
                                            x: {
                                                grid: { display: false },
                                                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </GlassCard>
                        <GlassCard className="h-80 overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                            {summary.recentTransactions?.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No transactions yet.</p>
                            ) : (
                                summary.recentTransactions?.map((txn, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0 hover:bg-white/5 px-2 rounded transition">
                                        <div>
                                            <p className="font-semibold">{txn.source || txn.title}</p>
                                            <p className="text-sm text-gray-400">{new Date(txn.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className={txn.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                                            {txn.type === 'income' ? '+' : '-'}${txn.amount}
                                        </span>
                                    </div>
                                ))
                            )}
                        </GlassCard>
                    </div>
                </>
            ) : (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
