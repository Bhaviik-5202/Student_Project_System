import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FileType,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  PieChart,
  Users,
  CalendarCheck,
  Briefcase,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import SectionHeader from '../../ui/SectionHeader';
import StatisticsCard from '../../ui/StatisticsCard';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import ErrorState from '../../ui/ErrorState';
import EmptyState from '../../ui/EmptyState';
import StatusBadge from '../../ui/StatusBadge';
import reportService from '../../../services/reportService';
import useNotification from '../../../hooks/useNotification';

const MobileReportCard = ({ rep, onDownload, onDelete }) => (
  <div className='flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
    <div className='flex items-start justify-between gap-3'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-lg font-black text-indigo-600 dark:from-indigo-950/60 dark:to-indigo-900/40 dark:text-indigo-400'>
          <FileText size={20} />
        </div>
        <div className='flex flex-col'>
          <div className='text-[14px] font-black text-slate-900 dark:text-white leading-tight line-clamp-1'>
            {rep.title}
          </div>
          <div className='text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate'>
            {rep.type || 'Academic Status'}
          </div>
        </div>
      </div>
    </div>

    <div className='mt-2 flex items-center justify-between rounded-xl bg-slate-50/50 p-3 dark:bg-slate-800/40'>
      <div className='flex flex-col gap-1'>
        <span className='font-bold uppercase text-indigo-600 dark:text-indigo-400 text-[10px]'>
          {rep.format || 'PDF'}
        </span>
        <span className='text-[10px] font-semibold text-slate-400'>
          Generated: {rep.date || 'Today'}
        </span>
      </div>
      
      <div className='flex items-center gap-2'>
        <Button variant='primary' size='sm' icon={Download} onClick={() => onDownload(rep)}>
          DL
        </Button>
        <button onClick={() => onDelete(rep.id || rep._id)} className='flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-transform active:scale-90 dark:bg-rose-500/20 dark:text-rose-400'>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  </div>
);

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [reportType, setReportType] = useState('project-status');
  const [format, setFormat] = useState('pdf');
  const [timeframe, setTimeframe] = useState('fall-2026');
  const [department, setDepartment] = useState('all');
  const [generating, setGenerating] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getRecentReports();
      if (res.success || res.data) {
        setReports(
          Array.isArray(res.data) ? res.data : res.data?.reports || []
        );
      }
    } catch (err) {
      console.error('Failed to load recent reports:', err);
      setError('Failed to fetch reports. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const titleMap = {
        'project-status': 'Project Status & Milestone Progress Report',
        'student-performance':
          'Student Performance & Grade Distribution Report',
        attendance: 'Meeting Attendance & Activity Telemetry Report',
        'guide-performance': 'Faculty Supervision & Workload Audit Report',
      };

      const newReportData = {
        title: `${titleMap[reportType] || 'Custom Academic Report'} (${timeframe.toUpperCase()})`,
        type: reportType,
        format: format.toLowerCase(), // Must be lowercase for Mongoose enum validation
        department,
        timeframe,
        date: new Date().toISOString().slice(0, 10),
        status: 'ready',
      };

      const res = await reportService.createReport(newReportData);
      showSuccess(
        `Report generated successfully in ${format.toUpperCase()} format!`
      );

      const created = res.data || newReportData;
      setReports((prev) => [created, ...prev]);
    } catch (err) {
      showError('Report generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (rep) => {
    try {
      showSuccess(`Exporting report "${rep.title}"...`);
      // Simulate real file download by converting report data to JSON blob
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(rep, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        `${rep.title.replace(/\s+/g, '_').toLowerCase()}.${rep.format?.toLowerCase() || 'json'}`
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      showError('Failed to download report.');
    }
  };

  const handleDeleteReport = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this historical report entry?'
      )
    )
      return;
    try {
      await reportService.deleteReport(id);
      showSuccess('Report log entry removed.');
      setReports((prev) => prev.filter((r) => (r.id || r._id) !== id));
    } catch (err) {
      showError('Error deleting report entry.');
    }
  };

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        title='Reports & Data Export'
        subtitle='Generate official institutional reports, student progress audits, and department telemetry.'
        icon={FileText}
        badge='Institutional Analytics'
        actions={
          <Button
            variant='outline'
            size='sm'
            icon={RefreshCw}
            onClick={fetchReports}
          >
            Refresh Logs
          </Button>
        }
      />

      {/* Generator Card */}
      <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
        <SectionHeader
          title='Instant Report Generator'
          description='Select parameters to generate multi-format analytical export documents.'
        />

        <form onSubmit={handleGenerateReport} className='mt-4 space-y-4'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Select
              label='Report Category'
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'project-status', label: 'Project Status & Progress' },
                { value: 'student-performance', label: 'Student Performance' },
                { value: 'attendance', label: 'Meeting & Activity Attendance' },
                {
                  value: 'guide-performance',
                  label: 'Faculty Mentorship Audit',
                },
              ]}
            />

            <Select
              label='Export Format'
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'pdf', label: 'PDF Document (.pdf)' },
                { value: 'csv', label: 'CSV Spreadsheet (.csv)' },
                { value: 'excel', label: 'Excel Workbook (.xlsx)' },
              ]}
            />

            <Select
              label='Academic Term'
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              options={[
                { value: 'fall-2026', label: 'Fall 2026' },
                { value: 'spring-2026', label: 'Spring 2026' },
                { value: 'year-2025-2026', label: 'Academic Year 2025-26' },
              ]}
            />

            <Select
              label='Target Department'
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'cs', label: 'Computer Science' },
                { value: 'it', label: 'Information Technology' },
                { value: 'se', label: 'Software Engineering' },
                { value: 'ds', label: 'Data Science' },
              ]}
            />
          </div>

          <div className='flex items-center justify-end pt-2'>
            <Button
              type='submit'
              variant='primary'
              icon={Download}
              loading={generating}
            >
              Generate Report Document
            </Button>
          </div>
        </form>
      </div>

      {/* Historical Report Downloads Table */}
      <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-xs dark:border-slate-800 '>
        <SectionHeader
          title='Generated Report Logs'
          description='Recent reports available for immediate download or redistribution.'
        />

        {loading ? (
          <LoadingSpinner message='Loading historical report logs...' />
        ) : reports.length === 0 ? (
          <EmptyState
            title='No Generated Reports'
            description='Use the generator above to produce your first analytical report.'
            icon={FileText}
          />
        ) : (
          <>
          {/* Desktop Table */}
          <div className='mt-4 hidden md:block overflow-x-auto'>
            <table className='w-full text-left text-sm text-slate-600 dark:text-slate-400'>
              <thead className='border-b border-slate-200 bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 dark:border-slate-800 /50 '>
                <tr>
                  <th className='px-6 py-3.5 font-semibold'>Report Title</th>
                  <th className='px-6 py-3.5 font-semibold'>Category</th>
                  <th className='px-6 py-3.5 font-semibold'>Format</th>
                  <th className='px-6 py-3.5 font-semibold'>Generated Date</th>
                  <th className='px-6 py-3.5 font-semibold'>Status</th>
                  <th className='px-6 py-3.5 font-semibold text-right'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
                {reports.map((rep) => {
                  const repId = rep.id || rep._id;
                  return (
                    <tr
                      key={repId}
                      className='hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 /50'
                    >
                      <td className='px-6 py-4 font-bold text-slate-900 dark:text-white'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'>
                            <FileText className='h-5 w-5' />
                          </div>
                          <span>{rep.title}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4 font-medium'>
                        {rep.type || 'Academic Status'}
                      </td>
                      <td className='px-6 py-4 font-bold uppercase text-indigo-600 dark:text-indigo-400 text-xs'>
                        {rep.format || 'PDF'}
                      </td>
                      <td className='px-6 py-4 text-xs text-slate-500 dark:text-slate-400'>
                        {rep.date || 'Today'}
                      </td>
                      <td className='px-6 py-4'>
                        <StatusBadge status='completed' label='Ready' />
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='primary'
                            size='sm'
                            icon={Download}
                            onClick={() => handleDownloadReport(rep)}
                          >
                            Download
                          </Button>
                          <button
                            onClick={() => handleDeleteReport(repId)}
                            className='rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                            title='Delete Log'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Cards */}
          <div className='mt-4 block md:hidden space-y-4'>
            {reports.map((rep) => (
              <MobileReportCard
                key={rep.id || rep._id}
                rep={rep}
                onDownload={handleDownloadReport}
                onDelete={handleDeleteReport}
              />
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
