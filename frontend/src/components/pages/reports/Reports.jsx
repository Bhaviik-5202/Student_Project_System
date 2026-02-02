import React, { useState, useMemo, useCallback, memo } from "react";
import { useAuth } from "../../../context/AuthContext";

const Reports = memo(() => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("last30days");

  const reportTypes = useMemo(
    () => [
      {
        id: "project-status",
        title: "Project Status Report",
        description: "Detailed analysis of project status distribution",
        icon: "fa-chart-pie",
        color: "blue",
        roles: ["admin", "faculty"],
      },
      {
        id: "student-performance",
        title: "Student Performance Report",
        description: "Academic performance and progress tracking",
        icon: "fa-users",
        color: "emerald",
        roles: ["admin", "faculty"],
      },
      {
        id: "attendance",
        title: "Meeting Attendance Report",
        description: "Attendance statistics and participation rates",
        icon: "fa-calendar-check",
        color: "blue",
        roles: ["admin", "faculty", "student"],
      },
      {
        id: "resource-utilization",
        title: "Resource Utilization Report",
        description: "Equipment and resource usage analysis",
        icon: "fa-cogs",
        color: "amber",
        roles: ["admin"],
      },
      {
        id: "timeline",
        title: "Project Timeline Report",
        description: "Project deadlines and completion tracking",
        icon: "fa-project-diagram",
        color: "rose",
        roles: ["admin", "faculty", "student"],
      },
      {
        id: "guide-performance",
        title: "Guide Performance Report",
        description: "Faculty guide effectiveness and feedback",
        icon: "fa-user-tie",
        color: "indigo",
        roles: ["admin"],
      },
    ],
    []
  );

  const exportOptions = useMemo(
    () => [
      {
        id: "pdf",
        title: "PDF Format",
        description: "High quality printable report",
        icon: "fa-file-pdf",
        color: "red",
        features: ["Print-ready", "Vector graphics", "Password protection"],
      },
      {
        id: "excel",
        title: "Excel Format",
        description: "Data analysis and manipulation",
        icon: "fa-file-excel",
        color: "green",
        features: ["Formulas", "Charts", "Pivot tables"],
      },
      {
        id: "csv",
        title: "CSV Format",
        description: "Raw data for external processing",
        icon: "fa-file-csv",
        color: "blue",
        features: ["Lightweight", "Machine readable", "Import ready"],
      },
      {
        id: "word",
        title: "Word Document",
        description: "Editable document format",
        icon: "fa-file-word",
        color: "indigo",
        features: ["Editable", "Comments", "Track changes"],
      },
    ],
    []
  );

  const dateRanges = useMemo(
    () => [
      { id: "today", label: "Today" },
      { id: "yesterday", label: "Yesterday" },
      { id: "last7days", label: "Last 7 Days" },
      { id: "last30days", label: "Last 30 Days" },
      { id: "thismonth", label: "This Month" },
      { id: "lastmonth", label: "Last Month" },
      { id: "custom", label: "Custom Range" },
    ],
    []
  );

  const projectStats = useMemo(
    () => ({
      total: 48,
      byStatus: [
        { status: "Active", count: 32, color: "bg-green-500", percentage: 66.7 },
        { status: "Pending", count: 7, color: "bg-yellow-500", percentage: 14.6 },
        { status: "Completed", count: 9, color: "bg-blue-500", percentage: 18.7 },
      ],
      byDepartment: [
        { department: "Computer Science", count: 18, percentage: 37.5 },
        { department: "Information Technology", count: 12, percentage: 25.0 },
        { department: "Electronics", count: 10, percentage: 20.8 },
        { department: "Mechanical", count: 8, percentage: 16.7 },
      ],
    }),
    []
  );

  const monthlyData = useMemo(
    () => [
      { month: "Jan", submissions: 12, completions: 8 },
      { month: "Feb", submissions: 8, completions: 6 },
      { month: "Mar", submissions: 15, completions: 10 },
      { month: "Apr", submissions: 10, completions: 7 },
      { month: "May", submissions: 18, completions: 12 },
      { month: "Jun", submissions: 14, completions: 11 },
      { month: "Jul", submissions: 16, completions: 13 },
      { month: "Aug", submissions: 12, completions: 9 },
      { month: "Sep", submissions: 11, completions: 8 },
      { month: "Oct", submissions: 13, completions: 10 },
      { month: "Nov", submissions: 9, completions: 7 },
      { month: "Dec", submissions: 7, completions: 5 },
    ],
    []
  );

  const colorStyles = useMemo(
    () => ({
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-600 dark:text-blue-400",
        soft: "bg-blue-50 dark:bg-blue-900/30",
        hoverSoft: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-600 dark:text-green-400",
        soft: "bg-green-50 dark:bg-green-900/30",
        hoverSoft: "hover:bg-green-100 dark:hover:bg-green-900/50",
      },
      yellow: {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-600 dark:text-yellow-400",
        soft: "bg-yellow-50 dark:bg-yellow-900/30",
        hoverSoft: "hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-600 dark:text-purple-400",
        soft: "bg-purple-50 dark:bg-purple-900/30",
        hoverSoft: "hover:bg-purple-100 dark:hover:bg-purple-900/50",
      },
      red: {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-600 dark:text-red-400",
        soft: "bg-red-50 dark:bg-red-900/30",
        hoverSoft: "hover:bg-red-100 dark:hover:bg-red-900/50",
      },
      indigo: {
        bg: "bg-indigo-100 dark:bg-indigo-900",
        text: "text-indigo-600 dark:text-indigo-400",
        soft: "bg-indigo-50 dark:bg-indigo-900/30",
        hoverSoft: "hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
      },
      gray: {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-600 dark:text-gray-300",
        soft: "bg-gray-50 dark:bg-gray-700",
        hoverSoft: "hover:bg-gray-100 dark:hover:bg-gray-600",
      },
    }),
    []
  );

  const maxValue = useMemo(
    () => Math.max(...monthlyData.map((d) => Math.max(d.submissions, d.completions))),
    [monthlyData]
  );

  const generateReport = useCallback((reportId) => {
    setSelectedReport(reportId);
    // In real app, this would trigger API call
    console.log(`Generating ${reportId} report...`);
  }, []);

  const handleExport = useCallback(() => {
    alert(`Report exported as ${exportFormat.toUpperCase()} successfully!`);
  }, [exportFormat]);

  // Filter reports based on user role
  const filteredReports = useMemo(
    () => reportTypes.filter((report) => report.roles.includes(user?.role)),
    [reportTypes, user?.role]
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Generate detailed reports and analyze system data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <i className="fas fa-chevron-down" />
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            <i className="fas fa-download mr-2" /> Export All
          </button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 card-hover transition-all duration-300 ${
                selectedReport === report.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => generateReport(report.id)}
            >
              <div className="flex items-start mb-4">
                <div
                  className={`w-12 h-12 ${colorStyles[report.color]?.bg || colorStyles.blue.bg} rounded-lg flex items-center justify-center mr-4`}
                >
                  <i
                    className={`fas ${report.icon} ${colorStyles[report.color]?.text || colorStyles.blue.text} text-xl`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {report.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <i className="fas fa-clock mr-1" />
                  Generated 2 hours ago
                </span>
                <button
                  className={`px-3 py-1 text-sm rounded-lg transition duration-150 ${
                    colorStyles[report.color]?.soft || colorStyles.blue.soft
                  } ${colorStyles[report.color]?.hoverSoft || colorStyles.blue.hoverSoft} ${
                    colorStyles[report.color]?.text || colorStyles.blue.text
                  }`}
                >
                  Generate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Status Distribution
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total: {projectStats.total} projects
            </span>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* Doughnut Chart Visualization */}
              <div className="w-48 h-48 rounded-full border-8 border-blue-500 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {projectStats.total}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Projects
                  </div>
                </div>
              </div>
              {/* Status indicators */}
              <div className="absolute -top-2 -right-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 -right-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 -left-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {projectStats.byStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 ${status.color} rounded-full mr-3`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {status.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white mr-3">
                    {status.count}
                  </span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${status.color} transition-all duration-500`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                    {status.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Submissions Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Project Activity
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Submissions
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Completions
                </span>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between pt-8">
            {monthlyData.map((month, index) => (
              <div
                key={index}
                className="flex flex-col items-center mx-1 flex-1"
              >
                <div
                  className="relative w-full flex justify-center"
                  style={{ height: "120px" }}
                >
                  {/* Completions Bar */}
                  <div
                    className="absolute bottom-0 w-3/5 bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600 cursor-pointer"
                    style={{
                      height: `${(month.completions / maxValue) * 100}%`,
                    }}
                    title={`${month.month}: ${month.completions} completions`}
                  />
                  {/* Submissions Bar */}
                  <div
                    className="absolute bottom-0 w-3/5 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                    style={{
                      height: `${(month.submissions / maxValue) * 100}%`,
                      left: "40%",
                    }}
                    title={`${month.month}: ${month.submissions} submissions`}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {month.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {monthlyData.reduce((sum, month) => sum + month.submissions, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Submissions</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {monthlyData.reduce((sum, month) => sum + month.completions, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Completions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Export Reports
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose format and download your reports
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
              Preview
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-lg transition duration-150 flex items-center"
            >
              <i className="fas fa-file-export mr-2" /> Export Selected
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {exportOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
                exportFormat === option.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setExportFormat(option.id)}
            >
              <div className="flex items-center mb-3">
                <i
                  className={`fas ${option.icon} ${colorStyles[option.color]?.text || colorStyles.blue.text} text-xl mr-3`}
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
                {exportFormat === option.id && (
                  <i className="fas fa-check-circle text-green-500 ml-auto"></i>
                )}
              </div>

              <div className="space-y-1">
                {option.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-xs text-gray-600 dark:text-gray-400"
                  >
                    <i className="fas fa-check text-green-500 mr-2 text-xs" />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-3 px-3 py-1.5 text-sm rounded-lg transition duration-150 ${
                  exportFormat === option.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {exportFormat === option.id ? "Selected" : "Select Format"}
              </button>
            </div>
          ))}
        </div>

        {/* Export Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Export Summary
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedReport
                  ? `"${
                      reportTypes.find((r) => r.id === selectedReport)?.title
                    }" will be exported as ${exportFormat.toUpperCase()}`
                  : "Select a report to view export details"}
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <i className="fas fa-info-circle text-blue-500 mr-2" />
                <span>File size: ~2.5MB • Estimated time: 15 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports History */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Generated On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-chart-pie text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Project Status Report
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Monthly analysis
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  Today, 10:30 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    PDF
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  2.1 MB
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Ready
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                    <i className="fas fa-download" />
                  </button>
                  <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

Reports.displayName = "Reports";

export default Reports;
