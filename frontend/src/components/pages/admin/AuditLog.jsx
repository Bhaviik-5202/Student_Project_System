import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import '../../../assets/styles/admin.css';

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

        console.log('Fetching logs with filters:', queryParams);

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
    console.log('Manual filter apply triggered:', filters);
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
    <div className='admin-page'>
      <div className='admin-container'>
        <header className='admin-header'>
          <div>
            <h1 className='admin-title flex items-center gap-3'>
              <i className='fas fa-shield-alt text-blue-600'></i>
              Security Audit Logs
            </h1>
            <p className='admin-subtitle'>
              Record of administrative and security events
            </p>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => fetchLogs(filters, true)}
              disabled={loading || refreshing}
              className='admin-btn admin-btn-secondary'
              title='Refresh logs'
            >
              <i
                className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''}`}
              ></i>
            </button>
            <button
              onClick={handleExportLogs}
              disabled={logs.length === 0 || loading}
              className='admin-btn admin-btn-primary'
            >
              <i className='fas fa-file-export'></i>
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        <div className='admin-card mb-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='admin-form-group mb-0'>
              <label className='admin-label'>
                <i className='fas fa-tasks mr-2 opacity-50'></i>
                Action Type
              </label>
              <select
                className='admin-input'
                value={filters.action}
                onChange={(e) =>
                  setFilters({ ...filters, action: e.target.value })
                }
              >
                <option value=''>All Actions</option>
                <option value='User Login'>Login Events</option>
                <option value='User Registration'>Registrations</option>
                <option value='User Creation'>User Creation</option>
                <option value='User Management'>User Management</option>
              </select>
            </div>
            <div className='admin-form-group mb-0'>
              <label className='admin-label'>
                <i className='fas fa-check-circle mr-2 opacity-50'></i>
                Status
              </label>
              <select
                className='admin-input'
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value=''>All Status</option>
                <option value='Success'>Success</option>
                <option value='Failed'>Failed</option>
                <option value='Warning'>Warning</option>
              </select>
            </div>
            <div className='admin-form-group mb-0'>
              <label className='admin-label'>
                <i className='fas fa-calendar-alt mr-2 opacity-50'></i>
                Event Date
              </label>
              <input
                type='date'
                className='admin-input'
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
            </div>
            <div className='flex items-end'>
              <button
                onClick={handleApplyFilters}
                className='admin-btn admin-btn-primary w-full'
              >
                <i className='fas fa-filter'></i>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className='admin-table-container'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th style={{ width: '200px' }}>Timestamp</th>
                <th style={{ width: '250px' }}>User Entity</th>
                <th>Operation</th>
                <th style={{ width: '150px', textAlign: 'center' }}>IP Node</th>
                <th style={{ width: '120px', textAlign: 'center' }}>
                  Response
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='5' className='p-20 text-center'>
                    <div className='flex flex-col items-center gap-4 py-10'>
                      <i className='fas fa-circle-notch fa-spin text-3xl text-blue-500'></i>
                      <p className='font-medium text-slate-500'>
                        Synchronizing records...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan='5' className='p-20 text-center'>
                    <div className='flex flex-col items-center gap-3 py-10'>
                      <i className='fas fa-folder-open mb-2 text-5xl text-slate-200'></i>
                      <p className='font-bold text-slate-500'>
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
                        className='text-sm font-bold text-blue-600 hover:underline'
                      >
                        Clear search parameters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id || log._id}>
                    <td className='font-mono text-xs text-slate-400'>
                      {log.timestamp ||
                        (log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : 'N/A')}
                    </td>
                    <td>
                      <div className='flex items-center gap-2'>
                        <i className='fas fa-user-circle text-slate-300'></i>
                        <span className='font-semibold text-slate-700 dark:text-slate-300'>
                          {getUserDisplay(log.user)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {log.action}
                      </div>
                      {log.details && (
                        <div className='mt-0.5 text-[11px] text-slate-400'>
                          {log.details}
                        </div>
                      )}
                    </td>
                    <td className='text-center font-mono text-[11px] text-slate-500'>
                      {log.ip || '127.0.0.1'}
                    </td>
                    <td className='text-center'>
                      <span
                        className={`admin-badge ${
                          log.status === 'Success'
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
      </div>
    </div>
  );
});

AuditLog.displayName = 'AuditLog';
export default AuditLog;
