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
  Settings,
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
 * Ultra-premium design with glassmorphism and smooth micro-animations.
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
    setTimeout(() => navigate(path), 200); // Wait for drawer to close smoothly
  };

  const handleLogoutClick = () => {
    onClose();
    setTimeout(() => logout(), 200);
  };

  return (
    <div className={`fixed inset-0 z-[300] flex md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Drawer Container */}
      <div className={`relative flex w-[85%] max-w-[320px] flex-col bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out z-10 h-[100dvh] overflow-hidden border-r border-white/20 dark:border-slate-800/80 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Drawer Header */}
        <div className='relative flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800'>
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10' />
          
          <div className='relative z-10 flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 text-white'>
              <GraduationCap className='h-5 w-5' />
            </div>
            <div className='flex flex-col'>
              <h2 className='text-[15px] font-black text-slate-900 dark:text-white leading-tight'>
                Student Project
              </h2>
              <span className='text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5'>
                Navigation Menu
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className='relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform active:scale-90 dark:bg-slate-800 dark:text-slate-400'
            aria-label='Close sidebar'
          >
            <CloseIcon className='h-4.5 w-4.5' />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className='m-4 overflow-hidden rounded-2xl border border-blue-100/50 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm dark:border-blue-900/30 dark:from-slate-800 dark:to-slate-800/80'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3 min-w-0'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-[15px] shadow-sm'>
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-[14px] font-extrabold text-slate-900 dark:text-white truncate'>
                    {user.name}
                  </p>
                  <p className='text-[11px] font-bold text-blue-600 dark:text-blue-400 capitalize mt-0.5 truncate bg-blue-100 dark:bg-blue-500/10 w-fit px-2 py-0.5 rounded-full'>
                    {user.role} Account
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleNavClick('/profile')}
                className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm transition-transform active:scale-90 dark:bg-slate-700 dark:text-blue-400'
                title='My Profile'
              >
                <User className='h-4.5 w-4.5' />
              </button>
            </div>
          </div>
        )}

        {/* Modules Navigation Scroll Area */}
        <div className='flex-1 overflow-y-auto px-4 pb-6 space-y-2 no-scrollbar'>
          <div className='px-1 pb-2 pt-2 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500'>
            Menu
          </div>

          {filteredItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const visibleSubmenu = hasSubmenu
              ? item.submenu.filter((sub) => sub.roles.includes(userRole))
              : [];
            const isExpanded = expandedSections[item.title];
            const IconComponent = ICON_MAP[item.icon] || FolderKanban;

            return (
              <div key={item.title} className='rounded-2xl flex flex-col overflow-hidden'>
                {hasSubmenu && visibleSubmenu.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleSection(item.title)}
                      className='flex w-full items-center justify-between rounded-2xl p-3 text-[13px] font-bold text-slate-700 transition-colors active:bg-slate-100 dark:text-slate-200 dark:active:bg-slate-800'
                    >
                      <div className='flex items-center gap-3'>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isExpanded ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                          <IconComponent className='h-4 w-4' />
                        </div>
                        <span>{item.title}</span>
                      </div>
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-blue-50 text-blue-600 dark:bg-blue-500/10' : 'bg-slate-50 text-slate-400 dark:bg-slate-800/50'}`}>
                        <ChevronDown className='h-3.5 w-3.5' />
                      </div>
                    </button>

                    {/* Submodules Drawer List */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <div className='ml-5 space-y-1 border-l-2 border-slate-100 pl-3 py-1 dark:border-slate-800'>
                        {visibleSubmenu.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleNavClick(sub.path)}
                            className='flex w-full items-center justify-between rounded-xl p-2.5 text-[12px] font-bold text-slate-500 transition-colors active:bg-slate-50 active:text-slate-900 dark:text-slate-400 dark:active:bg-slate-800 dark:active:text-white'
                          >
                            <span>{sub.title}</span>
                            <ChevronRight className='h-3 w-3 opacity-50' />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className='flex w-full items-center gap-3 rounded-2xl p-3 text-[13px] font-bold text-slate-700 transition-colors active:bg-slate-100 dark:text-slate-200 dark:active:bg-slate-800'
                  >
                    <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
                      <IconComponent className='h-4 w-4' />
                    </div>
                    <span>{item.title}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className='border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 space-y-3'>
          <button
            onClick={() => handleNavClick('/settings')}
            className='flex w-full items-center gap-3 rounded-2xl p-3 text-[13px] font-bold text-slate-700 transition-colors active:bg-slate-100 dark:text-slate-200 dark:active:bg-slate-800'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
              <Settings className='h-4 w-4' />
            </div>
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className='flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 p-3.5 text-[13px] font-bold text-rose-600 transition-transform active:scale-95 dark:bg-rose-500/10 dark:text-rose-400'
          >
            <LogOut className='h-4.5 w-4.5' />
            Secure Logout
          </button>
        </div>
      </div>
    </div>
  );
});

MobileSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

MobileSidebar.displayName = 'MobileSidebar';

export default MobileSidebar;
