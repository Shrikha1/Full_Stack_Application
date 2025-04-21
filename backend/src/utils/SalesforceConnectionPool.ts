import { Connection } from 'jsforce'
import { SalesforceError } from './SalesforceError'

interface ConnectionConfig {
  clientId: string
  clientSecret: string
  username: string
  password: string
  securityToken: string
  loginUrl: string
}

export class SalesforceConnectionPool {
  private pool: Connection[] = []
  private maxConnections: number
  private connectionTimeout: number
  private config: ConnectionConfig
  private isInitialized = false

  constructor(
    config: ConnectionConfig,
    maxConnections = 5,
    connectionTimeout = 30000
  ) {
    this.config = config
    this.maxConnections = maxConnections
    this.connectionTimeout = connectionTimeout
  }

  private async createConnection(): Promise<Connection> {
    try {
      const connection = new Connection({
        oauth2: {
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
          loginUrl: this.config.loginUrl
        },
        maxRequest: 10,
        version: '56.0'
      })

      await connection.login(
        this.config.username,
        this.config.password + this.config.securityToken
      )

      return connection
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Create initial connections
      const connectionPromises = Array(this.maxConnections)
        .fill(null)
        .map(() => this.createConnection())

      this.pool = await Promise.all(connectionPromises)
      this.isInitialized = true
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  async getConnection(): Promise<Connection> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.pool.length > 0) {
      return this.pool.shift()!
    }

    // If no available connection and pool is not full, create a new one
    if (this.pool.length < this.maxConnections) {
      const newConnection = await this.createConnection()
      this.pool.push(newConnection)
      return newConnection
    }

    // Wait for a connection to become available
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new SalesforceError(
            'Connection timeout',
            'CONNECTION_TIMEOUT',
            504
          )
        )
      }, this.connectionTimeout)

      const checkConnection = () => {
        if (this.pool.length > 0) {
          clearTimeout(timeout)
          resolve(this.pool.shift()!)
        } else {
          setTimeout(checkConnection, 100)
        }
      }

      checkConnection()
    })
  }

  async releaseConnection(connection: Connection): Promise<void> {
    // Reset the connection state
    try {
      await connection.logout()
      this.pool.push(connection)
    } catch (error) {
      console.error('Error releasing connection:', error)
    }
  }

  async close(): Promise<void> {
    await Promise.all(
      this.pool.map(connection => this.releaseConnection(connection))
    )
    this.pool = []
    this.isInitialized = false
  }
}