import PropTypes from 'prop-types';

/**
 * HeaderIcon Component
 *
 * A specialized utility for rendering FontAwesome icons within the
 * application header. Ensures consistent sizing, weight, and
 * accessibility attributes across global navigation elements.
 */
const HeaderIcon = ({ name, className = '', size = 'text-base' }) => (
  <i
    className={`fas fa-${name} ${size} ${className}`}
    aria-hidden='true'
    style={{ fontFamily: "'Font Awesome 6 Free'", fontWeight: 900 }}
  ></i>
);

HeaderIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.string,
};

export default HeaderIcon;
