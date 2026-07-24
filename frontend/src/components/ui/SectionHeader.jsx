import React from 'react';

const SectionHeader = ({ title, description, actions, className = '' }) => {
    return (
        <div className={`mb-4 flex items-center justify-between gap-4 ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
};

export default SectionHeader;
