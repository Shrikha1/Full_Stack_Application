<template>
  <div class="salesforce-accounts-table">
    <div v-if="loading" class="table-loading">
      <slot name="loading">
        <span>Loading...</span>
      </slot>
    </div>
    <div v-else>
      <div v-if="error" class="table-error">
        <slot name="error">{{ error }}</slot>
      </div>
      <table v-else class="accounts-table">
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Industry</th>
            <th>Type</th>
            <th>Annual Revenue</th>
            <th>Billing City</th>
            <th>Billing Country</th>
            <th>Created</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.Id">
            <td>{{ account.Name }}</td>
            <td>{{ account.Industry || '-' }}</td>
            <td>{{ account.Type || '-' }}</td>
            <td>{{ account.AnnualRevenue?.toLocaleString() || '-' }}</td>
            <td>{{ account.BillingCity || '-' }}</td>
            <td>{{ account.BillingCountry || '-' }}</td>
            <td>{{ formatDate(account.CreatedDate) }}</td>
            <td>{{ formatDate(account.LastModifiedDate) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-controls">
        <button :disabled="pagination.page === 1 || loading" @click="$emit('page', pagination.page - 1)">Prev</button>
        <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
        <button :disabled="pagination.page === pagination.totalPages || loading" @click="$emit('page', pagination.page + 1)">Next</button>
        <select :disabled="loading" v-model.number="pageSize" @change="onPageSizeChange">
          <option v-for="size in [5, 10, 20, 50]" :key="size" :value="size">{{ size }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Account, Pagination } from '../stores/salesforce';

const props = defineProps<{
  accounts: Account[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: 'page', page: number): void;
  (e: 'pageSize', size: number): void;
}>();

const pageSize = ref(props.pagination.pageSize);

watch(() => props.pagination.pageSize, (newSize) => {
  pageSize.value = newSize;
});

function onPageSizeChange() {
  emit('pageSize', pageSize.value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
.salesforce-accounts-table {
  width: 100%;
  margin: 0 auto;
}
.accounts-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.accounts-table th, .accounts-table td {
  border: 1px solid #e0e0e0;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
.table-loading, .table-error {
  padding: 1rem;
  text-align: center;
  color: #888;
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
