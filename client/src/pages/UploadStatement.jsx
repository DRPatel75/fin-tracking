import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

const UploadStatement = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/upload/history');
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch upload history');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: data.message });
            setFile(null);
            fetchHistory();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Layout>
            <h2 className="text-3xl font-bold mb-8 text-blue-400 text-glow">Upload Bank Statement</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="lg:col-span-1 h-fit">
                    <h3 className="text-xl font-semibold mb-4">Select File</h3>
                    <p className="text-sm text-gray-400 mb-6">Upload your bank statement in CSV or PDF format. Our AI will automatically categorize your transactions.</p>

                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".csv,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-gray-300 font-medium">{file ? file.name : 'Click or drag file here'}</p>
                            <p className="text-xs text-gray-500 mt-2">Max size: 5MB (CSV, PDF)</p>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {message.text}
                            </div>
                        )}

                        <NeonButton
                            className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-500/50"
                            disabled={!file || uploading}
                        >
                            {uploading ? 'Processing...' : 'Upload & Parse'}
                        </NeonButton>
                    </form>
                </GlassCard>

                <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Processing History</h3>
                    <GlassCard>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-gray-700">
                                        <th className="pb-3 font-medium">Filename</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Transactions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-gray-500">No upload history found.</td>
                                        </tr>
                                    ) : (
                                        history.map((item) => (
                                            <tr key={item._id} className="text-gray-300 hover:bg-white/5 transition-colors">
                                                <td className="py-4 font-medium">{item.fileName}</td>
                                                <td className="py-4 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs border ${item.status === 'processed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                                            item.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                                        }`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right font-bold text-blue-400">{item.transactionCount}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </Layout>
    );
};

export default UploadStatement;
