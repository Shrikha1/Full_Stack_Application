import { Request, Response } from 'express';
import jsforce from 'jsforce';

// Helper: get Salesforce connection from env
function getSalesforceConnection() {
  return new jsforce.Connection({
    oauth2: {
      clientId: process.env.SF_CLIENT_ID!,
      clientSecret: process.env.SF_CLIENT_SECRET!,
      redirectUri: process.env.SF_REDIRECT_URI || 'http://localhost:3000/oauth2/callback',
    },
    // Optionally, you can use accessToken/refreshToken from DB for per-user integration
  });
}

export const salesforceController = {
  async getAccounts(_req: Request, res: Response) {
    try {
      const conn = getSalesforceConnection();
      await conn.login(process.env.SF_USERNAME!, process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN!);
      const result = await conn.sobject('Account')
        .find({}, { Id: 1, Name: 1, Industry: 1, Type: 1 })
        .limit(50)
        .execute();
      res.status(200).json({ accounts: result });
    } catch (error) {
      // Never expose secrets or stack traces
      res.status(500).json({ message: 'Failed to fetch Salesforce accounts', code: 'SALESFORCE_ERROR' });
    }
  },
};