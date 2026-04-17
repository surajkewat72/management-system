import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  UserGroupIcon, 
  PlusIcon, 
  UserIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  BellIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [realUser, setRealUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = authUser?.role === 'admin';
  const isManager = authUser?.role === 'manager';
  const isPrivileged = isAdmin || isManager;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (isPrivileged) {
          const { data: usersData } = await api.get('/users', { params: { limit: 1 } });
          setTotalUsers(usersData.total);
        }
        const { data: profileData } = await api.get('/users/profile');
        setRealUser(profileData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isPrivileged]);

  // Specific Action Cards requested by user
  const adminActions = [
    { 
      name: 'Manage Users', 
      description: `View and manage all ${totalUsers || ''} organization users`, 
      icon: UserGroupIcon, 
      path: '/users',
      color: 'bg-blue-600',
    },
    { 
      name: 'Create User', 
      description: 'Add a new member to the system instantly', 
      icon: PlusIcon, 
      path: '/create-user', 
      color: 'bg-green-600',
    },
  ];

  const commonActions = [
    { 
      name: 'My Profile', 
      description: 'Update your personal and contact details', 
      icon: IdentificationIcon, 
      path: '/profile',
      color: 'bg-indigo-600',
    },
  ];

  const displayUser = realUser || authUser;

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Dynamic Hero Section (Kept from current UI) */}
      <div className={`relative overflow-hidden rounded-3xl p-10 shadow-xl ${
        isPrivileged 
        ? 'bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 shadow-blue-500/20' 
        : 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-500/20'
      }`}>
        <div className="relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-white mb-4 backdrop-blur-sm">
            {isPrivileged ? 'Management Hub' : 'Personal Portal'}
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Welcome, {displayUser?.name}!
          </h2>
          <p className="mt-3 text-white/80 text-lg max-w-2xl font-medium">
            {isPrivileged 
              ? `Oversee your organization and manage ${totalUsers} user permissions efficiently.` 
              : 'Manage your personal account details, monitor security, and keep your profile up to date.'
            }
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Action Cards Section (Specifically requested) */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
          <span className={`w-1.5 h-6 rounded-full ${isPrivileged ? 'bg-blue-600' : 'bg-slate-600'}`}></span>
          Quick Action Cards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Admin Features */}
          {isPrivileged && adminActions.map((action) => (
            <button
              key={action.name}
              onClick={() => navigate(action.path)}
              className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-left transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col items-start gap-4"
            >
              <div className={`${action.color} p-4 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110`}>
                <action.icon className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{action.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium line-clamp-2">{action.description}</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-blue-600 group-hover:gap-2 transition-all">
                Access Tool
                <ChevronRightIcon className="h-4 w-4" />
              </div>
            </button>
          ))}
          
          {/* My Profile (Next row or side by side depending on grid) */}
          <button
            onClick={() => navigate('/profile')}
            className={`group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-left transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col items-start gap-4 ${!isPrivileged ? 'md:col-span-2' : ''}`}
          >
            <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110">
              <IdentificationIcon className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">My Profile</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium line-clamp-2">View and update your personal and security settings</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-indigo-600 group-hover:gap-2 transition-all">
              Manage Profile
              <ChevronRightIcon className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Account Overview (Kept from current UI) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all hover:shadow-lg">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Overview</h3>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
          >
            Edit Settings
          </button>
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact Identity</label>
            {loading ? <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-32 animate-pulse"></div> : (
              <>
                <p className="text-gray-900 dark:text-white font-bold text-lg">{displayUser?.name}</p>
                <p className="text-xs text-gray-500">{displayUser?.email}</p>
              </>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">System Privilege</label>
            {loading ? <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-24 animate-pulse"></div> : (
              <>
                <p className="text-gray-900 dark:text-white font-bold text-lg capitalize">{displayUser?.role}</p>
                <div className="flex gap-1 mt-1">
                   {Array(displayUser?.role === 'admin' ? 3 : displayUser?.role === 'manager' ? 2 : 1).fill(0).map((_, i) => (
                     <div key={i} className="h-1.5 w-4 bg-blue-500 rounded-full"></div>
                   ))}
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Live Status</label>
            {loading ? <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div> : (
              <div>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                  displayUser?.status === 'active' 
                  ? 'bg-green-50 text-green-700 border-green-100' 
                  : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${displayUser?.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse'}`}></span>
                  {displayUser?.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
