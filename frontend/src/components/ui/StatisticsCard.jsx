import React from 'react';

const StatisticsCard = ({
    title,
    value,
    change,
    changeType = 'positive', // 'positive' | 'negative' | 'neutral'
    icon: Icon,
    description,
    color = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue'
    className = '',
}) => {
    const colorMap = {
        indigo: {
            bg: 'bg-indigo-50 dark:bg-indigo-950/50',
            text: 'text-indigo-600 dark:text-indigo-400',
            border: 'border-indigo-100 dark:border-indigo-900/50',
        },
        emerald: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/50',
            text: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-100 dark:border-emerald-900/50',
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-950/50',
            text: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-100 dark:border-amber-900/50',
        },
        rose: {
            bg: 'bg-rose-50 dark:bg-rose-950/50',
            text: 'text-rose-600 dark:text-rose-400',
            border: 'border-rose-100 dark:border-rose-900/50',
        },
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-950/50',
            text: 'text-purple-600 dark:text-purple-400',
            border: 'border-purple-100 dark:border-purple-900/50',
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-950/50',
            text: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-100 dark:border-blue-900/50',
        },
    };

    const selectedColor = colorMap[color] || colorMap.indigo;

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {title}
                </span>
                {Icon && (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {value !== undefined && value !== null ? value : 0}
                </span>
                {change && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${changeType === 'positive' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                            changeType === 'negative' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200  dark:text-slate-300'
                        }`}>
                        {change}
                    </span>
                )}
            </div>

            {description && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
};

export default StatisticsCard;
