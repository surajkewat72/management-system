import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppContent() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">User Management System</h1>
        {user && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link>
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link to="/users" className="hover:text-blue-500 transition">Users</Link>
              )}
            </div>
            <div className="flex items-center gap-4 border-l pl-6 border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium">Hi, {user.name} ({user.role})</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
