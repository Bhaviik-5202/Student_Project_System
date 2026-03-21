import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import "../../../assets/styles/admin.css";

const AuditLog = memo(() => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    action: "",
    status: "",
    date: ""
  });

  const fetchLogs = async (currentFilters = filters) => {
    try {
      setLoading(true);
      // Build query params
      const params = new URLSearchParams();
      if (currentFilters.action && currentFilters.action !== "All Actions") params.append("action", currentFilters.action);
      if (currentFilters.status && currentFilters.status !== "All Status") params.append("status", currentFilters.status);
      if (currentFilters.date) params.append("createdAt", currentFilters.date);

      const response = await api.get(`/auditlogs?${params.toString()}`);
      // The backend returns { success: true, data: { logs: [], pagination: {} } }
      // Or might return just the array if it's a simple list
      const logData = response.data?.logs || response.data || [];
      setLogs(logData);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleApplyFilters = () => {
    fetchLogs();
  };

  const handleExportLogs = () => {
    if (logs.length === 0) {
      alert("No logs to export");
      return;
    }

    // Simple CSV export
    const headers = ["Timestamp", "User", "Action", "IP Address", "Status"];
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          log.timestamp || new Date(log.createdAt).toLocaleString(),
          log.user || "Unknown",
          `"${log.action.replace(/"/g, '""')}"`,
          log.ip || "N/A",
          log.status || "Unknown",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Audit Logs</h1>
            <p className="admin-subtitle">Track and monitor all system-wide activities</p>
          </div>
          <button
            onClick={handleExportLogs}
            disabled={logs.length === 0}
            className="admin-btn admin-btn-secondary"
          >
            Export to CSV
          </button>
        </header>

        <div className="admin-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="admin-form-group mb-0">
              <label className="admin-label text-[10px] uppercase">Action Type</label>
              <select 
                className="admin-input py-1.5 text-sm"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              >
                <option value="">All Actions</option>
                <option value="Login">Login</option>
                <option value="File Operations">File Operations</option>
                <option value="User Management">User Management</option>
              </select>
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-label text-[10px] uppercase">Status</label>
              <select 
                className="admin-input py-1.5 text-sm"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Warning">Warning</option>
              </select>
            </div>
            <div className="admin-form-group mb-0">
              <label className="admin-label text-[10px] uppercase">Date</label>
              <input 
                type="date" 
                className="admin-input py-1.5 text-sm" 
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleApplyFilters}
                className="admin-btn admin-btn-primary w-full py-2"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-muted)' }}>
                    Fetching security logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--admin-text-muted)' }}>
                    No audit records found for the selected criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id || log._id}>
                    <td style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                      {log.timestamp || (log.createdAt ? new Date(log.createdAt).toLocaleString() : "N/A")}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{log.user || "System"}</div>
                    </td>
                    <td>
                      <div className="max-w-md truncate" title={log.action}>{log.action}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.ip || "127.0.0.1"}</td>
                    <td>
                      <span className={`admin-badge ${log.status === 'Success' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                        {log.status || "Unknown"}
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

AuditLog.displayName = "AuditLog";

export default AuditLog;
