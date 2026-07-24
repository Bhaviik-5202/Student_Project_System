import React from 'react';
import CommonPageHeader from '../common/PageHeader';

/**
 * Reusable PageHeader component from ui module.
 * Wraps common/PageHeader to provide consistent, modern header styling application-wide.
 */
const PageHeader = (props) => {
  return <CommonPageHeader {...props} />;
};

export default PageHeader;
