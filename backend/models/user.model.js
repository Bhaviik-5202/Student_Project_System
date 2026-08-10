/**
 * User Model
 * Defines the schema for system authentication and user profiles, including granular notification and visibility settings.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [200, 'Email cannot exceed 200 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },

    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
      default: 'student',
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
      lowercase: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: 'Computer Engineering',
    },
    year: {
      type: String,
      trim: true,
      default: '1',
    },
    semester: {
      type: String,
      trim: true,
      default: 'Sem 1',
    },
    academicYear: {
      type: String,
      trim: true,
      default: '2024-25',
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    enrollmentNumber: {
      type: String,
      trim: true,
      default: '',
    },
    facultyId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    designation: {
      type: String,
      trim: true,
      default: 'Faculty',
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    settings: {
      language: { type: String, default: 'English' },
      timezone: { type: String, default: 'UTC-05:00' },
      dateFormat: { type: String, default: 'MM/DD/YYYY' },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      meetingReminders: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: false },
      profileVisibility: {
        type: String,
        enum: ['public', 'community', 'private'],
        default: 'public',
      },
      showEmail: { type: Boolean, default: true },
      showPhone: { type: Boolean, default: false },
      fontSize: { type: String, default: 'medium' },
      density: { type: String, default: 'comfortable' },
      theme: { type: String, default: 'auto' },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to hash the user password.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

/**
 * Compare candidate password with hashed password.
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
