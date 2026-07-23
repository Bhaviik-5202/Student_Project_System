/**
 * Project Repository
 * Handles direct MongoDB interactions for Project entity using Mongoose.
 */
const Project = require('../models/project.model');

class ProjectRepository {
  /**
   * Find project by ID or slug with custom populates
   */
  /**
   * Find project by ID or slug with custom populates
   */
  async findByIdOrSlug(idOrSlug, options = {}) {
    const { populate = true } = options;
    const strId = String(idOrSlug?._id || idOrSlug?.id || idOrSlug || '').trim();
    const isObjectId = Boolean(strId && strId.match(/^[0-9a-fA-F]{24}$/));
    const query = isObjectId ? { _id: strId } : { slug: strId };

    let req = Project.findOne(query);

    if (populate) {
      req = req
        .populate('leader', 'name email avatar studentId department rollNumber role status')
        .populate('members', 'name email avatar studentId department rollNumber role status')
        .populate('guide', 'name email avatar designation department role status')
        .populate('createdBy', 'name email role')
        .populate('reviews.reviewer', 'name email role designation avatar')
        .populate('files.uploadedBy', 'name email role')
        .populate('activityTimeline.performedBy', 'name email role');
    }

    return await req.exec();
  }

  /**
   * Find project by raw filter condition
   */
  async findOne(filter = {}, options = {}) {
    const { populate = false } = options;
    let req = Project.findOne(filter);

    if (populate) {
      req = req
        .populate('leader', 'name email avatar studentId')
        .populate('members', 'name email avatar studentId')
        .populate('guide', 'name email avatar designation department');
    }

    return await req.exec();
  }

  /**
   * Find all projects with search, filter, pagination & sorting
   */
  async findAll(filter = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      populate = true,
      lean = true,
    } = options;

    const skip = (Math.max(1, page) - 1) * limit;

    let req = Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      req = req
        .populate('leader', 'name email avatar studentId department')
        .populate('members', 'name email avatar studentId department')
        .populate('guide', 'name email avatar designation department')
        .populate('createdBy', 'name email role');
    }

    if (lean) {
      req = req.lean({ virtuals: true });
    }

    const [data, total] = await Promise.all([
      req.exec(),
      Project.countDocuments(filter),
    ]);

    data.projects = data;
    data.pagination = {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    };

    return data;
  }

  /**
   * Create new project document
   */
  async create(projectData) {
    const project = new Project(projectData);
    await project.save();
    return await this.findByIdOrSlug(project._id);
  }

  /**
   * Update existing project
   */
  async update(idOrSlug, updateData = {}) {
    const strId = String(idOrSlug?._id || idOrSlug?.id || idOrSlug || '').trim();
    const isObjectId = Boolean(strId && strId.match(/^[0-9a-fA-F]{24}$/));
    const filter = isObjectId ? { _id: strId } : { slug: strId };

    let updateQuery = { ...updateData };
    const keys = Object.keys(updateQuery);
    const hasOperators = keys.some((k) => k.startsWith('$'));

    if (hasOperators) {
      const setFields = {};
      const operatorFields = {};

      for (const key of keys) {
        if (key.startsWith('$')) {
          operatorFields[key] = updateQuery[key];
        } else {
          setFields[key] = updateQuery[key];
        }
      }

      updateQuery = { ...operatorFields };
      if (Object.keys(setFields).length > 0) {
        updateQuery.$set = { ...(updateQuery.$set || {}), ...setFields };
      }
    }

    const project = await Project.findOneAndUpdate(filter, updateQuery, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!project) return null;
    return await this.findByIdOrSlug(project._id);
  }

  /**
   * Delete project by ID
   */
  async delete(idOrSlug) {
    const strId = String(idOrSlug?._id || idOrSlug?.id || idOrSlug || '').trim();
    const isObjectId = Boolean(strId && strId.match(/^[0-9a-fA-F]{24}$/));
    const filter = isObjectId ? { _id: strId } : { slug: strId };
    return await Project.findOneAndDelete(filter);
  }

  /**
   * Count documents matching query
   */
  async count(filter = {}) {
    return await Project.countDocuments(filter);
  }

  /**
   * Aggregate stats for metrics dashboard
   */
  async getDashboardStats(userFilter = {}) {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      underReviewProjects,
      draftProjects,
      archivedProjects,
      statusBreakdown,
      departmentBreakdown,
      categoryBreakdown,
    ] = await Promise.all([
      Project.countDocuments({ ...userFilter, isArchived: { $ne: true } }),
      Project.countDocuments({
        ...userFilter,
        isArchived: { $ne: true },
        status: { $in: ['assigned', 'in_progress'] },
      }),
      Project.countDocuments({
        ...userFilter,
        isArchived: { $ne: true },
        status: 'completed',
      }),
      Project.countDocuments({
        ...userFilter,
        isArchived: { $ne: true },
        status: 'under_review',
      }),
      Project.countDocuments({
        ...userFilter,
        isArchived: { $ne: true },
        status: 'draft',
      }),
      Project.countDocuments({ ...userFilter, isArchived: true }),

      // Aggregations
      Project.aggregate([
        { $match: { ...userFilter, isArchived: { $ne: true } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Project.aggregate([
        { $match: { ...userFilter, isArchived: { $ne: true } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]),
      Project.aggregate([
        { $match: { ...userFilter, isArchived: { $ne: true } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      underReviewProjects,
      draftProjects,
      archivedProjects,
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s._id,
        count: s.count,
      })),
      departmentBreakdown: departmentBreakdown.map((d) => ({
        department: d._id || 'Unassigned',
        count: d.count,
      })),
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c._id || 'General',
        count: c.count,
      })),
    };
  }
}

module.exports = new ProjectRepository();
