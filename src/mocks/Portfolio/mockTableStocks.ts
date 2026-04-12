import { PortfolioTableStock, Transaction, PriceHistoryEntry } from "../../types/types";

const mockHistory: PriceHistoryEntry[] = Array.from({ length: 10 }, (_, j) => ({
    timestamp: `${1680000000 + j * 3600}`,
    price: 10 + j,
    quantity: 1
}));

export const mockTableStocks: PortfolioTableStock[] = Array.from( { length: 3 }, (_, i) => {
    const transactions: Transaction[] = Array.from({ length: i + 1 }, (_, j) => {
        const price = 10 + i + j;
        const quantity = 5;

        return {
            id: i * 10 + j,
            symbol: `symbol_${i}`,
            purchasePrice: price,
            quantity: quantity,
            portfolioId: 1,
            currentPrice: price + 2,
            profitLoss: (price + 2 - price) * quantity,
            totalValue: (price + 2) * quantity,
            history: mockHistory
        }
    })

    const totalCost = transactions.reduce((sum, t) => sum + t.purchasePrice * t.quantity, 0)

    const currentWorth = transactions.reduce((sum, t) => sum + t.currentPrice * t.quantity, 0)

    return {
        symbol: `symbol_${i}`,
        name: `name_${i}`,
        logo: `logo_${i}`,
        avgBuyPrice: totalCost / (transactions.length * 5),
        currentWorth: currentWorth,
        totalCost: totalCost,
        profitPercent: ((currentWorth / totalCost) * 100) - 100,
        totalShares: transactions.length * 5,
        transactions: transactions
    }}
);

export const mockLastUpdatedPortfolioDictionary: Map<string, Date> = new Map([
    ["symbol_0", new Date(Date.now() - 1000 * 60 * 60)], // 1 hour ago
    ["symbol_1", new Date(Date.now() - 1000 * 60 * 5)],  // 5 min ago
    ["symbol_2", new Date()],
]);