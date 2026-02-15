const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;

// Strict response format helper
function response(error, data, message) {
  return { error, data, message };
}

exports.register = async ({ name, email, password, role }) => {
  try {
    const existing = await User.findOne({ email });
    if (existing) return response(true, null, "Email already registered");
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    return response(false, null, "User registered");
  } catch (err) {
    return response(true, null, err.message || "Registration failed");
  }
};

exports.login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return response(true, null, "Invalid credentials");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return response(true, null, "Invalid credentials");
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });
    return response(
      false,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
    );
  } catch (err) {
    return response(true, null, err.message || "Login failed");
  }
};

exports.getAll = async () => {
  try {
    const users = await User.find();
    return response(false, users, "Users fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch users");
  }
};

exports.getById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) return response(true, null, "User not found");
    return response(false, user, "User fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch user");
  }
};

exports.create = async (data) => {
  try {
    const existing = await User.findOne({ email: data.email });
    if (existing) return response(true, null, "Email already exists");
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashed });
    return response(false, user, "User created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create user");
  }
};

exports.update = async (id, data) => {
  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) return response(true, null, "User not found");
    return response(false, user, "User updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update user");
  }
};

exports.remove = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return response(true, null, "User not found");
    return response(false, null, "User deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete user");
  }
};
