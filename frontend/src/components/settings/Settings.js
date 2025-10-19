import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { Switch } from '@headlessui/react';

const SettingsSection = ({ title, children }) => (
  <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
      {title}
    </h3>
    {children}
  </div>
);

const SettingsItem = ({ title, description, children }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [taskReminders, setTaskReminders] = React.useState(true);
  const [showTaskProgress, setShowTaskProgress] = React.useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card space-y-6"
      >
        <SettingsSection title="Appearance">
          <SettingsItem
            title="Dark Mode"
            description="Toggle between light and dark theme"
          >
            <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className={`${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Notifications">
          <div className="space-y-4">
            <SettingsItem
              title="Email Notifications"
              description="Receive task updates and reminders via email"
            >
              <Switch
                checked={emailNotifications}
                onChange={setEmailNotifications}
                className={`${
                  emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </SettingsItem>

            <SettingsItem
              title="Task Reminders"
              description="Get notifications before task deadlines"
            >
              <Switch
                checked={taskReminders}
                onChange={setTaskReminders}
                className={`${
                  taskReminders ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    taskReminders ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </SettingsItem>
          </div>
        </SettingsSection>

        <SettingsSection title="Task Display">
          <div className="space-y-4">
            <SettingsItem
              title="Show Task Progress"
              description="Display progress bars for tasks"
            >
              <Switch
                checked={showTaskProgress}
                onChange={setShowTaskProgress}
                className={`${
                  showTaskProgress ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    showTaskProgress ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </SettingsItem>
          </div>
        </SettingsSection>

        <SettingsSection title="Data & Privacy">
          <div className="space-y-4">
            <button className="text-sm text-red-600 hover:text-red-700">
              Delete Account
            </button>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Export Data
            </button>
          </div>
        </SettingsSection>
      </motion.div>
    </div>
  );
};

export default Settings;