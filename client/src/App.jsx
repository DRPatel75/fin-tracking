import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Simple wrapper to redirect unauthenticated users
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">Loading...</div>;

    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/income" element={
                        <PrivateRoute>
                            <IncomePage />
                        </PrivateRoute>
                    } />
                    <Route path="/expense" element={
                        <PrivateRoute>
                            <ExpensePage />
                        </PrivateRoute>
                    } />
                    <Route path="/budget" element={
                        <PrivateRoute>
                            <BudgetPage />
                        </PrivateRoute>
                    } />
                    <Route path="/reports" element={
                        <PrivateRoute>
                            <ReportsPage />
                        </PrivateRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App;
