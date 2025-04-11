<template>
  <div class="auth-tester-container">
    <h2>Authentication Tester</h2>
    
    <div class="actions">
      <div class="action-box">
        <h3>Clear Tokens</h3>
        <button @click="clearTokens" class="action-button">Clear All Tokens</button>
        <div v-if="clearResult" class="result">
          <pre>{{ JSON.stringify(clearResult, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="action-box">
        <h3>Login Test</h3>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="email" type="email" placeholder="Email" />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input v-model="password" type="password" placeholder="Password" />
        </div>
        <div class="form-group">
          <label>
            <input v-model="rememberMe" type="checkbox" />
            Remember Me
          </label>
        </div>
        <button @click="testLogin" class="action-button">Test Login</button>
        <div v-if="loginResult" class="result">
          <h4>Login Result:</h4>
          <pre>{{ JSON.stringify(loginResult, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="action-box">
        <h3>Token Check</h3>
        <button @click="checkTokens" class="action-button">Check Current Tokens</button>
        <div v-if="tokenCheck" class="result">
          <h4>Token Check Result:</h4>
          <pre>{{ JSON.stringify(tokenCheck, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="action-box">
        <h3>Logout Test</h3>
        <button @click="testLogout" class="action-button">Test Logout</button>
        <div v-if="logoutResult" class="result">
          <h4>Logout Result:</h4>
          <pre>{{ JSON.stringify(logoutResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <div class="auth-status">
      <h3>Current Auth Status</h3>
      <div v-if="isLoading" class="loading">Loading...</div>
      <div v-else class="status-info">
        <div class="status-item">
          <span class="label">Authenticated:</span>
          <span :class="{'value': true, 'positive': isAuthenticated, 'negative': !isAuthenticated}">
            {{ isAuthenticated ? 'Yes' : 'No' }}
          </span>
        </div>
        <div class="status-item">
          <span class="label">User:</span>
          <span class="value">{{ user ? `${user.name} (${user.email})` : 'Not logged in' }}</span>
        </div>
        <div class="status-item">
          <span class="label">Role:</span>
          <span class="value">{{ user?.role || 'N/A' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { clearAllAuthData } from '@/utils/clearAuth';
import { testLogin, testLogout } from '@/utils/authTest';
import { validateToken } from '@/api/auth.service';

export default {
  name: 'AuthTester',
  
  setup() {
    const authStore = useAuthStore();
    const isLoading = ref(false);
    
    // Form fields
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    
    // Results
    const clearResult = ref(null);
    const loginResult = ref(null);
    const tokenCheck = ref(null);
    const logoutResult = ref(null);
    
    // Computed properties
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const user = computed(() => authStore.user);
    
    // Clear all tokens
    const clearTokens = () => {
      clearAllAuthData();
      
      // Check what's left after clearing
      clearResult.value = {
        localStorage: {
          authToken: localStorage.getItem('authToken'),
          isAuthenticated: localStorage.getItem('isAuthenticated'),
          userDetails: localStorage.getItem('userDetails')
        },
        sessionStorage: {
          authToken: sessionStorage.getItem('authToken'),
          isAuthenticated: sessionStorage.getItem('isAuthenticated'),
          userDetails: sessionStorage.getItem('userDetails')
        },
        allCleared: !localStorage.getItem('authToken') && 
                  !localStorage.getItem('isAuthenticated') && 
                  !sessionStorage.getItem('authToken') && 
                  !sessionStorage.getItem('isAuthenticated')
      };
    };
    
    // Test login
    const doTestLogin = async () => {
      isLoading.value = true;
      try {
        loginResult.value = await testLogin(email.value, password.value, rememberMe.value);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Check current tokens
    const checkTokens = async () => {
      isLoading.value = true;
      try {
        const localToken = localStorage.getItem('authToken');
        const sessionToken = sessionStorage.getItem('authToken');
        const isValid = localToken ? await validateToken() : false;
        
        tokenCheck.value = {
          localStorage: {
            authToken: localToken,
            isAuthenticated: localStorage.getItem('isAuthenticated'),
            userDetails: localStorage.getItem('userDetails') ? '(exists)' : null,
            expiresAt: localStorage.getItem('expiresAt')
          },
          sessionStorage: {
            authToken: sessionToken,
            isAuthenticated: sessionStorage.getItem('isAuthenticated'),
            userDetails: sessionStorage.getItem('userDetails') ? '(exists)' : null,
            expiresAt: sessionStorage.getItem('expiresAt')
          },
          tokensMatch: localToken === sessionToken,
          isValid
        };
      } finally {
        isLoading.value = false;
      }
    };
    
    // Test logout
    const doTestLogout = async () => {
      isLoading.value = true;
      try {
        logoutResult.value = await testLogout();
      } finally {
        isLoading.value = false;
      }
    };
    
    // Check tokens on mount
    onMounted(() => {
      checkTokens();
    });
    
    return {
      email,
      password,
      rememberMe,
      clearResult,
      loginResult,
      tokenCheck,
      logoutResult,
      isLoading,
      isAuthenticated,
      user,
      clearTokens,
      testLogin: doTestLogin,
      checkTokens,
      testLogout: doTestLogout
    };
  }
}
</script>

<style scoped>
.auth-tester-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.action-box {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: #f9f9f9;
}

.action-box h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #444;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.action-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.action-button:hover {
  background-color: #45a049;
}

.result {
  margin-top: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  max-height: 200px;
  overflow-y: auto;
}

.result pre {
  margin: 0;
  white-space: pre-wrap;
  font-size: 12px;
}

.auth-status {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: #f5f5f5;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-item {
  display: flex;
}

.label {
  font-weight: bold;
  width: 120px;
}

.value {
  flex: 1;
}

.positive {
  color: #4CAF50;
  font-weight: bold;
}

.negative {
  color: #f44336;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}
</style> 