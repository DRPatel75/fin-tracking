import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [resetUrl, setResetUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setResetUrl('');
        setLoading(true);

        try {
            // Adjust the URL if you have a proxy configured in vite.config.js
            const { data } = await axios.post('http://localhost:5000/api/users/forgotpassword', { email });
            setMessage(data.data || 'Password reset link generated successfully');
            if (data.resetUrl) {
                setResetUrl(data.resetUrl);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email could not be sent');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Forgot Password</h2>
                
                {message && <div className="bg-green-500 text-white p-2 mb-4 rounded">{message}</div>}
                {error && <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Get Reset Link'}
                    </button>
                </form>

                {resetUrl && (
                    <div className="mt-4 p-4 bg-gray-700 text-center rounded border border-gray-600">
                        <p className="text-gray-300 mb-2">Here is your reset link (Mocked Email):</p>
                        <a href={resetUrl} className="text-blue-400 break-all hover:underline font-medium">
                            {resetUrl}
                        </a>
                    </div>
                )}

                <p className="mt-4 text-center text-gray-400 text-sm">
                    Remember your password? <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
