export const createRecentHistoryMocks = () => {
  const now = new Date();

  return [
    {
      stockId: 1,
      symbol: "AAPL",
      history: [{
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // within week
          price: 100,
          quantity: 1,
        },
        {
          timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // outside week
          price: 110,
          quantity: 1,
      }]
    }
  ]
}