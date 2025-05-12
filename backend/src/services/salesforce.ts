import jsforce from 'jsforce';
import { logger } from '../utils/logger';

export interface SalesforceAccount {
  Id: string;
  Name: string;
  AccountNumber?: string;
  Type?: string;
  Industry?: string;
  Rating?: string;
  Phone?: string;
  Website?: string;
  AnnualRevenue?: number;
  NumberOfEmployees?: number;
  BillingStreet?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingPostalCode?: string;
  BillingCountry?: string;
}

export class SalesforceService {
  private connection: jsforce.Connection;
  private isConnected: boolean = false;

  constructor() {
    this.connection = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
    });
  }

  async login(): Promise<void> {
    try {
      if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
        throw new Error('Salesforce credentials are not configured');
      }

      await this.connection.login(process.env.SALESFORCE_USERNAME!, process.env.SALESFORCE_PASSWORD! + process.env.SALESFORCE_TOKEN);
      this.isConnected = true;
      logger.info('Connected to Salesforce successfully');
    } catch (error) {
      logger.error('Failed to connect to Salesforce', { error });
      throw error;
    }
  }

  async getAccounts(limit: number = 100, offset: number = 0): Promise<{ records: SalesforceAccount[]; totalSize: number }> {
    try {
      if (!this.isConnected) {
        await this.login();
      }

      const query = `
        SELECT Id, Name, AccountNumber, Type, Industry, Rating, Phone, Website,
               AnnualRevenue, NumberOfEmployees, BillingStreet, BillingCity,
               BillingState, BillingPostalCode, BillingCountry
        FROM Account
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      const result = await this.connection.query<SalesforceAccount>(query);
      return {
        records: result.records,
        totalSize: result.totalSize
      };
    } catch (error) {
      logger.error('Failed to fetch accounts from Salesforce', { error });
      throw error;
    }
  }

  async getAccountById(id: string): Promise<SalesforceAccount | null> {
    try {
      if (!this.isConnected) {
        await this.login();
      }

      const query = `
        SELECT Id, Name, AccountNumber, Type, Industry, Rating, Phone, Website,
               AnnualRevenue, NumberOfEmployees, BillingStreet, BillingCity,
               BillingState, BillingPostalCode, BillingCountry
        FROM Account
        WHERE Id = '${id}'
      `;

      const result = await this.connection.query<SalesforceAccount>(query);
      return result.records[0] || null;
    } catch (error) {
      logger.error('Failed to fetch account from Salesforce', { error, id });
      throw error;
    }
  }
}

export const salesforceService = new SalesforceService();
