<template>
  <div class="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl w-full mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">Email Verification Testing Tool</h1>
      
      <!-- User Management Section -->
      <div class="bg-white shadow rounded-lg mb-6 overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-xl font-semibold mb-4">Registered Users</h2>
          
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading users...</p>
          </div>
          
          <div v-else-if="users.length === 0" class="text-center py-4 text-gray-500">
            No users found. Try registering a new account.
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" 
                         class="px-2 py-1 text-xs rounded-full">
                      {{ user.verified ? 'Verified' : 'Unverified' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(user.createdAt).toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      v-if="!user.verified"
                      @click="verifyUser(user.email)" 
                      class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      Verify Now
                    </button>
                    <span v-else class="text-gray-500">Already verified</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Manual Verification Section -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-xl font-semibold mb-4">Manual Verification</h2>
          
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="emailToVerify" class="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                v-model="emailToVerify" 
                type="email" 
                id="emailToVerify" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="user@example.com"
              />
            </div>
            
            <div class="flex items-center space-x-4">
              <button 
                @click="verifyUser(emailToVerify)" 
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Verify User
              </button>
              
              <button 
                @click="refreshUsers" 
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                Refresh List
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Status Messages -->
      <div v-if="message" class="mt-6">
        <div :class="{'bg-green-50 border-green-400 text-green-700': success, 'bg-red-50 border-red-400 text-red-700': !success}" 
             class="border-l-4 p-4 rounded">
          {{ message }}
        </div>
      </div>
      
      <div class="mt-6 text-center">
        <router-link to="/login" class="text-blue-600 hover:text-blue-800">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/axios';

// State
const users = ref<any[]>([]);
const loading = ref(false);
const emailToVerify = ref('');
const message = ref('');
const success = ref(false);

// Load users on mount
onMounted(() => {
  refreshUsers();
});

// Refresh user list
async function refreshUsers() {
  loading.value = true;
  message.value = '';
  
  try {
    const response = await api.get('/api/auth/dev/users');
    users.value = response.data.users;
  } catch (error) {
    message.value = 'Error loading users. This feature is only available in development mode.';
    success.value = false;
  } finally {
    loading.value = false;
  }
}

// Verify a user
async function verifyUser(email: string) {
  if (!email) {
    message.value = 'Please enter an email address';
    success.value = false;
    return;
  }
  
  loading.value = true;
  message.value = '';
  
  try {
    const response = await api.get(`/api/auth/dev/verify/${encodeURIComponent(email)}`);
    message.value = response.data.message || 'User verified successfully';
    success.value = true;
    
    // Refresh the user list
    await refreshUsers();
  } catch (error: any) {
    message.value = error.response?.data?.message || 'Error verifying user';
    success.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
