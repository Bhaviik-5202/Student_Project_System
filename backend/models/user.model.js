/**
 * User Model
 * Represents a registered user in the system with authentication and profile details.
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
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: '',
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

module.exports = mongoose.model('User', userSchema);
