import api from './axios';

export interface SalesforceAccount {
  Id: string;
  Name: string;
  Type: string;
  Industry: string;
  BillingCity: string;
  BillingState: string;
  BillingCountry: string;
  Phone: string;
  Website: string;
  AnnualRevenue: number;
  NumberOfEmployees: number;
}

export interface PaginatedResponse {
  accounts: SalesforceAccount[];
  total: number;
  page: number;
  pageSize: number;
}

class SalesforceService {
  async getAccounts(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse> {
    try {
      const response = await api.get('/api/salesforce/accounts', {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  async getAccountById(id: string): Promise<SalesforceAccount> {
    try {
      const response = await api.get(`/api/salesforce/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }
}

export default new SalesforceService();