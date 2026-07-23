/**
 * Event Bus for Application-Wide Real-Time State Synchronization
 * Dispatches and listens for custom 'sps-data-changed' events to keep dashboards
 * and lists automatically updated without manual page reloads.
 */

const EVENT_NAME = 'sps-data-changed';

export const notifyDataChanged = (details = {}) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(EVENT_NAME, { detail: details });
    window.dispatchEvent(event);
  }
};

export const subscribeDataChanged = (callback) => {
  if (typeof window !== 'undefined') {
    const handler = (event) => callback(event.detail);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }
  return () => {};
};

export default {
  notifyDataChanged,
  subscribeDataChanged,
};
