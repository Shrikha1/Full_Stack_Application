import { SalesforceConnectionPool } from '../utils/SalesforceConnectionPool';
import { AppError } from '../utils/error';
import logger from '../utils/logger';

/**
 * Represents a Salesforce Account.
 */
export interface Account {
  /**
   * Unique identifier for the Account.
   */
  Id: string;
  /**
   * Name of the Account.
   */
  Name: string;
  /**
   * Industry of the Account.
   */
  Industry?: string;
  /**
   * Type of the Account.
   */
  Type?: string;
  /**
   * Annual revenue of the Account.
   */
  AnnualRevenue?: number;
  /**
   * Billing city of the Account.
   */
  BillingCity?: string;
  /**
   * Billing country of the Account.
   */
  BillingCountry?: string;
  /**
   * Date the Account was created.
   */
  CreatedDate: string;
  /**
   * Date the Account was last modified.
   */
  LastModifiedDate: string;
}

/**
 * Represents pagination parameters.
 */
export interface PaginationParams {
  /**
   * Current page number.
   */
  page: number;
  /**
   * Number of records per page.
   */
  pageSize: number;
}

/**
 * Represents a paginated response.
 */
export interface PaginatedResponse<T> {
  /**
   * Array of records.
   */
  data: T[];
  /**
   * Pagination metadata.
   */
  pagination: {
    /**
     * Total number of records.
     */
    total: number;
    /**
     * Current page number.
     */
    page: number;
    /**
     * Number of records per page.
     */
    pageSize: number;
    /**
     * Total number of pages.
     */
    totalPages: number;
  };
}

/**
 * SalesforceService encapsulates all jsforce logic and ensures
 * that no sensitive Salesforce credentials or stack traces leak to the client.
 */
export class SalesforceService {
  private connectionPool: SalesforceConnectionPool;

  /**
   * Initializes a new instance of the SalesforceService class.
   */
  constructor() {
    this.connectionPool = new SalesforceConnectionPool({
      clientId: process.env.SF_CLIENT_ID || '',
      clientSecret: process.env.SF_CLIENT_SECRET || '',
      username: process.env.SF_USERNAME || '',
      password: process.env.SF_PASSWORD || '',
      securityToken: process.env.SF_SECURITY_TOKEN || '',
      loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
    });
  }

  /**
   * Fetches paginated Salesforce Accounts.
   * @param params Pagination parameters
   */
  async getAccounts(params: PaginationParams): Promise<PaginatedResponse<Account>> {
    try {
      const connection = await this.connectionPool.getConnection();
      // Calculate offset for pagination
      const offset = (params.page - 1) * params.pageSize;
      // Get total count
      const countResult = await connection.query<{ totalSize: number }>(
        'SELECT COUNT() FROM Account'
      );
      const total = countResult.totalSize;
      // Get paginated accounts
      const result = await connection.query<Account>(
        `SELECT Id, Name, Industry, Type, AnnualRevenue, BillingCity, BillingCountry, \
         CreatedDate, LastModifiedDate \
         FROM Account \
         ORDER BY LastModifiedDate DESC \
         LIMIT ${params.pageSize} \
         OFFSET ${offset}`
      );
      return {
        data: result.records,
        pagination: {
          total,
          page: params.page,
          pageSize: params.pageSize,
          totalPages: Math.ceil(total / params.pageSize)
        }
      };
    } catch (error) {
      logger.error('Error fetching Salesforce accounts', { message: (error as Error).message });
      throw new AppError(500, 'Error fetching Salesforce accounts', true, { code: 'SF_QUERY_ERROR' });
    }
  }

  /**
   * Fetches a Salesforce Account by ID.
   * @param id Salesforce Account Id
   */
  async getAccountById(id: string): Promise<Account> {
    try {
      // Basic Salesforce ID format validation
      if (!/^[a-zA-Z0-9]{15,18}$/.test(id)) {
        throw new AppError(400, 'Invalid Account ID format', true, { code: 'INVALID_ACCOUNT_ID' });
      }
      const connection = await this.connectionPool.getConnection();
      // Use parameterized query if supported, otherwise safely interpolate
      const result = await connection.query<Account>(
        `SELECT Id, Name, Industry, Type, AnnualRevenue, BillingCity, BillingCountry, \
         CreatedDate, LastModifiedDate \
         FROM Account \
         WHERE Id = '${id.replace(/'/g, '')}'`
      );
      if (!result.records || result.records.length === 0) {
        throw new AppError(404, 'Account not found', true, { code: 'ACCOUNT_NOT_FOUND' });
      }
      return result.records[0];
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error fetching Salesforce account', { message: (error as Error).message });
      throw new AppError(500, 'Error fetching Salesforce account', true, { code: 'SF_QUERY_ERROR' });
    }
  }
}