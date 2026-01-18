import { useState, useEffect } from 'react';
import api from '../services/api';
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
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const ReportsPage = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/summary?startDate=${startDate}&endDate=${endDate}`);
                setSummary(data);
            } catch (error) {
                console.error('Error fetching summary data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [startDate, endDate]);

    if (!summary && loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </Layout>
        );
    }

    if (!summary) return null;

    // Charts Data
    const barData = {
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
    };

    const doughnutData = {
        labels: summary.expenseByCategory.map(item => item._id),
        datasets: [
            {
                data: summary.expenseByCategory.map(item => item.total),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // CSV Export Function
    const exportToCSV = () => {
        if (!summary) return;

        const headers = ['Date', 'Type', 'Category', 'Description', 'Amount ($)'];
        const rows = [
            ['SUMMARY', '', '', '', ''],
            ['Total Income', '', '', '', summary.totalIncome],
            ['Total Expenses', '', '', '', summary.totalExpense],
            ['Net Balance', '', '', '', summary.balance],
            ['', '', '', '', ''],
            ['DETAILED TRANSACTIONS', '', '', '', ''],
            ...summary.allTransactions.map(txn => [
                new Date(txn.date).toLocaleDateString(),
                txn.type.charAt(0).toUpperCase() + txn.type.slice(1),
                txn.category,
                txn.description || txn.title || txn.source || '-',
                txn.amount
            ])
        ];

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
                    Financial Reports & Analytics
                </h2>
                <div className="flex flex-wrap gap-4 items-center bg-gray-800/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1 ml-1">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-gray-700/50 border border-gray-600 text-white text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1 ml-1">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-gray-700/50 border border-gray-600 text-white text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Income vs Expense Bar Chart */}
                <GlassCard>
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">Income vs Expense</h3>
                    <div className="h-64 md:h-80">
                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'top' }, title: { display: false } },
                                scales: { y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { grid: { display: false } } }
                            }}
                        />
                    </div>
                </GlassCard>

                {/* Expense Distribution Doughnut Chart */}
                <GlassCard>
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">Expense Distribution</h3>
                    <div className="h-64 md:h-80 flex justify-center">
                        <Doughnut
                            data={doughnutData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            color: 'white',
                                            boxWidth: 15,
                                            padding: 15
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </GlassCard>
            </div>

            {/* Summary Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="bg-gradient-to-br from-gray-800 to-gray-900 transform hover:scale-105 transition duration-300">
                    <h4 className="text-gray-400">Total Income</h4>
                    <p className="text-2xl font-bold text-green-400">${summary.totalIncome.toLocaleString()}</p>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-gray-800 to-gray-900 transform hover:scale-105 transition duration-300">
                    <h4 className="text-gray-400">Total Expenses</h4>
                    <p className="text-2xl font-bold text-red-400">${summary.totalExpense.toLocaleString()}</p>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-gray-800 to-gray-900 transform hover:scale-105 transition duration-300">
                    <h4 className="text-gray-400">Net Balance</h4>
                    <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                        ${summary.balance.toLocaleString()}
                    </p>
                </GlassCard>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <NeonButton onClick={exportToCSV} variant="secondary">
                    Export Report (CSV)
                </NeonButton>
                <NeonButton onClick={() => window.print()} variant="primary">
                    Export Report (PDF)
                </NeonButton>
            </div>
        </Layout>
    );
};

export default ReportsPage;
