<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>Salesforce Accounts</h2>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
    <div v-if="loading" class="loading">Loading accounts...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <table v-if="accounts.length" class="accounts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Industry</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in paginatedAccounts" :key="account.Id">
            <td>{{ account.Id }}</td>
            <td>{{ account.Name }}</td>
            <td>{{ account.Industry }}</td>
            <td>{{ account.Type }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty">No accounts found.</div>
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="page === 1">Prev</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../services/axios';
import { useAuthStore } from '../stores/auth';

const accounts = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const page = ref(1);
const pageSize = 10;

const totalPages = computed(() => Math.ceil(accounts.value.length / pageSize));
const paginatedAccounts = computed(() => {
  const start = (page.value - 1) * pageSize;
  return accounts.value.slice(start, start + pageSize);
});

function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

async function fetchAccounts() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('/salesforce/accounts');
    accounts.value = res.data.accounts || [];
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch accounts.';
  } finally {
    loading.value = false;
  }
}

const auth = useAuthStore();
function logout() {
  auth.logout();
}

onMounted(fetchAccounts);
</script>

<style scoped>
.dashboard-container {
  max-width: 900px;
  margin: 2.5rem auto;
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.logout-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #b71c1c;
}
h2 {
  color: #0062e0;
  font-weight: 600;
  margin: 0;
}
.loading {
  text-align: center;
  font-size: 1.15rem;
  color: #888;
}
.error {
  color: #d32f2f;
  text-align: center;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}
.accounts-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.2rem;
}
.accounts-table th,
.accounts-table td {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.accounts-table th {
  background: #f5f8fa;
  font-weight: 500;
}
.empty {
  text-align: center;
  color: #888;
  font-size: 1.07rem;
  margin: 1.5rem 0;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1rem;
}
.pagination button {
  background: #0062e0;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.pagination button:disabled {
  background: #b3c6e0;
  cursor: not-allowed;
}
</style>