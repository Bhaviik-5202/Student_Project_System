import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, RefreshCw, Download, User, Network, ListChecks, CheckCircle, Calendar, Filter, Loader2, FolderOpen, AlignCenter } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';
import '../../../assets/styles/admin.css';

const MobileAuditCard = memo(({ log, getUserDisplay }) => (
  <div className='flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
    <div className='flex items-start justify-between gap-3'>
      <div className='flex items-center gap-2'>
        <User size={24} className='text-slate-400 dark:text-slate-500' />
        <div className='flex flex-col'>
          <span className='font-semibold text-slate-900 dark:text-slate-200 text-[14px] leading-tight'>
            {getUserDisplay(log.user)}
          </span>
          <span className='font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-0.5'>
            {log.timestamp || (log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A')}
          </span>
        </div>
      </div>
      <span className={`admin-badge shrink-0 text-[10px] ${log.status === 'Success' ? 'admin-badge-success' : log.status === 'Warning' ? 'admin-badge-warning' : 'admin-badge-danger'
        }`}>
        {log.status || 'Unknown'}
      </span>
    </div>

    <div className='mt-1 flex flex-col gap-1.5 rounded-xl bg-slate-50/50 p-3 dark:bg-slate-800/40'>
      <div className='font-bold text-slate-900 dark:text-white text-[13px]'>
        {log.action}
      </div>
      {log.details && (
        <div className='text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed'>
          {log.details}
        </div>
      )}
      <div className='mt-2 flex items-center gap-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50'>
        <Network size={10} className='text-slate-400' />
        <span className='font-mono text-[10px] text-slate-600 dark:text-slate-400 font-bold'>
          {log.ip || '127.0.0.1'}
        </span>
      </div>
    </div>
  </div>
));

/**
 * AuditLog - Immutable record of system-wide administrative and security events.
 * Standardized to use global admin.css and FontAwesome icons.
 */
const AuditLog = memo(() => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    action: '',
    status: '',
    date: '',
  });

  const fetchLogs = useCallback(
    async (currentFilters = filters, isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const queryParams = {
          action: currentFilters.action || undefined,
          status: currentFilters.status || undefined,
          createdAt: currentFilters.date || undefined,
        };

        const response = await api.get('/auditlogs', { params: queryParams });

        if (response.success) {
          const logData = response.data?.logs || response.data || [];
          setLogs(Array.isArray(logData) ? logData : []);
          if (isRefresh) toast.success('Logs synchronized');
        } else {
          toast.error(response.message || 'Failed to fetch audit records');
          setLogs([]);
        }
      } catch (error) {
        console.error('Audit log fetch error:', error);
        toast.error('Security service unreachable');
        setLogs([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleApplyFilters = () => {
    fetchLogs(filters);
  };

  const getUserDisplay = (user) => {
    if (!user) return 'System';
    if (typeof user === 'string') return user;
    return user.email || user.name || user.username || 'System';
  };

  const handleExportLogs = () => {
    if (logs.length === 0) {
      toast.error('No data available for export');
      return;
    }

    try {
      const headers = ['Timestamp', 'User', 'Action', 'IP Address', 'Status'];
      const csvRows = logs.map((log) => {
        const timestamp =
          log.timestamp ||
          (log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A');
        const user = getUserDisplay(log.user);
        const action = (log.action || 'Unknown Action')
          .toString()
          .replace(/"/g, '""');
        const ip = log.ip || '127.0.0.1';
        const status = log.status || 'Success';

        return [
          `"${timestamp}"`,
          `"${user}"`,
          `"${action}"`,
          `"${ip}"`,
          `"${status}"`,
        ].join(',');
      });

      const csvContent = [headers.join(','), ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `security_audit_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Security report exported');
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Export process failed');
    }
  };

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Security Audit Logs'
        subtitle='Immutable record of administrative and security events'
        icon={Shield}
        badge={`${logs.length} Log Events`}
        actions={
          <>
            <button
              onClick={() => fetchLogs(filters, true)}
              disabled={loading || refreshing}
              className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              title='Refresh logs'
            >
              <RefreshCw
                size={16}
                className={refreshing ? 'animate-spin' : ''}
                style={{ alignItems: "center" }}
              />
              Refresh
            </button>
            <button
              onClick={handleExportLogs}
              disabled={logs.length === 0 || loading}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 dark:shadow-none'
            >
              <Download size={16} />
              Export CSV
            </button>
          </>
        }
      />

      <div className='admin-card mb-6'>
        <div className='grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4'>
          <div className='admin-form-group mb-0'>
            <label className='admin-label'>
              <ListChecks size={16} className='mr-2 opacity-50' />
              Action Type
            </label>
            <select
              className='admin-input'
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
            >
              <option
                value=''
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                All Actions
              </option>
              <option
                value='User Login'
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                Login Events
              </option>
              <option
                value='User Registration'
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                Registrations
              </option>
              <option
                value='User Creation'
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                User Creation
              </option>
              <option
                value='User Management'
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                User Management
              </option>
            </select>
          </div>
          <div className='admin-form-group mb-0'>
            <label className='admin-label'>
              <CheckCircle size={16} className='mr-2 opacity-50' />
              Status
            </label>
            <select
              className='admin-input'
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option
                value=''
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                All Status
              </option>
              <option
                value='Success'
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                Success
              </option>
              <option
                value='Failed'
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                Failed
              </option>
              <option
                value='Warning'
                className='bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
              >
                Warning
              </option>
            </select>
          </div>
          <div className='admin-form-group mb-0'>
            <label className='admin-label'>
              <Calendar size={16} className='mr-2 opacity-50' />
              Event Date
            </label>
            <input
              type='date'
              className='admin-input dark:[color-scheme:dark]'
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div className='admin-form-group mb-0 sm:col-span-2 md:col-span-1 flex flex-col justify-end'>
            <label className='admin-label invisible hidden md:block'>Apply</label>
            <button
              onClick={handleApplyFilters}
              className='admin-btn admin-btn-primary w-full justify-center mt-2 md:mt-0'
            >
              <Filter size={16} />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className='hidden md:block admin-table-container'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th style={{ width: '200px' }}>Timestamp</th>
              <th style={{ width: '250px' }}>User Entity</th>
              <th>Operation</th>
              <th style={{ width: '150px', textAlign: 'center' }}>IP Node</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Response</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='5' className='p-20 text-center'>
                  <div className='flex flex-col items-center gap-4 py-10'>
                    <Loader2 size={30} className='animate-spin text-blue-500' />
                    <p className='font-medium text-slate-500 dark:text-slate-400'>
                      Synchronizing records...
                    </p>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan='5' className='p-20 text-center'>
                  <div className='flex flex-col items-center gap-3 py-10'>
                    <FolderOpen size={48} className='mb-2 text-slate-300 dark:text-slate-600' />
                    <p className='font-bold text-slate-500 dark:text-slate-400'>
                      No security events found.
                    </p>
                    <button
                      onClick={() => {
                        const resetFilters = {
                          action: '',
                          status: '',
                          date: '',
                        };
                        setFilters(resetFilters);
                        fetchLogs(resetFilters);
                      }}
                      className='text-sm font-bold text-blue-600 hover:underline dark:text-blue-400'
                    >
                      Clear search parameters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id || log._id}>
                  <td className='font-mono text-xs text-slate-500 dark:text-slate-400'>
                    {log.timestamp ||
                      (log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : 'N/A')}
                  </td>
                  <td>
                    <div className='flex items-center gap-2'>
                      <User size={16} className='text-slate-400 dark:text-slate-500' />
                      <span className='font-semibold text-slate-900 dark:text-slate-200'>
                        {getUserDisplay(log.user)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className='font-medium text-slate-900 dark:text-white'>
                      {log.action}
                    </div>
                    {log.details && (
                      <div className='mt-0.5 text-[11px] text-slate-500 dark:text-slate-400'>
                        {log.details}
                      </div>
                    )}
                  </td>
                  <td className='text-center font-mono text-[11px] text-slate-600 dark:text-slate-400'>
                    {log.ip || '127.0.0.1'}
                  </td>
                  <td className='text-center'>
                    <span
                      className={`admin-badge ${log.status === 'Success'
                          ? 'admin-badge-success'
                          : log.status === 'Warning'
                            ? 'admin-badge-warning'
                            : 'admin-badge-danger'
                        }`}
                    >
                      {log.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className='block md:hidden space-y-4'>
        {loading ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <Loader2 size={24} className='animate-spin text-blue-500 mb-3' />
            <span className='text-[13px] font-semibold text-slate-500'>Synchronizing records...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            <FolderOpen size={36} className='mb-3 text-slate-300 dark:text-slate-600' />
            <span className='text-[13px] font-semibold text-slate-500 mb-2'>No security events found.</span>
            <button
              onClick={() => {
                const resetFilters = { action: '', status: '', date: '' };
                setFilters(resetFilters);
                fetchLogs(resetFilters);
              }}
              className='text-xs font-bold text-blue-600 hover:underline dark:text-blue-400'
            >
              Clear search parameters
            </button>
          </div>
        ) : (
          logs.map((log) => (
            <MobileAuditCard key={log.id || log._id} log={log} getUserDisplay={getUserDisplay} />
          ))
        )}
      </div>
    </div>
  );
});

AuditLog.displayName = 'AuditLog';
export default AuditLog;
