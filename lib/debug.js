/**
 * Debug utility for the application
 * Enables debug logging based on localStorage setting or env var
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Debug state
let isDebugMode = false;

// Set debug mode based on environment variables or localStorage
if (isBrowser) {
  // Try to get debug setting from localStorage
  try {
    isDebugMode = localStorage.getItem('debug_mode') === 'true';
  } catch (e) {
    // If localStorage is not available, fallback to false
    isDebugMode = false;
  }
} else {
  // In server environment, check NODE_ENV
  isDebugMode = process.env.NODE_ENV === 'development';
}

/**
 * Enable or disable debug mode
 * @param {boolean} enabled - Whether debug mode should be enabled
 */
export function setDebugMode(enabled) {
  isDebugMode = !!enabled;
  
  if (isBrowser) {
    try {
      localStorage.setItem('debug_mode', String(isDebugMode));
      console.log(`Debug mode ${isDebugMode ? 'enabled' : 'disabled'}`);
    } catch (e) {
      console.error('Failed to set debug mode in localStorage:', e);
    }
  }
}

/**
 * Check if debug mode is enabled
 * @returns {boolean} - Whether debug mode is enabled
 */
export function isDebugEnabled() {
  return isDebugMode;
}

/**
 * Log message only if debug mode is enabled
 * @param {string} message - The message to log
 * @param {any} data - Additional data to log
 */
export function debugLog(message, data) {
  if (!isDebugMode) return;
  
  if (data !== undefined) {
    console.log(`[DEBUG] ${message}`, data);
  } else {
    console.log(`[DEBUG] ${message}`);
  }
}

/**
 * Log error message only if debug mode is enabled
 * @param {string} message - The error message to log
 * @param {Error|any} error - The error object or data
 */
export function debugError(message, error) {
  if (!isDebugMode) return;
  
  if (error !== undefined) {
    console.error(`[DEBUG ERROR] ${message}`, error);
  } else {
    console.error(`[DEBUG ERROR] ${message}`);
  }
}

/**
 * Measure execution time of a function if debug mode is enabled
 * @param {string} label - Label for the timing
 * @param {Function} fn - Function to execute and time
 * @returns {any} - Return value from the function
 */
export function debugTime(label, fn) {
  if (!isDebugMode) return fn();
  
  console.time(`[DEBUG TIME] ${label}`);
  try {
    const result = fn();
    console.timeEnd(`[DEBUG TIME] ${label}`);
    return result;
  } catch (e) {
    console.timeEnd(`[DEBUG TIME] ${label}`);
    throw e;
  }
}

/**
 * Enable debug mode in the browser console
 */
if (isBrowser) {
  window.enableDebug = () => setDebugMode(true);
  window.disableDebug = () => setDebugMode(false);
  console.log('Debug tools available: enableDebug(), disableDebug()');
}

export default {
  isEnabled: isDebugEnabled,
  setEnabled: setDebugMode,
  log: debugLog,
  error: debugError,
  time: debugTime
};