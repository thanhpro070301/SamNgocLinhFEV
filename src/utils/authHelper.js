// authHelper.js - Utilities for auth state management

/**
 * Validates and repairs authentication state inconsistencies
 * @returns {boolean} - True if the user appears to be authenticated
 */
export function validateAuthState() {
  console.log('Validating auth state...');
  
  // Check if auth state is consistent
  const localToken = localStorage.getItem('authToken');
  const sessionToken = sessionStorage.getItem('authToken');
  const localAuth = localStorage.getItem('isAuthenticated') === 'true';
  const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  
  console.log('Current auth state:', {
    localStorage: { token: !!localToken, isAuthenticated: localAuth },
    sessionStorage: { token: !!sessionToken, isAuthenticated: sessionAuth }
  });
  
  // If either storage has a token but auth state doesn't match, fix it
  if (localToken && !localAuth) {
    console.log('Fixing localStorage authentication state');
    localStorage.setItem('isAuthenticated', 'true');
  }
  
  if (sessionToken && !sessionAuth) {
    console.log('Fixing sessionStorage authentication state');
    sessionStorage.setItem('isAuthenticated', 'true');
  }
  
  // Sync tokens between storages
  if (localToken && (!sessionToken || localToken !== sessionToken)) {
    console.log('Syncing token from localStorage to sessionStorage');
    sessionStorage.setItem('authToken', localToken);
    sessionStorage.setItem('isAuthenticated', 'true');
    
    const expiresAt = localStorage.getItem('expiresAt') || localStorage.getItem('tokenExpiresAt');
    if (expiresAt) {
      sessionStorage.setItem('expiresAt', expiresAt);
      sessionStorage.setItem('tokenExpiresAt', expiresAt);
    }
    
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      sessionStorage.setItem('userDetails', userDetails);
    }
  } else if (sessionToken && (!localToken || sessionToken !== localToken)) {
    console.log('Syncing token from sessionStorage to localStorage');
    localStorage.setItem('authToken', sessionToken);
    localStorage.setItem('isAuthenticated', 'true');
    
    const expiresAt = sessionStorage.getItem('expiresAt') || sessionStorage.getItem('tokenExpiresAt');
    if (expiresAt) {
      localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('tokenExpiresAt', expiresAt);
    }
    
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      localStorage.setItem('userDetails', userDetails);
    }
  }
  
  // Check for token expiration
  const expiresAtStr = localStorage.getItem('expiresAt') || 
                    localStorage.getItem('tokenExpiresAt') || 
                    sessionStorage.getItem('expiresAt') || 
                    sessionStorage.getItem('tokenExpiresAt');
                    
  if (expiresAtStr) {
    const expiresAt = parseInt(expiresAtStr, 10);
    const now = Date.now();
    
    if (!isNaN(expiresAt) && now >= expiresAt) {
      console.log('Token is expired, clearing auth state');
      clearAuthState();
      return false;
    }
  }
  
  // Return current authentication state
  return !!(localToken || sessionToken);
}

/**
 * Clears all authentication data from both localStorage and sessionStorage
 */
export function clearAuthState() {
  console.log('Clearing all auth state data');
  
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('hasUser');
  localStorage.removeItem('userDetails');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('tokenExpiresAt');
  
  // Clear sessionStorage
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('userDetails');
  sessionStorage.removeItem('expiresAt');
  sessionStorage.removeItem('tokenExpiresAt');
}

/**
 * Checks if user has a valid auth token
 * @returns {boolean} - True if user has a valid token
 */
export function hasValidToken() {
  // First validate and repair any inconsistent state
  validateAuthState();
  
  // Now check if we have a token
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return !!token;
}

/**
 * Sets up an auth header for fetch or axios requests
 * @returns {Object} - Headers object with Authorization header if token exists
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
}

export default {
  validateAuthState,
  clearAuthState,
  hasValidToken,
  getAuthHeaders
}; 