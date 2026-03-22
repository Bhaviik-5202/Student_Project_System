import React, { memo } from "react";
import PropTypes from "prop-types";

/**
 * SystemMetrics Component
 * 
 * Displays live system telemetry and performance indicators in a simplified card format.
 * Replaces the previous premium/dark-themed implementation with standardized global styles.
 */
const SystemMetrics = memo(({ stats = {} }) => {
  const metrics = [
    {
      label: "System Performance",
      value: `${stats.systemPerformance || 92}%`,
      change: stats.performanceChange || "+2.5%",
      progress: stats.systemPerformance || 92,
      icon: "fa-server"
    },
    {
      label: "Response Time",
      value: `${stats.responseTime || 128}ms`,
      change: stats.responseTimeChange || "-12ms",
      progress: 85,
      icon: "fa-bolt"
    },
    {
      label: "Active Users",
      value: stats.activeUsers || 156,
      change: stats.userChange || "+8",
      progress: 75,
      icon: "fa-users"
    },
    {
      label: "Data Accuracy",
      value: stats.dataAccuracy || "99.8%",
      change: "Verified",
      progress: 99,
      icon: "fa-shield-halved"
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
            System Metrics
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Live performance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full font-bold">
            LIVE
          </span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center mr-3">
                  <i className={`fas ${metric.icon} text-slate-400`}></i>
                </div>
                {metric.label}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-white">{metric.value}</span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded">
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${metric.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-end">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Last updated</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <i className="fas fa-microchip text-slate-200 dark:text-slate-700 text-2xl"></i>
      </div>
    </div>
  );
});

SystemMetrics.displayName = "SystemMetrics";

SystemMetrics.propTypes = {
  stats: PropTypes.object
};

export default SystemMetrics;
