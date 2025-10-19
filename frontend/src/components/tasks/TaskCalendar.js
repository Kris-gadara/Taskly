import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TaskService } from '../../services/api';

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayTasks, setDayTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const tasksForDay = tasks.filter(
      (task) =>
        format(new Date(task.dueDate), 'yyyy-MM-dd') ===
        format(selectedDate, 'yyyy-MM-dd')
    );
    setDayTasks(tasksForDay);
  }, [selectedDate, tasks]);

  const loadTasks = async () => {
    try {
      const data = await TaskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const tileContent = ({ date }) => {
    const tasksForDate = tasks.filter(
      (task) =>
        format(new Date(task.dueDate), 'yyyy-MM-dd') ===
        format(date, 'yyyy-MM-dd')
    );

    if (tasksForDate.length > 0) {
      return (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500"></div>
      );
    }
    return null;
  };

  const tileClassName = ({ date }) => {
    const tasksForDate = tasks.filter(
      (task) =>
        format(new Date(task.dueDate), 'yyyy-MM-dd') ===
        format(date, 'yyyy-MM-dd')
    );

    return tasksForDate.length > 0 ? 'has-tasks' : '';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Task Calendar
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className="w-full rounded-lg border-none bg-transparent"
            />
          </div>
        </div>

        <div>
          <div className="card">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            <div className="space-y-4">
              {dayTasks.length > 0 ? (
                dayTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {task.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span
                        className={`${
                          task.status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {task.status}
                      </span>
                      <div className="flex items-center">
                        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-primary-500"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No tasks due on this date
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;