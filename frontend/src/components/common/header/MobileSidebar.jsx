import { useState, useMemo, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../../hooks/useAuth';
import { navigationItems } from '../../../config/navigation';

// Lucide icons
import {
  X as CloseIcon,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Home,
  FolderKanban,
  Users,
  CalendarDays,
  BookOpen,
  ShieldCheck,
  BarChart3,
  HelpCircle,
  User,
  LogOut,
} from 'lucide-react';

const ICON_MAP = {
  home: Home,
  'project-diagram': FolderKanban,
  'user-graduate': Users,
  'calendar-alt': CalendarDays,
  'folder-open': BookOpen,
  cogs: ShieldCheck,
  'chart-bar': BarChart3,
  'question-circle': HelpCircle,
};

/**
 * MobileSidebar Component
 *
 * Full-featured mobile navigation drawer opened when clicking the logo on mobile.
 * Renders all primary modules, sub-modules, role permissions, and user profile links.
 */
const MobileSidebar = memo(({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});

  const userRole = useMemo(() => user?.role || 'student', [user?.role]);

  // Filter main navigation items based on user role
  const filteredItems = useMemo(
    () => navigationItems.filter((item) => item.roles.includes(userRole)),
    [userRole]
  );

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleNavClick = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogoutClick = () => {
    onClose();
    logout();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[300] flex md:hidden'>
      {/* Backdrop Overlay */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Drawer Container */}
      <div className='relative flex w-4/5 max-w-xs flex-col bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out z-10 h-full overflow-hidden border-r border-slate-200 dark:border-slate-800'>
        {/* Drawer Header */}
        <div className='flex items-center justify-between border-b border-slate-200/80 px-4 py-3.5 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xs text-white'>
              <GraduationCap className='h-5 w-5' />
            </div>
            <div>
              <h2 className='text-sm font-bold text-slate-900 dark:text-white leading-tight'>
                Student Project System
              </h2>
              <span className='text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider'>
                Navigation Menu
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className='rounded-xl p-2 text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors'
            aria-label='Close sidebar'
          >
            <CloseIcon className='h-5 w-5' />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className='mx-3 mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900/40 dark:bg-blue-950/30 flex items-center justify-between'>
            <div className='flex items-center gap-2.5 min-w-0 pr-2'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs'>
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
              </div>
              <div className='min-w-0'>
                <p className='text-xs font-bold text-slate-900 dark:text-white truncate'>
                  {user.name}
                </p>
                <p className='text-[10px] font-semibold text-blue-700 dark:text-blue-300 capitalize truncate'>
                  {user.role} Account
                </p>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('/profile')}
              className='rounded-lg p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50'
              title='My Profile'
            >
              <User className='h-4 w-4' />
            </button>
          </div>
        )}

        {/* Modules Navigation Scroll Area */}
        <div className='flex-1 overflow-y-auto px-3 py-3 space-y-1.5'>
          <div className='px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
            Modules & Access
          </div>

          {filteredItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const visibleSubmenu = hasSubmenu
              ? item.submenu.filter((sub) => sub.roles.includes(userRole))
              : [];
            const isExpanded = expandedSections[item.title];
            const IconComponent = ICON_MAP[item.icon] || FolderKanban;

            return (
              <div key={item.title} className='rounded-xl space-y-1'>
                {hasSubmenu && visibleSubmenu.length > 0 ? (
                  <div>
                    <button
                      onClick={() => toggleSection(item.title)}
                      className='flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800/80 transition-all'
                    >
                      <div className='flex items-center gap-2.5'>
                        <IconComponent className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        <span>{item.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                      ) : (
                        <ChevronRight className='h-4 w-4 text-slate-400' />
                      )}
                    </button>

                    {/* Submodules Drawer List */}
                    {isExpanded && (
                      <div className='ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2.5 dark:border-blue-900/40'>
                        {visibleSubmenu.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleNavClick(sub.path)}
                            className='flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 active:bg-blue-50 dark:active:bg-slate-800 transition-colors'
                          >
                            <span>{sub.title}</span>
                            <ChevronRight className='h-3 w-3 text-slate-400' />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className='flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800/80 transition-all'
                  >
                    <IconComponent className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                    <span>{item.title}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className='border-t border-slate-200/80 p-3 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900'>
          <button
            onClick={handleLogoutClick}
            className='flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 shadow-2xs active:scale-[0.98] dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400'
          >
            <LogOut className='h-4 w-4' />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
});

MobileSidebar.displayName = 'MobileSidebar';

MobileSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileSidebar;
