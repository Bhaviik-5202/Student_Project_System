import PropTypes from 'prop-types';
import {
  Home,
  FolderKanban,
  GraduationCap,
  Calendar,
  FolderOpen,
  Settings,
  BarChart2,
  HelpCircle,
  Plus,
  Search,
  Play,
  FileText,
  Upload,
  Download,
  Check,
  X,
  Trash2,
  Edit2,
  Info,
  History,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const ICON_MAP = {
  home: Home,
  'project-diagram': FolderKanban,
  'user-graduate': GraduationCap,
  'calendar-alt': Calendar,
  'folder-open': FolderOpen,
  cogs: Settings,
  'chart-bar': BarChart2,
  'question-circle': HelpCircle,
  plus: Plus,
  search: Search,
  play: Play,
  'file-text': FileText,
  upload: Upload,
  download: Download,
  check: Check,
  times: X,
  xmark: X,
  'trash-alt': Trash2,
  edit: Edit2,
  'info-circle': Info,
  history: History,
  sun: Sun,
  moon: Moon,
  bell: Bell,
  'calendar-days': Calendar,
  'magnifying-glass': Search,
  'graduation-cap': GraduationCap,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'angle-right': ChevronRight,
};

/**
 * HeaderIcon Component
 *
 * A specialized utility for rendering Lucide React icons within the
 * application header. Ensures consistent sizing and accessibility attributes.
 */
const HeaderIcon = ({ name, className = '', size = 'w-4 h-4' }) => {
  const Icon = ICON_MAP[name] || Home;
  return <Icon className={`${size} ${className}`} aria-hidden='true' />;
};

HeaderIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.string,
};

export default HeaderIcon;
