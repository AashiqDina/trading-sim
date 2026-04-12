import { PortfolioStock, StockHistoryEntry } from "../../types/types"


const mockStockHistoryEntry: StockHistoryEntry[] = Array.from({ length: 20}, (_, i) => ({
    timestamp: `${1680000000 + i * 3600}`,
    price: 100 + i,
    quantity: 5 + i
}))



export const mockPortfolioStocks: PortfolioStock[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    symbol: `symbol_${i}`,
    name: `name_${i}`,
    logo: `logo_${i}`,
    purchasePrice: 100 - i,
    currentPrice: 100 + i,
    quantity: 5 + i,
    totalValue: (100 + i) * (5 + i),
    profitLoss: ((100 + i) - (100 - i)) * (5+i),
    portfolioId: i,
    history: mockStockHistoryEntry
}));