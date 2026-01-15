export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === "") {
    return `${fieldName} is required`;
  }
  return "";
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return "";
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return "";
};

export const validateNumber = (value, fieldName) => {
  if (isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  return "";
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{1,14}$/;
  if (!phone) return "Phone number is required";
  if (!phoneRegex.test(phone.replace(/[^\d+]/g, ""))) {
    return "Please enter a valid phone number";
  }
  return "";
};

export const validateDate = (date, fieldName) => {
  if (!date) return `${fieldName} is required`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Please enter a valid date";
  return "";
};

export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const value = formData[field];
    const rules = validationRules[field];

    for (const rule of rules) {
      const error = rule.validator(value, rule.params, field);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rule definitions
export const VALIDATION_RULES_TEMPLATE = {
  email: [
    { validator: validateRequired, params: "Email" },
    { validator: validateEmail },
  ],
  password: [
    { validator: validateRequired, params: "Password" },
    { validator: validatePassword },
  ],
  name: [
    { validator: validateRequired, params: "Name" },
    { validator: validateMinLength, params: [2, "Name"] },
    { validator: validateMaxLength, params: [50, "Name"] },
  ],
};
