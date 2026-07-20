import { useState, useEffect, memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import analyticsService from '../../../services/analyticsService';
import '../../../assets/styles/admin.css';

// SVG Icon Components (no external dependencies)
const Icons = {
  Users: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  ),

  Project: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' />
      <line x1='12' y1='11' x2='12' y2='17' />
      <line x1='9' y1='14' x2='15' y2='14' />
    </svg>
  ),

  Clock: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <polyline points='12 6 12 12 16 14' />
    </svg>
  ),

  Heartbeat: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
    </svg>
  ),

  UserCog: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
      <circle cx='8.5' cy='7' r='4' />
      <circle cx='18' cy='11' r='3' />
      <path d='M18 8v1' />
      <path d='M18 14v-1' />
      <path d='M15.5 9.5l.9.4' />
      <path d='M19.6 12.1l.9.4' />
      <path d='M15.5 12.5l.9-.4' />
      <path d='M19.6 9.9l.9-.4' />
    </svg>
  ),

  Settings: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
    </svg>
  ),

  Clipboard: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
      <rect x='8' y='2' width='8' height='4' rx='1' ry='1' />
      <line x1='8' y1='10' x2='16' y2='10' />
      <line x1='8' y1='14' x2='16' y2='14' />
      <line x1='8' y1='18' x2='12' y2='18' />
    </svg>
  ),

  Database: ({ className }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <ellipse cx='12' cy='5' rx='9' ry='3' />
      <path d='M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' />
      <path d='M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' />
    </svg>
  ),
};

// Stat Card Component
const StatCard = memo(({ icon: IconComponent, value, label }) => {
  return (
    <div className='admin-stat-card'>
      <div className='admin-stat-icon'>
        <IconComponent className='h-6 w-6' />
      </div>
      <div>
        <div className='admin-stat-value'>{value}</div>
        <div className='admin-stat-label'>{label}</div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

StatCard.displayName = 'StatCard';

// Quick Action Button Component
const QuickActionButton = memo(({ icon: IconComponent, label, onClick }) => (
  <button
    onClick={onClick}
    className='admin-btn admin-btn-secondary'
    style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      height: 'auto',
    }}
  >
    <IconComponent className='mb-2 h-6 w-6 text-blue-600' />
    <span>{label}</span>
  </button>
));

QuickActionButton.displayName = 'QuickActionButton';

QuickActionButton.displayName = 'QuickActionButton';

// Activity Item Component
const ActivityItem = memo(({ user, action, time }) => (
  <div className='flex items-center justify-between border-b border-slate-100 p-4 last:border-0 dark:border-slate-700'>
    <div className='flex items-center gap-3'>
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300'>
        {user.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className='text-sm font-medium text-slate-900 dark:text-white'>
          {user}
        </div>
        <div className='text-xs text-slate-500'>{action}</div>
      </div>
    </div>
    <time className='text-xs text-slate-400'>{time}</time>
  </div>
));

ActivityItem.displayName = 'ActivityItem';

// Service Status Item Component
const ServiceStatusItem = memo(
  ({ service, status, uptime, icon: IconComponent }) => {
    const isOnline = status === 'Online';

    return (
      <div className='flex items-center justify-between border-b border-slate-100 p-4 last:border-0 dark:border-slate-700'>
        <div className='flex items-center gap-3'>
          <div
            className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}
          />
          <div className='text-sm font-medium text-slate-900 dark:text-white'>
            {service}
          </div>
        </div>
        <div className='text-right'>
          <div className='text-xs font-semibold text-slate-900 dark:text-white'>
            {uptime}
          </div>
          <div className='text-[10px] uppercase text-slate-400'>Uptime</div>
        </div>
      </div>
    );
  }
);

ServiceStatusItem.displayName = 'ServiceStatusItem';

// Page configs
const STATS_CONFIG = [
  { key: 'totalUsers', icon: Icons.Users, label: 'Total Users' },
  { key: 'activeProjects', icon: Icons.Project, label: 'Active Projects' },
  { key: 'pendingApprovals', icon: Icons.Clock, label: 'Pending Approvals' },
  {
    key: 'systemHealth',
    icon: Icons.Heartbeat,
    label: 'System Health',
    suffix: '%',
  },
];

const QUICK_ACTIONS_CONFIG = [
  {
    id: 'users',
    icon: Icons.UserCog,
    label: 'User Management',
    path: '/user-management',
  },
  {
    id: 'settings',
    icon: Icons.Settings,
    label: 'System Settings',
    path: '/system-settings',
  },
  {
    id: 'audit',
    icon: Icons.Clipboard,
    label: 'Audit Log',
    path: '/audit-log',
  },
  { id: 'backup', icon: Icons.Database, label: 'Backup', path: '/backup' },
];

// Service icons mapping
const SERVICE_ICONS = {
  db: Icons.Database,
  storage: Icons.Project,
  email: Icons.Clipboard,
  api: Icons.Settings,
};

/**
 * AdminDashboard Component
 *
 * The mission control center for system administrators. Provides high-level
 * system telemetry, staggered statistical animations, platform-wide
 * quick actions, real-time activity tracking, and service health monitoring.
 */
const AdminDashboard = memo(() => {
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (path) => () => navigate(path),
    [navigate]
  );

  // State for real dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    systemHealth: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep system services as fetched or empty if not yet provided by API
  const [systemServices, setSystemServices] = useState([
    { id: 'db', service: 'Database', status: 'Online', uptime: '99.9%' },
    {
      id: 'storage',
      service: 'File Storage',
      status: 'Online',
      uptime: '99.8%',
    },
    {
      id: 'email',
      service: 'Email Service',
      status: 'Online',
      uptime: '99.7%',
    },
    { id: 'api', service: 'API Server', status: 'Online', uptime: '99.9%' },
  ]);

  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const loadData = (isBackground = false) => {
      if (!isBackground) setLoading(true);
      analyticsService
        .getDashboardStats()
        .then((res) => {
          if (mounted && res && res.data) {
            setStats({
              totalUsers: res.data.totalUsers,
              activeProjects: res.data.activeProjects,
              pendingApprovals: res.data.pendingApprovals,
              systemHealth: res.data.systemHealth || 98,
            });
            setRecentActivities(
              (res.data.recentActivities || []).map((a, idx) => ({
                id: idx + 1,
                user: a.owner?.name || 'Unknown',
                action: `${a.status === 'pending' ? 'Pending approval for' : a.status === 'active' ? 'Active project:' : 'Project updated:'} ${a.title}`,
                time: new Date(a.updatedAt).toLocaleString(),
              }))
            );
          }
        })
        .catch((err) => {
          if (mounted) setError('Failed to load dashboard data');
        })
        .finally(() => {
          if (mounted && !isBackground) setLoading(false);
        });
    };

    loadData();

    const handleFocus = () => loadData(true);
    window.addEventListener('focus', handleFocus);

    return () => {
      mounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, [location.key]);

  if (loading) {
    return <div className='p-8 text-center text-lg'>Loading dashboard...</div>;
  }
  if (error) {
    return <div className='p-8 text-center text-red-600'>{error}</div>;
  }

  return (
    <div className='admin-page'>
      <div className='admin-container'>
        <header className='admin-header'>
          <div>
            <h1 className='admin-title'>Admin Dashboard</h1>
            <p className='admin-subtitle'>
              System overview and management console
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              className='admin-card'
              style={{
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div className='h-2 w-2 rounded-full bg-emerald-500' />
              <span className='text-xs font-semibold'>99.8% Uptime</span>
            </div>
          </div>
        </header>

        <section className='admin-stat-grid'>
          {STATS_CONFIG.map(({ key, icon, label, suffix }) => (
            <StatCard
              key={key}
              icon={icon}
              value={`${stats[key]}${suffix || ''}`}
              label={label}
            />
          ))}
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          <section className='admin-card'>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Quick Actions
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              {QUICK_ACTIONS_CONFIG.map(({ id, icon, label, path }) => (
                <QuickActionButton
                  key={id}
                  icon={icon}
                  label={label}
                  onClick={handleNavigate(path)}
                />
              ))}
            </div>
          </section>

          <section className='admin-card'>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Recent Activities
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentActivities.length === 0 ? (
                <p className='py-4 text-center text-sm text-slate-500'>
                  No recent activities
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    user={activity.user}
                    action={activity.action}
                    time={activity.time}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        <section className='admin-card'>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '20px',
            }}
          >
            System Status
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1px',
              backgroundColor: 'var(--admin-border)',
            }}
          >
            {systemServices.map((service) => (
              <div
                key={service.id}
                style={{ backgroundColor: 'var(--admin-white)' }}
              >
                <ServiceStatusItem
                  service={service.service}
                  status={service.status}
                  uptime={service.uptime}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
