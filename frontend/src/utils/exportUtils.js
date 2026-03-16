/**
 * Export Utilities
 * ------------------------------------------------------------------
 * Handles data conversion and file downloads for reporting features.
 */

/**
 * Converts an array of objects to a CSV string.
 * @param {Array<Object>} data - The data to convert.
 * @returns {string} - The CSV string.
 */
export const convertToCSV = (data) => {
  if (!data || !data.length) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(","));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  
  return csvRows.join("\n");
};

/**
 * Triggers a browser download for a CSV file.
 * @param {string} csvString - The CSV content.
 * @param {string} fileName - The desired file name.
 */
export const downloadCSV = (csvString, fileName) => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Helper to export complex dashboard metrics to CSV
 * @param {Object} dashboardData - The dashboard state object
 * @param {string} role - The user's role
 */
export const exportDashboardToCSV = (dashboardData, role) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `Dashboard_Report_${role}_${timestamp}.csv`;
  
  // Prepare flat data for CSV
  const exportData = dashboardData.stats.map(stat => ({
    Metric: stat.title,
    Value: stat.value,
    Trend: stat.change,
    Category: role.toUpperCase()
  }));

  const csv = convertToCSV(exportData);
  downloadCSV(csv, fileName);
};
