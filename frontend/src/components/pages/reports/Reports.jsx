import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import reportService from '../../../services/reportService';
import PageHeader from '../../common/PageHeader';
import {
  PieChart,
  Users,
  CalendarCheck,
  Settings,
  Layout,
  Briefcase,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileType,
  ChevronDown,
  Download,
  Clock,
  Info,
  CheckCircle2,
  Check,
  Loader2,
  Save,
  X,
  Edit,
  FileUp,
  Search,
} from 'lucide-react';

/**
 * Reports Component
 *
 * A powerful data intelligence and export utility. Generates multi-role
 * reports (Project Status, Student Performance, Attendance) with
 * interactive status distributions, longitudinal charts, and
 * versatile export capabilities (PDF, Excel, CSV).
 */
const Reports = memo(() => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('last30days');

  const reportTypes = useMemo(
    () => [
      {
        id: 'project-status',
        title: 'Project Status Report',
        description: 'Detailed analysis of project status distribution',
        icon: 'fa-chart-pie',
        color: 'blue',
        roles: ['admin', 'faculty'],
      },
      {
        id: 'student-performance',
        title: 'Student Performance Report',
        description: 'Academic performance and progress tracking',
        icon: 'fa-users',
        color: 'emerald',
        roles: ['admin', 'faculty'],
      },
      {
        id: 'attendance',
        title: 'Meeting Attendance Report',
        description: 'Attendance statistics and participation rates',
        icon: 'fa-calendar-check',
        color: 'blue',
        roles: ['admin', 'faculty', 'student'],
      },
      {
        id: 'resource-utilization',
        title: 'Resource Utilization Report',
        description: 'Equipment and resource usage analysis',
        icon: 'fa-cogs',
        color: 'amber',
        roles: ['admin'],
      },
      {
        id: 'timeline',
        title: 'Project Timeline Report',
        description: 'Project deadlines and completion tracking',
        icon: 'fa-project-diagram',
        color: 'rose',
        roles: ['admin', 'faculty', 'student'],
      },
      {
        id: 'guide-performance',
        title: 'Guide Performance Report',
        description: 'Faculty guide effectiveness and feedback',
        icon: 'fa-user-tie',
        color: 'indigo',
        roles: ['admin'],
      },
    ],
    []
  );

  const exportOptions = useMemo(
    () => [
      {
        id: 'pdf',
        title: 'PDF Format',
        description: 'High quality printable report',
        icon: 'fa-file-pdf',
        color: 'red',
        features: ['Print-ready', 'Vector graphics', 'Password protection'],
      },
      {
        id: 'excel',
        title: 'Excel Format',
        description: 'Data analysis and manipulation',
        icon: 'fa-file-excel',
        color: 'green',
        features: ['Formulas', 'Charts', 'Pivot tables'],
      },
      {
        id: 'csv',
        title: 'CSV Format',
        description: 'Raw data for external processing',
        icon: 'fa-file-csv',
        color: 'blue',
        features: ['Lightweight', 'Machine readable', 'Import ready'],
      },
      {
        id: 'word',
        title: 'Word Document',
        description: 'Editable document format',
        icon: 'fa-file-word',
        color: 'indigo',
        features: ['Editable', 'Comments', 'Track changes'],
      },
    ],
    []
  );

  const dateRanges = useMemo(
    () => [
      { id: 'today', label: 'Today' },
      { id: 'yesterday', label: 'Yesterday' },
      { id: 'last7days', label: 'Last 7 Days' },
      { id: 'last30days', label: 'Last 30 Days' },
      { id: 'thismonth', label: 'This Month' },
      { id: 'lastmonth', label: 'Last Month' },
      { id: 'custom', label: 'Custom Range' },
    ],
    []
  );

  const [projectStats, setProjectStats] = useState({
    total: 0,
    byStatus: [],
    byDepartment: [
      { department: 'Computer Science', count: 18, percentage: 37.5 },
      { department: 'Information Technology', count: 12, percentage: 25.0 },
      { department: 'Electronics', count: 10, percentage: 20.8 },
      { department: 'Mechanical', count: 8, percentage: 16.7 },
    ],
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recentReports, setRecentReports] = useState([]);

  const fetchRecentReports = useCallback(async () => {
    try {
      const response = await reportService.getRecentReports();
      setRecentReports(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch recent reports', error);
    }
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const [dashRes, reportsRes] = await Promise.allSettled([
          reportService.getProjectStatusReport({ range: dateRange }),
          reportService.getReportsAnalytics(),
        ]);

        const data = dashRes.status === 'fulfilled' ? dashRes.value?.data || {} : {};
        const reportMetrics = reportsRes.status === 'fulfilled' ? reportsRes.value?.data || {} : {};

        if (data && data.stats) {
          setProjectStats((prev) => ({
            ...prev,
            total: data.stats.totalProjects || reportMetrics.summary?.totalProjects || 0,
            byStatus: reportMetrics.statusDistribution || data.activityData || [],
            summary: reportMetrics.summary || {},
          }));
          setMonthlyData(data.performanceData || []);
        }
      } catch (error) {
        console.error('Failed to fetch report data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
    fetchRecentReports();
  }, [dateRange, fetchRecentReports]);

  const colorStyles = useMemo(
    () => ({
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-600 dark:text-blue-400',
        soft: 'bg-blue-50 dark:bg-blue-900/30',
        hoverSoft: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400',
        soft: 'bg-green-50 dark:bg-green-900/30',
        hoverSoft: 'hover:bg-green-100 dark:hover:bg-green-900/50',
      },
      yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-600 dark:text-yellow-400',
        soft: 'bg-yellow-50 dark:bg-yellow-900/30',
        hoverSoft: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/50',
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-600 dark:text-purple-400',
        soft: 'bg-purple-50 dark:bg-purple-900/30',
        hoverSoft: 'hover:bg-purple-100 dark:hover:bg-purple-900/50',
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-600 dark:text-red-400',
        soft: 'bg-red-50 dark:bg-red-900/30',
        hoverSoft: 'hover:bg-red-100 dark:hover:bg-red-900/50',
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900',
        text: 'text-indigo-600 dark:text-indigo-400',
        soft: 'bg-indigo-50 dark:bg-indigo-900/30',
        hoverSoft: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
      },
      gray: {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-600 dark:text-gray-300',
        soft: 'bg-gray-50 dark:bg-gray-700',
        hoverSoft: 'hover:bg-gray-100 dark:hover:bg-gray-600',
      },
    }),
    []
  );

  const maxValue = useMemo(
    () =>
      Math.max(
        ...monthlyData.map((d) => Math.max(d.submissions, d.completions))
      ),
    [monthlyData]
  );

  const generateReport = useCallback(
    async (reportId) => {
      const reportTemplate = reportTypes.find((r) => r.id === reportId);
      if (!reportTemplate) return;

      try {
        setSelectedReport(reportId);
        const reportData = {
          title: reportTemplate.title,
          description: reportTemplate.description,
          type: reportTemplate.id,
          format: exportFormat,
          size: '2.4 MB', // Simulated size
          parameters: { range: dateRange },
        };
        await reportService.createReport(reportData);
        fetchRecentReports();
        alert(`Report "${reportTemplate.title}" generated successfully!`);
      } catch (error) {
        console.error('Failed to generate report', error);
        alert('Failed to generate report.');
      }
    },
    [reportTypes, exportFormat, dateRange, fetchRecentReports]
  );

  const handleExport = useCallback(async () => {
    if (!selectedReport) {
      alert('Please select a report type to export.');
      return;
    }
    try {
      await reportService.exportReport(selectedReport, exportFormat);
      alert(`Report exported as ${exportFormat.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export report.');
    }
  }, [exportFormat, selectedReport]);

  const [editingReport, setEditingReport] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEditReport = (report) => {
    setEditingReport(report._id);
    setEditTitle(report.title);
  };

  const saveReportEdit = async (id) => {
    try {
      await reportService.updateReport(id, { title: editTitle });
      setEditingReport(null);
      fetchRecentReports();
      alert('Report title updated successfully!');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update report title.');
    }
  };

  const cancelEdit = () => {
    setEditingReport(null);
    setEditTitle('');
  };

  const handleExportAll = async () => {
    try {
      await reportService.exportReport('all', exportFormat);
      alert(
        `All reports exported as ${exportFormat.toUpperCase()} successfully!`
      );
    } catch (error) {
      console.error('Export all failed', error);
      alert('Failed to export all reports.');
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.deleteReport(id);
        fetchRecentReports();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handlePreview = () => {
    if (!selectedReport) {
      alert('Please select a report type to preview.');
      return;
    }
    const report = reportTypes.find((r) => r.id === selectedReport);
    alert(
      `Previewing ${report?.title || 'selected report'}...\n(In this version, preview is a mock view of the current charts)`
    );
  };

  // Filter reports based on user role
  const filteredReports = useMemo(
    () => reportTypes.filter((report) => report.roles.includes(user?.role)),
    [reportTypes, user?.role]
  );

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Reports & Analytics'
        subtitle='Generate detailed reports, export telemetry, and analyze system data'
        icon={FileSpreadsheet}
        actions={
          <div className='flex items-center gap-3'>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 shadow-sm transition-all focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200'
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleExportAll}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
            >
              <Download size={16} />
              Export All
            </button>
          </div>
        }
      />

      {/* Report Types Grid */}
      <div className='mb-8'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
          Available Reports
        </h3>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`card-hover rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-md ${
                selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => generateReport(report.id)}
            >
              <div className='mb-4 flex items-start'>
                <div
                  className={`h-12 w-12 ${colorStyles[report.color]?.bg || colorStyles.blue.bg} mr-4 flex items-center justify-center rounded-lg`}
                >
                  {report.id === 'project-status' && (
                    <PieChart
                      className={colorStyles[report.color]?.text}
                      size={24}
                    />
                  )}
                  {report.id === 'student-performance' && (
                    <Users
                      className={colorStyles[report.color]?.text}
                      size={24}
                    />
                  )}
                  {report.id === 'attendance' && (
                    <CalendarCheck
                      className={colorStyles[report.color]?.text}
                      size={24}
                    />
                  )}
                  {report.id === 'resource-utilization' && (
                    <Settings
                      className={colorStyles[report.color]?.text}
                      size={24}
                    />
                  )}
                  {report.id === 'timeline' && (
                    <Layout
                      className={colorStyles[report.color]?.text}
                      size={24}
                    />
                  )}
                  {report.id === 'guide-performance' && (
                    <Briefcase
                      className={colorStyles[report.color]?.text}
                      size={24}
                    />
                  )}
                  {![
                    'project-status',
                    'student-performance',
                    'attendance',
                    'resource-utilization',
                    'timeline',
                    'guide-performance',
                  ].includes(report.id) && (
                    <FileText
                      className={colorStyles[report.color]?.text}
                      size={24}
                    />
                  )}
                </div>
                <div className='flex-1'>
                  <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                    {report.title}
                  </h4>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {report.description}
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
                  <Clock size={12} className='mr-1' />
                  Generated 2 hours ago
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    generateReport(report.id);
                  }}
                  className={`rounded-lg px-3 py-1 text-sm transition duration-150 ${
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
      <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Project Status Distribution */}
        <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-md'>
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Project Status Distribution
            </h3>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Total: {projectStats.total} projects
            </span>
          </div>

          <div className='mb-6 flex items-center justify-center'>
            <div className='relative'>
              {/* Doughnut Chart Visualization */}
              <div
                className={`flex h-48 w-48 items-center justify-center rounded-full border-8 border-blue-500 transition-all duration-700 dark:border-blue-600`}
                style={{
                  boxShadow: `inset 0 0 20px rgba(59, 130, 246, 0.2)`,
                  borderColor: projectStats.total > 0 ? '#3b82f6' : '#e2e8f0',
                }}
              >
                <div className='text-center'>
                  <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {projectStats.total}
                  </div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Total Projects
                  </div>
                </div>
              </div>
              {/* Status indicators */}
              <div className='absolute -right-2 -top-2'>
                <div className='h-4 w-4 rounded-full bg-green-500'></div>
              </div>
              <div className='absolute -bottom-2 -right-2'>
                <div className='h-4 w-4 rounded-full bg-yellow-500'></div>
              </div>
              <div className='absolute -bottom-2 -left-2'>
                <div className='h-4 w-4 rounded-full bg-blue-500'></div>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            {projectStats.byStatus.map((status, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div
                    className={`h-3 w-3 ${status.color} mr-3 rounded-full`}
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    {status.status}
                  </span>
                </div>
                <div className='flex items-center'>
                  <span className='mr-3 text-sm font-medium text-gray-900 dark:text-white'>
                    {status.count}
                  </span>
                  <div className='h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700'>
                    <div
                      className={`h-2 rounded-full ${status.color} transition-all duration-500`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <span className='ml-3 text-sm text-gray-500 dark:text-gray-400'>
                    {status.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Submissions Chart */}
        <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-md'>
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Monthly Project Activity
            </h3>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center'>
                <div className='mr-2 h-3 w-3 rounded-full bg-blue-500'></div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Submissions
                </span>
              </div>
              <div className='flex items-center'>
                <div className='mr-2 h-3 w-3 rounded-full bg-green-500'></div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Completions
                </span>
              </div>
            </div>
          </div>

          <div className='flex h-64 items-end justify-between pt-8'>
            {monthlyData.map((month, index) => (
              <div
                key={index}
                className='mx-1 flex flex-1 flex-col items-center'
              >
                <div
                  className='relative flex w-full justify-center'
                  style={{ height: '120px' }}
                >
                  {/* Completions Bar */}
                  <div
                    className='absolute bottom-0 w-3/5 cursor-pointer rounded-t-lg bg-green-500 transition-all duration-300 hover:bg-green-600'
                    style={{
                      height: `${(month.completions / maxValue) * 100}%`,
                    }}
                    title={`${month.month}: ${month.completions} completions`}
                  />
                  {/* Submissions Bar */}
                  <div
                    className='absolute bottom-0 w-3/5 cursor-pointer rounded-t-lg bg-blue-500 transition-all duration-300 hover:bg-blue-600'
                    style={{
                      height: `${(month.submissions / maxValue) * 100}%`,
                      left: '40%',
                    }}
                    title={`${month.month}: ${month.submissions} submissions`}
                  />
                </div>
                <span className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                  {month.month}
                </span>
              </div>
            ))}
          </div>

          <div className='mt-6 grid grid-cols-2 gap-4 text-sm'>
            <div className='rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/30'>
              <div className='text-2xl font-bold text-blue-600'>
                {monthlyData.reduce((sum, month) => sum + month.submissions, 0)}
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Total Submissions
              </div>
            </div>
            <div className='rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/30'>
              <div className='text-2xl font-bold text-green-600'>
                {monthlyData.reduce((sum, month) => sum + month.completions, 0)}
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Total Completions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-md'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Export Reports
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Choose format and download your reports
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <button
              onClick={handlePreview}
              className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            >
              Preview
            </button>
            <button
              onClick={handleExport}
              className='flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition duration-150 hover:bg-indigo-700'
            >
              <FileUp size={18} className='mr-2' /> Export Selected
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          {exportOptions.map((option) => (
            <div
              key={option.id}
              className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
                exportFormat === option.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/30'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-700'
              }`}
              onClick={() => setExportFormat(option.id)}
            >
              <div className='mb-3 flex items-center'>
                {option.id === 'pdf' && (
                  <FileText
                    className={`${colorStyles[option.color]?.text} mr-3`}
                    size={20}
                  />
                )}
                {option.id === 'excel' && (
                  <FileSpreadsheet
                    className={`${colorStyles[option.color]?.text} mr-3`}
                    size={20}
                  />
                )}
                {option.id === 'csv' && (
                  <FileCode
                    className={`${colorStyles[option.color]?.text} mr-3`}
                    size={20}
                  />
                )}
                {option.id === 'word' && (
                  <FileType
                    className={`${colorStyles[option.color]?.text} mr-3`}
                    size={20}
                  />
                )}
                <div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    {option.title}
                  </h4>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {option.description}
                  </p>
                </div>
                {exportFormat === option.id && (
                  <CheckCircle2 className='ml-auto text-green-500' size={18} />
                )}
              </div>

              <div className='space-y-1'>
                {option.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className='flex items-center text-xs text-gray-600 dark:text-gray-400'
                  >
                    <Check className='mr-2 text-green-500' size={12} />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                className={`mt-3 w-full rounded-lg px-3 py-1.5 text-sm transition duration-150 ${
                  exportFormat === option.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {exportFormat === option.id ? 'Selected' : 'Select Format'}
              </button>
            </div>
          ))}
        </div>

        {/* Export Summary */}
        <div className='mt-6 border-t border-gray-200 pt-6 dark:border-gray-700'>
          <div className='flex flex-col items-center justify-between md:flex-row'>
            <div className='mb-4 md:mb-0'>
              <h4 className='mb-1 font-medium text-gray-900 dark:text-white'>
                Export Summary
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {selectedReport
                  ? `"${
                      reportTypes.find((r) => r.id === selectedReport)?.title
                    }" will be exported as ${exportFormat.toUpperCase()}`
                  : 'Select a report to view export details'}
              </p>
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              <div className='flex items-center'>
                <Info size={16} className='mr-2 text-blue-500' />
                <span>File size: ~2.5MB • Estimated time: 15 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports History */}
      <div className='mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-md'>
        <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Recent Reports
          </h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                  Report Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                  Generated On
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                  Format
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                  Size
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
              {loading ? (
                <tr>
                  <td
                    colSpan='6'
                    className='px-6 py-8 text-center text-gray-500'
                  >
                    <Loader2
                      size={20}
                      className='mr-2 inline-block animate-spin'
                    />{' '}
                    Loading reports...
                  </td>
                </tr>
              ) : recentReports.length === 0 ? (
                <tr>
                  <td
                    colSpan='6'
                    className='px-6 py-8 text-center italic text-gray-500'
                  >
                    No reports generated yet.
                  </td>
                </tr>
              ) : (
                recentReports.map((report) => (
                  <tr key={report._id}>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
                          <FileText
                            size={16}
                            className='text-blue-600 dark:text-blue-400'
                          />
                        </div>
                        <div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {report.title}
                          </div>
                          <div className='text-xs text-gray-500 dark:text-gray-400'>
                            {report.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          report.format === 'pdf'
                            ? 'bg-red-100 text-red-800'
                            : report.format === 'excel'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {report.format?.toUpperCase()}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                      {report.size}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900 dark:text-green-200'>
                        {report.status}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                      {editingReport === report._id ? (
                        <div className='flex items-center space-x-2'>
                          <input
                            type='text'
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className='rounded border p-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                            autoFocus
                          />
                          <button
                            onClick={() => saveReportEdit(report._id)}
                            className='p-1 text-green-600 hover:text-green-800'
                            title='Save Changes'
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className='p-1 text-rose-600 hover:text-rose-800'
                            title='Cancel'
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditReport(report)}
                            className='mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300'
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleExport()}
                            className='mr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                          >
                            <i className='fas fa-trash' />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

Reports.displayName = 'Reports';

export default Reports;
