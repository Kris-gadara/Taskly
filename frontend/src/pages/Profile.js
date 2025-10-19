import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setPasswordLoading(true);
    try {
      await changePassword(data);
      resetPassword();
    } finally {
      setPasswordLoading(false);
    }
  };

  // Fetch user stats
  useState(() => {
    const fetchStats = async () => {
      try {
        const data = await UserService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Stats Section */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Activity Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-200">Tasks Completed</p>
                  <p className="text-2xl font-semibold text-blue-700 dark:text-blue-100">
                    {stats.tasksCompleted}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-200">Tasks Pending</p>
                  <p className="text-2xl font-semibold text-green-700 dark:text-green-100">
                    {stats.tasksPending}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-200">Days Active</p>
                  <p className="text-2xl font-semibold text-purple-700 dark:text-purple-100">
                    {stats.joinedDays}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
                  <p className="text-sm text-orange-600 dark:text-orange-200">Last Active</p>
                  <p className="text-2xl font-semibold text-orange-700 dark:text-orange-100">
                    {new Date(stats.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Profile Information
              </h3>
              <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
                <Input
                  label="Full name"
                  type="text"
                  error={errors.name}
                  {...register('name')}
                />
                <Input
                  label="Email address"
                  type="email"
                  error={errors.email}
                  {...register('email')}
                />
                <Button type="submit" loading={loading}>
                  Update profile
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Change Password
              </h3>
              <form
                onSubmit={handlePasswordSubmit(onChangePassword)}
                className="space-y-4"
              >
                <Input
                  label="Current password"
                  type="password"
                  error={passwordErrors.currentPassword}
                  {...registerPassword('currentPassword')}
                />
                <Input
                  label="New password"
                  type="password"
                  error={passwordErrors.newPassword}
                  {...registerPassword('newPassword')}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  error={passwordErrors.confirmPassword}
                  {...registerPassword('confirmPassword')}
                />
                <Button type="submit" loading={passwordLoading}>
                  Change password
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};