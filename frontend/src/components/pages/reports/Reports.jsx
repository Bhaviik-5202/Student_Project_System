import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Reports = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("last30days");

  const reportTypes = [
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
      color: "green",
      roles: ["admin", "faculty"],
    },
    {
      id: "attendance",
      title: "Meeting Attendance Report",
      description: "Attendance statistics and participation rates",
      icon: "fa-calendar-check",
      color: "purple",
      roles: ["admin", "faculty", "student"],
    },
    {
      id: "resource-utilization",
      title: "Resource Utilization Report",
      description: "Equipment and resource usage analysis",
      icon: "fa-cogs",
      color: "yellow",
      roles: ["admin"],
    },
    {
      id: "timeline",
      title: "Project Timeline Report",
      description: "Project deadlines and completion tracking",
      icon: "fa-project-diagram",
      color: "red",
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
  ];

  const exportOptions = [
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
  ];

  const dateRanges = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "last7days", label: "Last 7 Days" },
    { id: "last30days", label: "Last 30 Days" },
    { id: "thismonth", label: "This Month" },
    { id: "lastmonth", label: "Last Month" },
    { id: "custom", label: "Custom Range" },
  ];

  const projectStats = {
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
  };

  const monthlyData = [
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
  ];

  const maxValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.submissions, d.completions))
  );

  const generateReport = (reportId) => {
    setSelectedReport(reportId);
    // In real app, this would trigger API call
    console.log(`Generating ${reportId} report...`);
  };

  const handleExport = () => {
    alert(`Report exported as ${exportFormat.toUpperCase()} successfully!`);
  };

  // Filter reports based on user role
  const filteredReports = reportTypes.filter((report) =>
    report.roles.includes(user?.role)
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h2>
          <p className="text-gray-600">
            Generate detailed reports and analyze system data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center">
            <i className="fas fa-download mr-2"></i> Export All
          </button>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 card-hover transition-all duration-300 ${
                selectedReport === report.id ? "ring-2 ring-primary-500" : ""
              }`}
              onClick={() => generateReport(report.id)}
            >
              <div className="flex items-start mb-4">
                <div
                  className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mr-4`}
                >
                  <i
                    className={`fas ${report.icon} text-${report.color}-600 text-xl`}
                  ></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {report.title}
                  </h4>
                  <p className="text-sm text-gray-500">{report.description}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  <i className="fas fa-clock mr-1"></i>
                  Generated 2 hours ago
                </span>
                <button
                  className={`px-3 py-1 bg-${report.color}-50 text-${report.color}-600 text-sm rounded-lg hover:bg-${report.color}-100 transition duration-150`}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Project Status Distribution
            </h3>
            <span className="text-sm text-gray-500">
              Total: {projectStats.total} projects
            </span>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* Doughnut Chart Visualization */}
              <div className="w-48 h-48 rounded-full border-8 border-blue-500 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {projectStats.total}
                  </div>
                  <div className="text-sm text-gray-500">Total Projects</div>
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
                  ></div>
                  <span className="text-sm text-gray-700">{status.status}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-3">
                    {status.count}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${status.color} transition-all duration-500`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 ml-3">
                    {status.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Submissions Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Project Activity
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Submissions</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Completions</span>
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
                  ></div>
                  {/* Submissions Bar */}
                  <div
                    className="absolute bottom-0 w-3/5 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                    style={{
                      height: `${(month.submissions / maxValue) * 100}%`,
                      left: "40%",
                    }}
                    title={`${month.month}: ${month.submissions} submissions`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  {month.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {monthlyData.reduce((sum, month) => sum + month.submissions, 0)}
              </div>
              <div className="text-gray-600">Total Submissions</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {monthlyData.reduce((sum, month) => sum + month.completions, 0)}
              </div>
              <div className="text-gray-600">Total Completions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Export Reports
            </h3>
            <p className="text-gray-600">
              Choose format and download your reports
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150">
              Preview
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center"
            >
              <i className="fas fa-file-export mr-2"></i> Export Selected
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {exportOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
                exportFormat === option.id
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
              }`}
              onClick={() => setExportFormat(option.id)}
            >
              <div className="flex items-center mb-3">
                <i
                  className={`fas ${option.icon} text-${option.color}-500 text-xl mr-3`}
                ></i>
                <div>
                  <h4 className="font-medium text-gray-900">{option.title}</h4>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                {exportFormat === option.id && (
                  <i className="fas fa-check-circle text-green-500 ml-auto"></i>
                )}
              </div>

              <div className="space-y-1">
                {option.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-xs text-gray-600"
                  >
                    <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-3 px-3 py-1.5 text-sm rounded-lg transition duration-150 ${
                  exportFormat === option.id
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {exportFormat === option.id ? "Selected" : "Select Format"}
              </button>
            </div>
          ))}
        </div>

        {/* Export Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-medium text-gray-900 mb-1">Export Summary</h4>
              <p className="text-sm text-gray-600">
                {selectedReport
                  ? `"${
                      reportTypes.find((r) => r.id === selectedReport)?.title
                    }" will be exported as ${exportFormat.toUpperCase()}`
                  : "Select a report to view export details"}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center">
                <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                <span>File size: ~2.5MB • Estimated time: 15 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports History */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-chart-pie text-blue-600"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Project Status Report
                      </div>
                      <div className="text-xs text-gray-500">
                        Monthly analysis
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Today, 10:30 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    PDF
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2.1 MB
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Ready
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">
                    <i className="fas fa-download"></i>
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <i className="fas fa-trash"></i>
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
};

export default Reports;
