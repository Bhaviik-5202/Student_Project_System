const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [150, "Name cannot exceed 150 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [200, "Email cannot exceed 200 characters"],
      index: true,
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      default: "faculty",
      trim: true,
      lowercase: true,
      enum: ["faculty", "admin", "coordinator", "hod"],
    },
  },
  {
    timestamps: true,
  },
);

staffSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Staff", staffSchema);
