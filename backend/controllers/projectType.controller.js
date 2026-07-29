const ProjectType = require('../models/projectType.model');
const Project = require('../models/project.model');
const sendResponse = require('../utils/response');

/**
 * ProjectType Controller
 * Manages project types, dynamic hierarchy options, and CRUD.
 */

/**
 * Get dynamic Department -> Category -> ProjectType hierarchy options from MongoDB
 * @route GET /api/v1/projects/options
 * @access Authenticated
 */
exports.getProjectOptions = async (req, res) => {
  try {
    const [projects, projectTypes] = await Promise.all([
      Project.find({}).select('department category projectType').lean(),
      ProjectType.find({ status: 'Active' }).lean(),
    ]);

    const hierarchyMap = {};

    const addMapping = (dept, cat, pType) => {
      if (!dept || !cat || !pType) return;
      const cleanDept = dept.trim();
      const cleanCat = cat.trim();
      const cleanType = pType.trim();

      if (!hierarchyMap[cleanDept]) {
        hierarchyMap[cleanDept] = {};
      }
      if (!hierarchyMap[cleanDept][cleanCat]) {
        hierarchyMap[cleanDept][cleanCat] = new Set();
      }
      hierarchyMap[cleanDept][cleanCat].add(cleanType);
    };

    // Aggregate mappings from existing Projects in MongoDB
    projects.forEach((p) => {
      addMapping(p.department, p.category, p.projectType);
    });

    // Aggregate mappings from ProjectType collection in MongoDB
    projectTypes.forEach((pt) => {
      const dept = pt.department || 'Computer Science';
      addMapping(dept, pt.category, pt.name);
    });

    // Fallback defaults if database has zero project/projectType records yet
    if (Object.keys(hierarchyMap).length === 0) {
      const defaultDepts = [
        'Computer Science',
        'Information Technology',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical',
        'AI & DS',
      ];
      const defaultCats = [
        'Web Development',
        'AI / Machine Learning',
        'Cloud Computing',
        'IoT & Embedded Systems',
        'Cyber Security',
        'Mobile Application',
        'Data Science',
      ];
      const defaultTypes = [
        'Major Project',
        'Minor Project',
        'Research Project',
        'UDP',
        'IDP',
        'Industry Project',
      ];

      defaultDepts.forEach((d) => {
        defaultCats.forEach((c) => {
          defaultTypes.forEach((t) => {
            addMapping(d, c, t);
          });
        });
      });
    }

    // Transform into clean JSON structure
    const data = Object.keys(hierarchyMap)
      .sort()
      .map((deptName) => {
        const catMap = hierarchyMap[deptName];
        const categories = Object.keys(catMap)
          .sort()
          .map((catName) => ({
            name: catName,
            projectTypes: Array.from(catMap[catName]).sort(),
          }));
        return {
          name: deptName,
          categories,
        };
      });

    sendResponse(res, {
      success: true,
      message: 'Project hierarchy options fetched successfully',
      data,
    });
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch project hierarchy options',
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get all project types
 * @route GET /api/v1/projects/types
 * @access Authenticated
 */
exports.getAllProjectTypes = async (req, res) => {
  try {
    const types = await ProjectType.find({ status: 'Active' }).sort({
      createdAt: -1,
    });

    sendResponse(res, {
      success: true,
      message: 'Project types fetched successfully',
      data: types,
    });
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch project types',
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get project type by id
 * @route GET /api/v1/projects/types/:id
 * @access Authenticated
 */
exports.getProjectTypeById = async (req, res) => {
  try {
    const type = await ProjectType.findById(req.params.id);

    if (!type) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Project type not found',
        },
        404
      );
    }

    sendResponse(res, {
      success: true,
      message: 'Project type fetched successfully',
      data: type,
    });
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch project type',
        error: error.message,
      },
      500
    );
  }
};

/**
 * Create a new project type
 * @route POST /api/v1/projects/types
 * @access Private (Admin/Faculty)
 */
exports.createProjectType = async (req, res) => {
  try {
    const projectType = new ProjectType(req.body);
    await projectType.save();

    sendResponse(
      res,
      {
        success: true,
        message: 'Project type created successfully',
        data: projectType,
      },
      201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message:
          error.code === 11000
            ? 'Project type already exists'
            : 'Failed to create project type',
        error: error.message,
      },
      400
    );
  }
};

/**
 * Update a project type
 * @route PUT /api/v1/projects/types/:id
 * @access Private (Admin/Faculty)
 */
exports.updateProjectType = async (req, res) => {
  try {
    const projectType = await ProjectType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!projectType) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Project type not found',
        },
        404
      );
    }

    sendResponse(res, {
      success: true,
      message: 'Project type updated successfully',
      data: projectType,
    });
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message:
          error.code === 11000
            ? 'Project type already exists'
            : 'Failed to update project type',
        error: error.message,
      },
      400
    );
  }
};

/**
 * Delete a project type
 * @route DELETE /api/v1/projects/types/:id
 * @access Private (Admin/Faculty)
 */
exports.deleteProjectType = async (req, res) => {
  try {
    const projectType = await ProjectType.findByIdAndDelete(req.params.id);

    if (!projectType) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Project type not found',
        },
        404
      );
    }

    sendResponse(res, {
      success: true,
      message: 'Project type deleted successfully',
    });
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to delete project type',
        error: error.message,
      },
      500
    );
  }
};
