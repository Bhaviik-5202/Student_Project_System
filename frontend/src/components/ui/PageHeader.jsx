import React from 'react';

/**
 * Reusable PageHeader component for consistent top page bar
 */
const PageHeader = ({
    title,
    description,
    icon: Icon,
    actions,
    badgeText,
    badgeVariant = 'info',
    className = '',
}) => {
    return (
        <div className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6 ${className}`}>
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-xs">
                            <Icon className="h-6 w-6" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {title}
                            </h1>
                            {badgeText && (
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeVariant === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                                        badgeVariant === 'warning' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                                            'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                    }`}>
                                    {badgeText}
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
