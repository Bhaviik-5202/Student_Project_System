import React from 'react';
import { FolderKanban } from 'lucide-react';

const BADGE_CONFIGS = {
  info: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200/80 dark:border-indigo-800/50',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-800/50',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-800/50',
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-950/60',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200/80 dark:border-rose-800/50',
  },
  neutral: {
    bg: 'bg-slate-50 dark:bg-slate-800/60',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200/80 dark:border-slate-700/50',
  },
};

const VARIANT_STYLES = {
  default: {
    wrapper: 'px-6 py-8 sm:px-6 sm:py-6 md:p-8 min-h-[112px] sm:min-h-[108px] mt-3 sm:mt-0',
    icon: 'h-12 w-12 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl sm:rounded-2xl',
    iconSize: 22,
    title: 'text-[19px] sm:text-xl md:text-2xl leading-tight',
    subtitle: 'text-[13.5px] sm:text-sm mt-3 sm:mt-1',
  },
  small: {
    wrapper: 'px-3 py-3 sm:px-5 sm:py-4.5 min-h-[64px]',
    icon: 'h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl',
    iconSize: 18,
    title: 'text-base sm:text-lg',
    subtitle: 'text-xs',
  },
  compact: {
    wrapper: 'px-3 py-2.5 sm:px-4 sm:py-3.5 min-h-[52px]',
    icon: 'h-8 w-8 sm:h-9 sm:w-9 rounded-lg',
    iconSize: 16,
    title: 'text-sm sm:text-base md:text-lg',
    subtitle: 'text-xs',
  },
};

/**
 * PageHeader Component
 * Premium reusable header component for application pages.
 * Supports icons, badges, breadcrumbs, titles, subtitles/descriptions, and responsive action controls.
 */
export const PageHeader = ({
  title,
  subtitle,
  description,
  icon: Icon = FolderKanban,
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  iconBg = 'bg-gradient-to-br from-indigo-50 to-blue-100/50 dark:from-indigo-950/70 dark:to-blue-900/40 border border-indigo-100/80 dark:border-indigo-900/50 shadow-sm',
  iconSize,
  badge,
  badgeText,
  badgeVariant = 'info',
  breadcrumbs,
  actions,
  variant = 'default',
  small = false,
  className = '',
  id,
  testId,
  onAction,
}) => {
  // Determine effective variant (small prop takes precedence over variant)
  const effectiveVariant = small ? 'small' : variant;
  const styles = VARIANT_STYLES[effectiveVariant] || VARIANT_STYLES.default;

  const subContent = subtitle || description;
  const displayBadgeText =
    badgeText || (typeof badge === 'string' ? badge : null);
  const badgeStyles = BADGE_CONFIGS[badgeVariant] || BADGE_CONFIGS.info;

  // Handle icon rendering
  const renderIcon = () => {
    if (!Icon) return null;

    const finalIconSize = iconSize || styles.iconSize;

    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon, {
        size: finalIconSize,
        className: iconColor,
        'aria-hidden': true,
      });
    }

    return (
      <Icon size={finalIconSize} className={iconColor} aria-hidden='true' />
    );
  };

  return (
    <header
      className={`
        w-full flex flex-col items-start gap-6 sm:gap-4 md:flex-row md:items-center md:justify-between
        rounded-2xl border border-slate-300 dark:border-slate-600 sm:border-slate-200/80 sm:dark:border-slate-700/80
        bg-gradient-to-r from-white via-slate-50/50 to-white
        shadow-md sm:shadow-sm backdrop-blur-sm transition-all duration-200
        dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900
        ${styles.wrapper}
        ${className}
      `}
      id={id}
      data-testid={testId}
      role='banner'
    >
      <div className='flex items-start sm:items-center gap-5 sm:gap-4 min-w-0 w-full md:w-auto'>
        {Icon && (
          <div
            className={`
              flex items-center justify-center
              ${styles.icon}
              ${iconBg}
              shrink-0 transition-transform duration-200 hover:scale-105
            `}
            aria-hidden='true'
          >
            {renderIcon()}
          </div>
        )}

        <div className='min-w-0 flex-1'>
          {breadcrumbs && (
            <div className='mb-4 sm:mb-1.5' aria-label='Breadcrumb navigation'>
              {breadcrumbs}
            </div>
          )}

          <div className='flex items-center gap-3 sm:gap-2.5 flex-wrap'>
            <h1
              className={`
              font-bold text-slate-900 dark:text-white
              tracking-tight break-words max-w-full
              ${styles.title}
            `}
            >
              {title}
            </h1>

            {displayBadgeText ? (
              <span
                className={`
                  inline-flex items-center rounded-full px-2.5 py-0.5
                  text-xs font-semibold border transition-colors
                  ${badgeStyles.bg}
                  ${badgeStyles.text}
                  ${badgeStyles.border}
                `}
                role='status'
                aria-label={`Status: ${displayBadgeText}`}
              >
                {displayBadgeText}
              </span>
            ) : (
              badge && typeof badge !== 'string' && badge
            )}
          </div>

          {subContent && (
            <p
              className={`
              text-slate-500 dark:text-slate-400
              font-medium leading-relaxed break-words max-w-full
              ${styles.subtitle}
            `}
            >
              {subContent}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div
          className={`
          w-full md:w-auto flex flex-col sm:flex-row flex-wrap sm:items-center gap-3.5 sm:gap-3 shrink-0
          mt-3 sm:mt-0 pt-6 pb-2 sm:pt-4 sm:pb-2 md:pt-0 md:pb-0
          ${effectiveVariant !== 'compact' ? 'border-t border-slate-200 dark:border-slate-700 md:border-t-0 sm:border-slate-100 sm:dark:border-slate-700/50' : ''}
        `}
        >
          {actions}
        </div>
      )}
    </header>
  );
};

// Default export for convenience
export default PageHeader;
