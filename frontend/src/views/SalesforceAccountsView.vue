<template>
  <div>
    <h2>Salesforce Accounts</h2>
    <SalesforceAccountsTable
      :accounts="salesforce.accounts"
      :pagination="salesforce.pagination"
      :loading="salesforce.loading"
      :error="salesforce.error"
      @page="handlePage"
      @pageSize="handlePageSize"
    />
  </div>
</template>

<script setup lang="ts">
import { useSalesforceStore } from '../stores/salesforce';
import SalesforceAccountsTable from '../components/SalesforceAccountsTable.vue';
import { onMounted } from 'vue';

const salesforce = useSalesforceStore();

onMounted(() => {
  salesforce.fetchAccounts();
});

function handlePage(page: number) {
  salesforce.fetchAccounts(page, salesforce.pagination.pageSize);
}

function handlePageSize(size: number) {
  salesforce.fetchAccounts(1, size);
}
</script>
