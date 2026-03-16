import HeaderIcon from "./HeaderIcon";

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
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <HeaderIcon name="bolt" className="text-yellow-500" size="text-sm" />
          Quick Actions
        </h3>
      </div>
      <div className="py-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action.path)}
            className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
          >
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${action.bgColor} mr-3 group-hover:scale-105 transition-transform`}
            >
              <HeaderIcon
                name={action.icon}
                className={action.color}
                size="text-sm"
              />
            </div>
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default QuickAddMenu;
