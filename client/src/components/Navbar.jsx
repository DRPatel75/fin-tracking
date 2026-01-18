import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Home, DollarSign, PieChart, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="bg-gray-800 border-r border-gray-700 w-64 min-h-screen text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    FinTracker
                </h1>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-4">
                    <li>
                        <Link to="/" className="flex items-center p-3 rounded hover:bg-gray-700 transition">
                            <Home className="mr-3 text-cyan-400" size={20} />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/income" className="flex items-center p-3 rounded hover:bg-gray-700 transition">
                            <DollarSign className="mr-3 text-green-400" size={20} />
                            Income
                        </Link>
                    </li>
                    <li>
                        <Link to="/expense" className="flex items-center p-3 rounded hover:bg-gray-700 transition">
                            <DollarSign className="mr-3 text-red-400" size={20} />
                            Expense
                        </Link>
                    </li>
                    <li>
                        <Link to="/budget" className="flex items-center p-3 rounded hover:bg-gray-700 transition">
                            <PieChart className="mr-3 text-purple-400" size={20} />
                            Budgets
                        </Link>
                    </li>
                    <li>
                        <Link to="/reports" className="flex items-center p-3 rounded hover:bg-gray-700 transition">
                            <PieChart className="mr-3 text-pink-400" size={20} />
                            Reports
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 mr-3"></div>
                    <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                </div>
                <button onClick={logout} className="flex items-center w-full p-2 text-red-400 hover:bg-gray-700 rounded transition">
                    <LogOut className="mr-3" size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
