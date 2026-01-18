import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import NeonButton from '../components/NeonButton';

const IncomePage = () => {
    const [incomes, setIncomes] = useState([]);
    const [formData, setFormData] = useState({
        source: '',
        amount: '',
        category: 'Salary',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        const { data } = await api.get('/income');
        setIncomes(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/income', formData);
        setFormData({ source: '', amount: '', category: 'Salary', date: new Date().toISOString().split('T')[0], description: '' });
        fetchIncomes();
    };

    const handleDelete = async (id) => {
        await api.delete(`/income/${id}`);
        fetchIncomes();
    };

    return (
        <Layout>
            <h2 className="text-3xl font-bold mb-8 text-green-400">Income Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <GlassCard className="h-fit">
                    <h3 className="text-xl font-semibold mb-6">Add Income</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <GlassInput
                            type="text"
                            placeholder="Source"
                            required
                            value={formData.source}
                            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        />
                        <GlassInput
                            type="number"
                            placeholder="Amount"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                        <GlassInput
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        <select
                            className="w-full bg-gray-800/50 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Salary</option>
                            <option>Freelance</option>
                            <option>Investments</option>
                            <option>Gift</option>
                            <option>Other</option>
                        </select>
                        <NeonButton variant="success" className="w-full">
                            Add Income
                        </NeonButton>
                    </form>
                </GlassCard>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Recent Incomes</h3>
                    {incomes.map(income => (
                        <GlassCard key={income._id} className="flex justify-between items-center p-4 hover:bg-white/5 transition duration-200">
                            <div>
                                <p className="font-bold text-lg">{income.source}</p>
                                <p className="text-sm text-gray-400">{new Date(income.date).toLocaleDateString()} • {income.category}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-green-400 font-bold text-xl">+${income.amount}</span>
                                <button onClick={() => handleDelete(income._id)} className="text-red-500 hover:text-red-400 transition">
                                    Delete
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default IncomePage;
