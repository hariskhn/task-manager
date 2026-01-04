import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
    sortBy: 'date',
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
  });

  // Fetch tasks with filters
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const response = await api.get('/tasks', { params });
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/stats/summary');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Create task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
      await fetchStats();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      await fetchStats();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/tasks/${id}/toggle`);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      await fetchStats();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      await fetchStats();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single task
  const getTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Initial load
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const value = {
    tasks,
    loading,
    error,
    filters,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    getTask,
    updateFilters,
    refreshStats: fetchStats,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

