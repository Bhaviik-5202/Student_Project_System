const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'],
      default: 'planning',
      lowercase: true,
      trim: true,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    type: {
      type: String,
      trim: true,
    },
    abstract: {
      type: String,
      trim: true,
    },
    objectives: {
      type: String,
      trim: true,
    },
    outcomes: {
      type: String,
      trim: true,
    },
    resources: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    teamMembers: {
      type: String,
      trim: true,
    },
    document: {
      type: String,
      default: null,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug
projectSchema.pre('save', async function () {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = slugify(this.title);
    let slug = baseSlug;
    let counter = 1;

    // Check for slug uniqueness
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
