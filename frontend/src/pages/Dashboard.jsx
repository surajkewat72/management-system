import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">User Profile</h3>
          <p className="mt-2"><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> <span className="capitalize">{user?.role}</span></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 text-center">
            <h4 className="font-bold text-green-800 dark:text-green-300">Total Users</h4>
            <p className="text-2xl">1</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800 text-center">
            <h4 className="font-bold text-purple-800 dark:text-purple-300">System Status</h4>
            <p className="text-2xl">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
