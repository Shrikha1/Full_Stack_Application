<template>
  <div class="account-list">
    <div v-if="loading" class="loading">Loading accounts...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="table-container">
        <table class="account-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>Type</th>
              <th>Annual Revenue</th>
              <th>Location</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in accounts" :key="account.Id" @click="viewAccount(account.Id)">
              <td>{{ account.Name }}</td>
              <td>{{ account.Industry || '-' }}</td>
              <td>{{ account.Type || '-' }}</td>
              <td>{{ formatCurrency(account.AnnualRevenue) }}</td>
              <td>{{ formatLocation(account) }}</td>
              <td>{{ formatDate(account.LastModifiedDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button 
          :disabled="pagination.page === 1" 
          @click="changePage(pagination.page - 1)"
        >
          Previous
        </button>
        <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
        <button 
          :disabled="pagination.page === pagination.totalPages" 
          @click="changePage(pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSalesforceStore } from '@/stores/salesforce';
import { storeToRefs } from 'pinia';

const router = useRouter();
const salesforceStore = useSalesforceStore();
const { accounts, pagination, loading, error } = storeToRefs(salesforceStore);

const formatCurrency = (value?: number) => {
  if (!value) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const formatLocation = (account: any) => {
  const parts = [];
  if (account.BillingCity) parts.push(account.BillingCity);
  if (account.BillingCountry) parts.push(account.BillingCountry);
  return parts.length ? parts.join(', ') : '-';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const changePage = (page: number) => {
  salesforceStore.fetchAccounts(page, pagination.value.pageSize);
};

const viewAccount = (id: string) => {
  router.push(`/accounts/${id}`);
};

onMounted(() => {
  salesforceStore.fetchAccounts();
});
</script>

<style scoped>
.account-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.account-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.account-table th,
.account-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.account-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.account-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.account-table tbody tr:hover {
  background-color: #f8f9fa;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background: #f8f9fa;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
}
</style> 