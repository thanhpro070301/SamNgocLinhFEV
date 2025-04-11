import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import sessionToken from './sessionToken'
import router from '@/router'
import { login, logout, validateToken, resetAuth, initAuth, getProfile, sendOtp, verifyOtp } from '@/api/auth.service'
import { clearAllAuthData } from '@/utils/clearAuth'
import { api as authApi } from '@/api/auth.service'

// Define the store with option-based approach for greater safety
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    sessionCheckInterval: null,
    idleTimeout: null,
    lastActivity: Date.now(),
    sessionSyncInterval: null
  }),
  
  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    authStatus: (state) => {
      if (state.isAuthenticated && state.user) {
        return true;
      }
      
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const expiresAtStr = localStorage.getItem('tokenExpiresAt') || localStorage.getItem('expiresAt') || 
                           sessionStorage.getItem('tokenExpiresAt') || sessionStorage.getItem('expiresAt');
      const now = Date.now();
      
      if (!token) {
        return false;
      }
      
      if (expiresAtStr) {
        try {
          const expireTime = parseInt(expiresAtStr, 10);
          if (!isNaN(expireTime) && now >= expireTime) {
            return false;
          }
        } catch (e) {
          console.error('Error parsing token expiry:', e);
        }
      }
      
      return true;
    }
  },
  
  actions: {
    // Initialize auth state from localStorage
    async init() {
      console.log('Auth store init() called')
      
      try {
        this.loading = true;
        
        // Sync tokens between localStorage and sessionStorage first
        this.syncStorages();
        
        // Check if token exists and is valid
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const expiresAtStr = localStorage.getItem('tokenExpiresAt') || localStorage.getItem('expiresAt') || 
                           sessionStorage.getItem('tokenExpiresAt') || sessionStorage.getItem('expiresAt');
        const now = Date.now();
        const isAuthenticated = (localStorage.getItem('isAuthenticated') === 'true') || 
                              (sessionStorage.getItem('isAuthenticated') === 'true');
        
        console.log('Auth state check:', {
          hasToken: !!token,
          hasExpiryTime: !!expiresAtStr,
          isAuthenticated
        });
        
        // Safely parse expiration date
        let expireTime = null;
        if (expiresAtStr) {
          try {
            // Try parsing as a number first
            const parsedTime = parseInt(expiresAtStr, 10);
            if (!isNaN(parsedTime)) {
              expireTime = parsedTime;
            } else {
              // Try parsing as date string
              const dateTime = new Date(expiresAtStr).getTime();
              if (!isNaN(dateTime)) {
                expireTime = dateTime;
              }
            }
          } catch (err) {
            console.error('Error parsing token expiry time:', err);
          }
        }
        
        // Token is valid if it exists AND either:
        // 1. expiresAt exists and is greater than now, OR
        // 2. expiresAt doesn't exist but isAuthenticated is true (fallback)
        const tokenValid = token && ((expireTime && now < expireTime) || (!expireTime && isAuthenticated));
        
        if (!tokenValid || !isAuthenticated) {
          console.log('No valid token found during init');
          this.isAuthenticated = false;
          this.user = null;
          clearAllAuthData(); // Clear any stale data
          return { success: false, message: 'No valid token found' };
        }
        
        // If expiresAt doesn't exist but we have a token and isAuthenticated,
        // set a default expiry time to prevent future validation issues
        if (!expireTime && token && isAuthenticated) {
          const defaultExpiresAt = now + 24 * 60 * 60 * 1000; // 1 day from now
          localStorage.setItem('expiresAt', defaultExpiresAt.toString());
          localStorage.setItem('tokenExpiresAt', defaultExpiresAt.toString());
          sessionStorage.setItem('expiresAt', defaultExpiresAt.toString());
          sessionStorage.setItem('tokenExpiresAt', defaultExpiresAt.toString());
          console.log('Set default token expiry time:', new Date(defaultExpiresAt).toISOString());
        }
        
        // Try to validate token with API
        const result = await initAuth();
        
        if (result.success) {
          this.isAuthenticated = true;
          
          // Try to get user details
          const userJson = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails');
          if (userJson) {
            try {
              this.user = JSON.parse(userJson);
              console.log('User data loaded from storage');
            } catch (e) {
              console.error('Error parsing user data:', e);
              // Get fresh user data from API
              try {
                await this.fetchUserProfile();
              } catch (profileError) {
                console.error('Could not fetch profile after init:', profileError);
                // If we still don't have user data, this is concerning but not fatal
                if (!this.user) {
                  console.warn('No user data available after init');
                }
              }
            }
          } else {
            // Get user data from API
            try {
              await this.fetchUserProfile();
            } catch (profileError) {
              console.error('Could not fetch profile after init:', profileError);
            }
          }
          
          // Start session monitoring
          this.startSessionCheck();
          this.setupActivityTracking();
          this.startSessionSync();
          
          return { success: true, message: 'Session restored successfully' };
        }
        
        return { success: false, message: result.message };
      } catch (error) {
        console.error('Error in auth.init():', error);
        this.isAuthenticated = false;
        this.user = null;
        clearAllAuthData(); // Clear any stale data
        return { success: false, message: 'Error initializing auth', error };
      } finally {
        this.loading = false;
      }
    },
    
    // Sync data between localStorage and sessionStorage
    syncStorages() {
      // Get tokens from both storages
      const localToken = localStorage.getItem('authToken');
      const sessionToken = sessionStorage.getItem('authToken');
      
      // Synchronize tokens
      if (localToken && (!sessionToken || localToken !== sessionToken)) {
        console.log('Syncing token from localStorage to sessionStorage');
        sessionStorage.setItem('authToken', localToken);
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // Sync expiry time
        const expiresAt = localStorage.getItem('expiresAt') || localStorage.getItem('tokenExpiresAt');
        if (expiresAt) {
          sessionStorage.setItem('expiresAt', expiresAt);
          sessionStorage.setItem('tokenExpiresAt', expiresAt);
        }
        
        // Sync user details
        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
          sessionStorage.setItem('userDetails', userDetails);
        }
      } else if (sessionToken && (!localToken || sessionToken !== localToken)) {
        console.log('Syncing token from sessionStorage to localStorage');
        localStorage.setItem('authToken', sessionToken);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Sync expiry time
        const expiresAt = sessionStorage.getItem('expiresAt') || sessionStorage.getItem('tokenExpiresAt');
        if (expiresAt) {
          localStorage.setItem('expiresAt', expiresAt);
          localStorage.setItem('tokenExpiresAt', expiresAt);
        }
        
        // Sync user details
        const userDetails = sessionStorage.getItem('userDetails');
        if (userDetails) {
          localStorage.setItem('userDetails', userDetails);
        }
      }
      
      return {
        localToken,
        sessionToken,
        isSynced: (!localToken && !sessionToken) || (localToken === sessionToken)
      };
    },
    
    // Continuous session sync (run every minute)
    startSessionSync() {
      // Clear any existing interval
      if (this.sessionSyncInterval) {
        clearInterval(this.sessionSyncInterval);
      }
      
      // Setup new interval - check every minute
      this.sessionSyncInterval = setInterval(() => {
        if (this.isAuthenticated) {
          this.syncStorages();
        }
      }, 60 * 1000); // 1 minute
    },
    
    // Start periodic session checks
    startSessionCheck() {
      // Clear any existing interval first
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
      }
      
      // Start new interval - check every 3 minutes (was 5 minutes)
      this.sessionCheckInterval = setInterval(async () => {
        try {
          // Only proceed if we think we're authenticated
          if (this.isAuthenticated) {
            // First, sync storages to ensure we have consistent state
            this.syncStorages();
            
            // Check from both storages
            const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
            const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
            
            // If either storage thinks we're authenticated, validate the token
            if (isAuthLocal || isAuthSession) {
              const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
              
              if (token) {
                // Try to validate token with backend
                const isValid = await validateToken();
                
                if (!isValid) {
                  console.warn('Token validation failed during session check');
                  await this.handleInvalidSession();
                } else {
                  console.log('Token validation successful, session is active');
                  // Make sure both storages are in sync
                  this.syncStorages();
                }
              } else {
                console.warn('Session marked as authenticated but no token found');
                await this.handleInvalidSession();
              }
            } else {
              // If both storages say we're not authenticated, update our state
              if (!isAuthLocal && !isAuthSession) {
                console.log('No active session found in either storage');
                this.isAuthenticated = false;
                this.user = null;
              }
            }
          }
        } catch (error) {
          console.error('Error during session check:', error);
        }
      }, 3 * 60 * 1000); // 3 minutes
    },
    
    // Setup tracking for user activity to prevent idle timeouts
    setupActivityTracking() {
      // Clear any existing timeout/listeners
      if (this.idleTimeout) {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = null;
      }
      
      // Only setup if authenticated
      if (!this.isAuthenticated) return;
      
      // Track user activity events
      const trackActivity = () => {
        this.lastActivity = Date.now();
      };
      
      // Add event listeners for user activity
      window.addEventListener('mousemove', trackActivity);
      window.addEventListener('mousedown', trackActivity);
      window.addEventListener('keypress', trackActivity);
      window.addEventListener('DOMMouseScroll', trackActivity);
      window.addEventListener('mousewheel', trackActivity);
      window.addEventListener('touchmove', trackActivity);
      window.addEventListener('touchstart', trackActivity);
      window.addEventListener('scroll', trackActivity);
      
      // Setup idle timeout check - after 30 minutes of inactivity
      const checkIdleStatus = () => {
        const now = Date.now();
        const idleTime = now - this.lastActivity;
        
        // If user has been idle for more than 30 minutes
        if (idleTime > 30 * 60 * 1000) {
          console.log('User idle for 30 minutes, validating session');
          // Validate token to make sure session is still active
          validateToken().catch(() => {
            console.warn('Session validation failed after idle period');
            this.handleInvalidSession();
          });
        }
        
        // Continue checking every 5 minutes if we're still authenticated
        if (this.isAuthenticated) {
          this.idleTimeout = setTimeout(checkIdleStatus, 5 * 60 * 1000);
        }
      };
      
      // Start the idle check
      this.idleTimeout = setTimeout(checkIdleStatus, 5 * 60 * 1000);
    },
    
    // Handle case when session becomes invalid
    async handleInvalidSession() {
      console.log('Handling invalid session...');
      
      // Try to recover session first
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
          // Try one more backend validation
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/check-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          
          const result = await response.json();
          if (result.success && result.data.valid) {
            // Session is actually valid, refresh our state
            console.log('Session recovered after secondary validation');
            
            // Update token expiry if provided
            if (result.data.expiresAt) {
              const expiryTime = new Date(result.data.expiresAt).getTime();
              localStorage.setItem('expiresAt', expiryTime.toString());
              sessionStorage.setItem('expiresAt', expiryTime.toString());
              console.log('Updated token expiry time:', new Date(expiryTime).toISOString());
            }
            
            // Make sure both storages are synced
            this.syncStorages();
            return true;
          }
        }
      } catch (error) {
        console.error('Error during session recovery attempt:', error);
      }
      
      // If recovery failed, logout
      console.log('Session recovery failed, logging out');
      this.isAuthenticated = false;
      this.user = null;
      await this.logout(true);
      return false;
    },
    
    // Stop session check
    stopSessionCheck() {
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }
      
      if (this.idleTimeout) {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = null;
      }
      
      if (this.sessionSyncInterval) {
        clearInterval(this.sessionSyncInterval);
        this.sessionSyncInterval = null;
      }
    },
    
    // Update last activity timestamp
    updateActivity() {
      this.lastActivity = Date.now();
    },
    
    // Fetch user profile from API
    async fetchUserProfile() {
      try {
        console.log('Fetching user profile from API');
        
        // Make sure we have a valid token before making the request
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          console.warn('No token available when fetching user profile');
          return false;
        }
        
        const response = await getProfile();
        if (response.success && response.data) {
          this.user = response.data;
          
          // Save to both localStorage and sessionStorage for consistency
          localStorage.setItem('userDetails', JSON.stringify(response.data));
          sessionStorage.setItem('userDetails', JSON.stringify(response.data));
          
          console.log('User profile fetched successfully');
          return true;
        }
        
        // If API succeeds but doesn't have data, try to use existing data
        const userStr = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails');
        if (userStr) {
          try {
            this.user = JSON.parse(userStr);
            console.log('Using existing user data from storage');
            return true;
          } catch (e) {
            console.error('Error parsing existing user data:', e);
          }
        }
        
        return false;
      } catch (error) {
        // Check if this is an authentication error
        if (error.response?.status === 401) {
          console.error('Authentication error when fetching profile - user likely not logged in');
          this.isAuthenticated = false;
          this.user = null;
          clearAllAuthData();
          
          // Redirect to login if we're not already there
          if (!window.location.pathname.includes('/auth/login')) {
            console.log('Redirecting to login page after 401 in profile fetch');
            window.location.href = '/auth/login?session=expired';
          }
          
          return false;
        }
        
        console.error('Error fetching user profile:', error);
        
        // If API fails, try to use existing data as fallback
        const userStr = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails');
        if (userStr) {
          try {
            this.user = JSON.parse(userStr);
            console.log('Using existing user data as fallback after API error');
            return true;
          } catch (e) {
            console.error('Error parsing existing user data:', e);
          }
        }
        
        return false;
      }
    },
    
    // Login
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        // Clear any existing auth data first
        clearAllAuthData();
        
        const result = await login(
          credentials.email,
          credentials.password,
          credentials.rememberMe
        );
        
        if (result.success) {
          // Update auth state in our store
          this.isAuthenticated = true;
          
          // Store user data if included in the response
          if (result.user) {
            this.user = result.user;
            console.log('Login successful - user data saved to auth store:', result.user);
            console.log('User role:', result.user.role);
            console.log('Is admin?', result.user.role === 'ADMIN');
          } else {
            // Get user profile after successful login
            await this.fetchUserProfile();
            console.log('Fetched user profile after login:', this.user);
          }
          
          // Start session checks
          this.startSessionCheck();
          
          return { success: true, user: this.user };
        } else {
          this.error = result.message || 'Login failed';
          return { success: false, message: this.error };
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        this.error = errorMessage;
        console.error('Login error:', error);
        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },
    
    // Logout
    async logout(redirectToLogin = true) {
      console.log('COMPLETE LOGOUT STARTED - clearing all data immediately');
      
      // IMMEDIATE ACTIONS - Do these synchronously before anything else
      // 1. Reset store state first
      this.isAuthenticated = false;
      this.user = null;
      this.loading = false;
      
      // 2. Stop all timers and checks immediately
      this.stopSessionCheck();
      
      // 3. Mark logout in progress to prevent race conditions
      sessionStorage.setItem('_recent_logout', Date.now().toString());
      localStorage.setItem('_recent_logout', Date.now().toString());
      
      // 4. Dispatch logout event immediately
      try {
        document.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { manual: true, time: Date.now() }
        }));
      } catch (e) {
        console.error('Error dispatching logout event:', e);
      }
      
      // 5. Force clear auth data SYNCHRONOUSLY before any async operations
      clearAllAuthData({
        notifyOtherTabs: true,
        forceClean: true
      });
      
      // 6. Double-check critical fields are cleared
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userDetails');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('userDetails');
      
      console.log('Auth data cleared - now checking if anything remains...');
      
      // Check if anything remains
      const remainingLocalKeys = Object.keys(localStorage).filter(key => 
        key.includes('auth') || key.includes('token') || key.includes('user') || 
        key.includes('profile') || key.includes('order')
      );
      
      if (remainingLocalKeys.length > 0) {
        console.warn('Found remaining localStorage keys after logout:', remainingLocalKeys);
        // Force remove them
        remainingLocalKeys.forEach(key => localStorage.removeItem(key));
      }
      
      const remainingSessionKeys = Object.keys(sessionStorage).filter(key => 
        key.includes('auth') || key.includes('token') || key.includes('user') || 
        key.includes('profile') || key.includes('order')
      );
      
      if (remainingSessionKeys.length > 0) {
        console.warn('Found remaining sessionStorage keys after logout:', remainingSessionKeys);
        // Force remove them
        remainingSessionKeys.forEach(key => sessionStorage.removeItem(key));
      }
      
      // AFTER clearing all data, try to call the API logout (but don't wait for it)
      try {
        // Get token before clearing (if available)
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        // API call in background without waiting
        if (token) {
          console.log('Attempting API logout call (but not waiting for it)');
          authApi.post('/auth/logout', { token }).catch(err => {
            console.log('API logout call failed, but user is already logged out locally:', err);
          });
        }
      } catch (e) {
        console.error('Error in API logout attempt:', e);
      }
      
      // Redirect if needed (don't wait for the API call)
      if (redirectToLogin) {
        console.log('Redirecting to login page');
        router.push('/auth/login');
      }
      
      // Final verification after a short delay
      setTimeout(() => {
        if (localStorage.getItem('authToken') || sessionStorage.getItem('authToken') ||
            localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true') {
          console.error('CRITICAL: Auth data still persists after logout! Forcing direct removal.');
          
          ['authToken', 'isAuthenticated', 'userDetails', 'expiresAt', 'tokenExpiresAt'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
          });
        } else {
          console.log('Verification complete: all auth data successfully cleared');
        }
      }, 500);
      
      return { success: true };
    },
    
    // Check if user has a specific permission
    hasPermission(permission) {
      // Implement permission check logic here
      return this.isAdmin; // Default to admin check for now
    },
    
    // Check if user has a specific role
    hasRole(role) {
      return this.user?.role === role;
    },
    
    // Register
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        // Clear any existing auth data first
        clearAllAuthData();
        
        // Using register from the auth API
        const result = await authApi.post('/auth/register', userData).then(response => response.data);
        
        if (result.success) {
          // For now, with our implementation, we're not auto-logging in after registration
          // Just return success
          return { success: true, message: result.message || 'Đăng ký thành công', data: result.data };
        } else {
          this.error = result.message || 'Đăng ký thất bại';
          return { success: false, message: this.error };
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
        this.error = errorMessage;
        console.error('Registration error:', error);
        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },
    
    // Send OTP for email verification
    async sendOtp(email) {
      this.loading = true;
      this.error = null;
      
      try {
        const result = await sendOtp(email);
        return result;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Lỗi khi gửi mã OTP';
        this.error = errorMessage;
        console.error('OTP send error:', error);
        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },
    
    // Verify OTP
    async verifyOtp(email, otp) {
      this.loading = true;
      this.error = null;
      
      try {
        const result = await verifyOtp(email, otp);
        return result;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Lỗi khi xác thực mã OTP';
        this.error = errorMessage;
        console.error('OTP verification error:', error);
        return { success: false, message: errorMessage };
      } finally {
        this.loading = false;
      }
    },
    
    // Clean up on app destroy
    cleanup() {
      this.stopSessionCheck();
    }
  }
})
  
// Đảm bảo xóa các event listener khi app unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const store = useAuthStore()
    if (store && store.cleanup) {
      store.cleanup()
    }
  })
} 