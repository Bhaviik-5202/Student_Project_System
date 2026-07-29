/**
 * Custom Hook: useProjects
 * Centralized state and API handler for Project catalog, filtering, pagination and lifecycle actions.
 */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import projectService from '../services/projectService';
import { subscribeDataChanged } from '../utils/eventBus';

export const useProjects = (initialParams = {}) => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    category: 'All',
    projectType: 'All',
    department: 'All',
    semester: 'All',
    academicYear: 'All',
    isArchived: false,
    sort: '-createdAt',
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getAllProjects(filters);
      setProjects(res.projects || []);
      setPagination(
        res.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      );
    } catch (err) {
      console.error('Failed to fetch projects', err);
      setError('Could not load projects');
      toast.error('Failed to load project list');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await projectService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch project stats', err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    const unsubscribe = subscribeDataChanged(() => {
      fetchProjects();
      fetchStats();
    });
    return () => unsubscribe();
  }, [fetchProjects, fetchStats]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // reset page to 1 on filter changes
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'All',
      category: 'All',
      projectType: 'All',
      department: 'All',
      semester: 'All',
      academicYear: 'All',
      isArchived: false,
      sort: '-createdAt',
      page: 1,
      limit: 10,
    });
  }, []);

  return {
    projects,
    pagination,
    stats,
    loading,
    error,
    filters,
    setFilter,
    resetFilters,
    refetch: fetchProjects,
  };
};

export default useProjects;
