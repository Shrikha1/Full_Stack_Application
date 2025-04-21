import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/axios';

export interface Account {
  Id: string;
  Name: string;
  Industry?: string;
  Type?: string;
  AnnualRevenue?: number;
  BillingCity?: string;
  BillingCountry?: string;
  CreatedDate: string;
  LastModifiedDate: string;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AccountsResponse {
  data: Account[];
  pagination: Pagination;
}

export const useSalesforceStore = defineStore('salesforce', () => {
  const accounts = ref<Account[]>([]);
  const currentAccount = ref<Account | null>(null);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAccounts(page = 1, pageSize = 10) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<AccountsResponse>('/api/salesforce/accounts', {
        params: { page, pageSize }
      });
      accounts.value = res.data.data;
      pagination.value = res.data.pagination;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch accounts';
    } finally {
      loading.value = false;
    }
  }

  async function fetchAccountById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<Account>(`/api/salesforce/accounts/${id}`);
      currentAccount.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch account';
      currentAccount.value = null;
    } finally {
      loading.value = false;
    }
  }

  function clearCurrentAccount() {
    currentAccount.value = null;
  }

  return {
    accounts,
    currentAccount,
    pagination,
    loading,
    error,
    fetchAccounts,
    fetchAccountById,
    clearCurrentAccount,
  };
});