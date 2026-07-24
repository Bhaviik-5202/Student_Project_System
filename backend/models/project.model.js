/**
 * Project Model
 * Defines the comprehensive MongoDB schema for student projects.
 * Supports lifecycle status, progress tracking, active student/guide assignments,
 * files, reviews, activity timeline, and unique project codes.
 */
const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  fileType: { type: String, default: 'Document', trim: true },
  size: { type: String, default: 'N/A', trim: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true, trim: true },
  milestone: { type: String, default: 'General Review', trim: true },
  date: { type: Date, default: Date.now },
});

const timelineSchema = new mongoose.Schema({
  action: { type: String, required: true, trim: true },
  details: { type: String, trim: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const resourceLinkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
});

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    code: {
      type: String,
      required: [true, 'Project code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    projectType: {
      type: String,
      default: 'Major Project',
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: 'Web Development',
      trim: true,
      index: true,
    },
    department: {
      type: String,
      default: 'Computer Science',
      trim: true,
      index: true,
    },
    semester: {
      type: String,
      default: 'Sem 7',
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'draft',
        'proposed',
        'planning',
        'assigned',
        'in_progress',
        'under_review',
        'approved',
        'rejected',
        'completed',
        'archived',
        'pending',
        'active',
      ],
      default: 'assigned',
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    objectives: {
      type: String,
      trim: true,
      default: '',
    },
    outcomes: {
      type: String,
      trim: true,
      default: '',
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    expectedCompletionDate: {
      type: Date,
      default: null,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    files: [fileSchema],
    reviews: [reviewSchema],
    activityTimeline: [timelineSchema],
    resourceLinks: [resourceLinkSchema],
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    demoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    documentationUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to generate slug and unique project code if not provided
 */
projectSchema.pre('save', async function () {
  // Slug generation
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title || 'project');
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingProject = await this.constructor.findOne({
        slug,
        _id: { $ne: this._id },
      });
      if (!existingProject) break;
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }

  // Project code generation fallback
  if (!this.code) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.code = `PRJ-${year}-${randomNum}`;
  }
});

projectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    return ret;
  },
});

projectSchema.index({ createdAt: -1 });
projectSchema.index({ members: 1 });

module.exports = mongoose.model('Project', projectSchema);
