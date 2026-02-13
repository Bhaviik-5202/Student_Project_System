export const formatDate = (date, format = "display") => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (format === "display") {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (format === "api") {
    return dateObj.toISOString().split("T")[0];
  }

  if (format === "time") {
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (format === "datetime") {
    return `${formatDate(date, "display")} at ${formatDate(date, "time")}`;
  }

  return dateObj.toLocaleDateString();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sortByDate = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const filterByDateRange = (
  array,
  startDate,
  endDate,
  dateKey = "date",
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return array.filter((item) => {
    const itemDate = new Date(item[dateKey]);
    return itemDate >= start && itemDate <= end;
  });
};
