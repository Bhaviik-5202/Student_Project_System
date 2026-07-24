/**
 * Project Service (Frontend API Client)
 * Handles all backend communications for the Project Module.
 * Triggering event bus on changes so dashboards stay synchronized.
 */
import api from '../utils/api';
import { notifyDataChanged } from '../utils/eventBus';

export const projectService = {
  /**
   * Fetch project dashboard metrics
   */
  getDashboardStats: async () => {
    const res = await api.get('/projects/stats');
    return res.data || res;
  },

  /**
   * Fetch paginated list of projects with search and filters
   */
  getAllProjects: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'All')
      query.append('status', params.status);
    if (params.category && params.category !== 'All')
      query.append('category', params.category);
    if (params.projectType && params.projectType !== 'All')
      query.append('projectType', params.projectType);
    if (params.department && params.department !== 'All')
      query.append('department', params.department);
    if (params.semester && params.semester !== 'All')
      query.append('semester', params.semester);
    if (params.academicYear && params.academicYear !== 'All')
      query.append('academicYear', params.academicYear);
    if (params.isArchived !== undefined)
      query.append('isArchived', params.isArchived);
    if (params.sort) query.append('sort', params.sort);
    if (params.guide) query.append('guide', params.guide);

    const res = await api.get(`/projects?${query.toString()}`);
    return {
      projects: res.data || [],
      pagination: res.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  /**
   * Get single project details by ID or Slug
   */
  getProjectById: async (idOrSlug) => {
    const res = await api.get(`/projects/${idOrSlug}`);
    return res.data || res;
  },

  /**
   * Create new project
   */
  createProject: async (projectData) => {
    const res = await api.post('/projects', projectData);
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Update existing project
   */
  updateProject: async (idOrSlug, updateData) => {
    const res = await api.put(`/projects/${idOrSlug}`, updateData);
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Delete project
   */
  deleteProject: async (idOrSlug) => {
    const res = await api.delete(`/projects/${idOrSlug}`);
    notifyDataChanged();
    return res;
  },

  /**
   * Archive project
   */
  archiveProject: async (idOrSlug) => {
    const res = await api.patch(`/projects/${idOrSlug}/archive`);
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Restore archived project
   */
  restoreProject: async (idOrSlug) => {
    const res = await api.patch(`/projects/${idOrSlug}/restore`);
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Assign or update active student team members
   */
  assignStudents: async (idOrSlug, studentIds) => {
    const res = await api.put(`/projects/${idOrSlug}/students`, { studentIds });
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Assign or update faculty guide mentor
   */
  assignGuide: async (idOrSlug, guideId) => {
    const res = await api.put(`/projects/${idOrSlug}/guide`, { guideId });
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Update progress percentage and status
   */
  updateProgress: async (idOrSlug, { progress, status, note }) => {
    const res = await api.patch(`/projects/${idOrSlug}/progress`, {
      progress,
      status,
      note,
    });
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Add file to project
   */
  addProjectFile: async (idOrSlug, fileData) => {
    const res = await api.post(`/projects/${idOrSlug}/files`, fileData);
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Remove file from project
   */
  removeProjectFile: async (idOrSlug, fileId) => {
    const res = await api.delete(`/projects/${idOrSlug}/files/${fileId}`);
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Add faculty evaluation review
   */
  addProjectReview: async (idOrSlug, reviewData) => {
    const res = await api.post(`/projects/${idOrSlug}/reviews`, reviewData);
    notifyDataChanged();
    return res.data || res;
  },

  /**
   * Query active students for dropdown assignment selector
   */
  getActiveStudents: async (search = '') => {
    const res = await api.get(
      `/projects/students/active?search=${encodeURIComponent(search)}`
    );
    return res.data || [];
  },

  /**
   * Query active faculty guides for guide selector
   */
  getActiveFaculty: async (search = '') => {
    const res = await api.get(
      `/projects/faculty/active?search=${encodeURIComponent(search)}`
    );
    return res.data || [];
  },
};

export default projectService;
