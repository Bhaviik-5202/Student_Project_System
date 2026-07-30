import React from 'react';
import {
  Activity,
  CheckCircle2,
  Server,
  Database,
  Shield,
  Bell,
  RefreshCw,
  Clock,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';

const SystemStatus = () => {
  const services = [
    {
      name: 'Core API Gateway',
      status: 'Operational',
      uptime: '99.98%',
      latency: '24ms',
      icon: Server,
      color: 'text-emerald-500',
    },
    {
      name: 'MongoDB Database Cluster',
      status: 'Operational',
      uptime: '99.99%',
      latency: '12ms',
      icon: Database,
      color: 'text-emerald-500',
    },
    {
      name: 'Authentication & JWT Service',
      status: 'Operational',
      uptime: '100.0%',
      latency: '18ms',
      icon: Shield,
      color: 'text-emerald-500',
    },
    {
      name: 'Notification & Alerts Engine',
      status: 'Operational',
      uptime: '99.95%',
      latency: '35ms',
      icon: Bell,
      color: 'text-emerald-500',
    },
  ];

  return (
    <div className='space-y-8 animate-fade-in pt-0 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <PageHeader
        title='System Health & Status'
        subtitle='Real-time operational metrics, service uptime, and infrastructure health.'
        icon={Activity}
      />

      {/* Global Status Banner */}
      <div className='rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30'>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
              All Systems Operational
            </h2>
            <p className='text-xs text-slate-600 dark:text-slate-300'>
              All academic platform microservices are running normally.
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800'>
          <Clock size={14} className='text-indigo-500' />
          <span>Updated just now</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.name}
              className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                      {svc.name}
                    </h3>
                    <span className='text-[11px] text-slate-500 dark:text-slate-400'>
                      Latency: {svc.latency}
                    </span>
                  </div>
                </div>

                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
                  {svc.status}
                </span>
              </div>

              <div className='flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'>
                <span>Uptime (last 30 days)</span>
                <span className='font-mono font-bold text-slate-900 dark:text-white'>
                  {svc.uptime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemStatus;
