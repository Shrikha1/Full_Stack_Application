// __mocks__/jsforce.js
module.exports = {
  Connection: jest.fn().mockImplementation(() => ({
    query: jest.fn((queryStr) => {
      // Simulate paginated Account results
      if (queryStr.includes('COUNT()')) {
        return Promise.resolve({ totalSize: 2 });
      }
      if (queryStr.includes('FROM Account')) {
        return Promise.resolve({
          records: [
            {
              Id: '0011N00001XyzAbQAL',
              Name: 'Acme Corp',
              Industry: 'Technology',
              Type: 'Customer',
              AnnualRevenue: 1000000,
              BillingCity: 'San Francisco',
              BillingCountry: 'USA',
              CreatedDate: '2021-01-01T00:00:00.000Z',
              LastModifiedDate: '2022-01-01T00:00:00.000Z',
            },
            {
              Id: '0011N00001XyzAcQAL',
              Name: 'Beta Inc',
              Industry: 'Finance',
              Type: 'Prospect',
              AnnualRevenue: 500000,
              BillingCity: 'New York',
              BillingCountry: 'USA',
              CreatedDate: '2021-06-01T00:00:00.000Z',
              LastModifiedDate: '2022-06-01T00:00:00.000Z',
            },
          ],
        });
      }
      return Promise.resolve({ records: [] });
    }),
  })),
};
