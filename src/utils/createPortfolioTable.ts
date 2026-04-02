import { PortfolioStock } from "../types/types";

export function createPortfolioTables(stocks: PortfolioStock[]) {
  const map = new Map();

  for (let i = 0; i < stocks.length; i++) {
    const s = stocks[i];

    if (map.has(s.symbol)) {
      const stock = map.get(s.symbol);
      stock.totalShares += s.quantity;
      stock.totalCost += s.quantity * s.purchasePrice;
      stock.currentWorth += s.quantity * s.currentPrice;
      stock.transactions.push(s);
    } else {
      map.set(s.symbol, {
        symbol: s.symbol,
        name: s.name,
        logo: s.logo,
        totalShares: s.quantity,
        totalCost: s.quantity * s.purchasePrice,
        currentWorth: s.quantity * s.currentPrice,
        transactions: [s],
      });
    }
  }

  return Array.from(map.values()).map(stock => ({
    ...stock,
    avgBuyPrice: stock.totalCost / stock.totalShares,
    profitPercent: (stock.currentWorth / stock.totalCost - 1) * 100
  }));
}