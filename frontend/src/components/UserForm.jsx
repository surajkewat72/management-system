import { useState, useEffect } from 'react';
import api from '../services/api';
import { XMarkIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UserForm = ({ initialData, onSuccess, onCancel, currentUser }) => {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || 'user',
        status: initialData.status || 'active',
        password: '', // Password stays empty in edit mode unless they want to change it
      });
    }
  }, [initialData]);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isEdit && !formData.password) {
      errors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        // Only send password if it's been updated
        const updatePayload = { ...formData };
        if (!updatePayload.password) delete updatePayload.password;
        
        await api.put(`/users/${initialData._id}`, updatePayload);
      } else {
        await api.post('/users', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Managers cannot promote someone to Admin or demote an Admin
  const isRoleRestricted = currentUser?.role === 'manager' && initialData?.role === 'admin';
  const canModifyRole = currentUser?.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 dark:border-gray-700 transform transition-all animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEdit ? 'Update account information and permissions' : 'Create a new user account with specific roles'}
            </p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm animate-shake">
              <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border ${validationErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {validationErrors.name && <p className="mt-1 text-xs text-red-500 ml-1">{validationErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alex@gmail.com"
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border ${validationErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {validationErrors.email && <p className="mt-1 text-xs text-red-500 ml-1">{validationErrors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Role
              </label>
              <select
                disabled={isRoleRestricted || (!canModifyRole && isEdit)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Status
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Password */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                Password {isEdit && <span className="text-xs font-normal text-gray-500">(Leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border ${validationErrors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {validationErrors.password && <p className="mt-1 text-xs text-red-500 ml-1">{validationErrors.password}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
