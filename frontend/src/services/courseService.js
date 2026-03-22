import api from '../utils/api';

const courseService = {
  /**
   * Fetch all courses for the catalog
   */
  getAllCourses: async () => {
    return await api.get('/courses');
  },

  /**
   * Get courses enrolled by the current user
   */
  getMyCourses: async () => {
    return await api.get('/courses/my');
  },

  /**
   * Get all available courses for registration
   */
  getAvailableCourses: async () => {
    // For now, this is same as getAllCourses, but can be filtered in backend later
    return await api.get('/courses');
  },

  /**
   * Get course details by ID
   */
  getCourseById: async (id) => {
    return await api.get(`/courses/${id}`);
  },

  /**
   * Enroll the current user in a course
   */
  enroll: async (courseId) => {
    return await api.post(`/courses/${courseId}/enroll`);
  },

  /**
   * Create a new course (Admin only)
   */
  createCourse: async (data) => {
    return await api.post('/courses', data);
  },

  /**
   * Update course details
   */
  updateCourse: async (id, data) => {
    return await api.put(`/courses/${id}`, data);
  },

  /**
   * Delete a course
   */
  deleteCourse: async (id) => {
    return await api.delete(`/courses/${id}`);
  },
};

export default courseService;
