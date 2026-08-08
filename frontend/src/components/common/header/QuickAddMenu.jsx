import { Zap } from 'lucide-react';

/**
 * QuickAddMenu Component
 *
 * A role-aware action menu that provides one-click access to
 * frequently used creation tasks, such as starting a new project
 * proposal or scheduling a synchronisation meeting.
 */
const QuickAddMenu = ({ actions, onActionClick }) => {
  return (
    <>
      <div className='border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
        <h3 className='flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white'>
          <Zap className='h-4 w-4 text-yellow-500' />
          Quick Actions
        </h3>
      </div>
      <div className='py-1'>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action.path)}
            className='group flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/50'
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${action.bgColor} mr-3 transition-transform group-hover:scale-105`}
            >
              <action.icon
                className={`h-4 w-4 ${action.color}`}
              />
            </div>
            <span className='font-medium'>{action.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default QuickAddMenu;
