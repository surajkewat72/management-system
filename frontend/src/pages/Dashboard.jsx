import { useAuth } from '../context/AuthContext';
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  UserGroupIcon, 
  BriefcaseIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Users', value: '1,284', icon: UserGroupIcon, color: 'bg-blue-500' },
    { name: 'Active Sessions', value: '42', icon: ShieldCheckIcon, color: 'bg-green-500' },
    { name: 'Pending Approvals', value: '12', icon: UsersIcon, color: 'bg-amber-500' },
    { name: 'System Load', value: '24%', icon: BriefcaseIcon, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Overview</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {user?.status}
          </span>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
            <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
            <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Assigned Role</label>
            <p className="text-gray-900 dark:text-white font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
