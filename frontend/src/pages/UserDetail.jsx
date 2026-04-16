import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  SignalIcon,
  ClockIcon,
  UserPlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
      <p className="text-red-600 font-bold">{error}</p>
      <button 
        onClick={() => navigate('/users')}
        className="mt-4 text-blue-600 hover:underline font-medium"
      >
        Back to Users List
      </button>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/users')}
          className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h2>
          <p className="text-sm text-gray-500">View complete historical data and account status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 text-3xl font-bold shadow-inner">
                {user?.name?.[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{user?.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user?.status === 'active' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {user?.status}
                  </span>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">•</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{user?.role}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                    <p className="text-sm font-medium dark:text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Access Role</p>
                    <p className="text-sm font-medium dark:text-white capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <SignalIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Current Status</p>
                    <p className="text-sm font-medium dark:text-white capitalize">{user?.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">User ID</p>
                    <p className="text-xs font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md mt-1">{user?._id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Data Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <ClockIcon className="h-6 w-6 text-indigo-500" />
              Audit Logs
            </h4>
            
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
              {/* Created At */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-0.5 h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 flex items-center justify-center z-10">
                  <UserPlusIcon className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Account Created</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{formatDate(user?.createdAt)}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-gray-500">by</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {user?.createdBy?.name || 'Earlier Record'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Updated At */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-0.5 h-7 w-7 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500 flex items-center justify-center z-10">
                  <PencilIcon className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Last Modification</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{formatDate(user?.updatedAt)}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-gray-500">by</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {user?.updatedBy?.name || 'No updates yet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-400 font-medium leading-relaxed">
              * "Earlier Record" indicates users created before the audit tracking feature was implemented.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
