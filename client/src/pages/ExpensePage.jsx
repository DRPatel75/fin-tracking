import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import NeonButton from '../components/NeonButton';

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const { data } = await api.get('/expense');
        setExpenses(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/expense', formData);
        setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], description: '' });
        fetchExpenses();
    };

    const handleDelete = async (id) => {
        await api.delete(`/expense/${id}`);
        fetchExpenses();
    };

    return (
        <Layout>
            <h2 className="text-3xl font-bold mb-8 text-red-400">Expense Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <GlassCard className="h-fit">
                    <h3 className="text-xl font-semibold mb-6">Add Expense</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <GlassInput
                            type="text"
                            placeholder="Title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                            className="w-full bg-gray-800/50 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        <NeonButton variant="danger" className="w-full">
                            Add Expense
                        </NeonButton>
                    </form>
                </GlassCard>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
                    {expenses.map(expense => (
                        <GlassCard key={expense._id} className="flex justify-between items-center p-4 hover:bg-white/5 transition duration-200">
                            <div>
                                <p className="font-bold text-lg">{expense.title}</p>
                                <p className="text-sm text-gray-400">{new Date(expense.date).toLocaleDateString()} • {expense.category}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-red-400 font-bold text-xl">-${expense.amount}</span>
                                <button onClick={() => handleDelete(expense._id)} className="text-red-500 hover:text-red-300 transition">
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

export default ExpensePage;
