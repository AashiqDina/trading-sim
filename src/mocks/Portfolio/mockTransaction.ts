import { Transaction, PriceHistoryEntry } from "../../types/types"

const mockPriceHistoryEntry: PriceHistoryEntry[] = Array.from({ length: 20}, (_, i) => ({
    timestamp: `${1680000000 + i * 3600}`,
    price: 100 + i,
    quantity: 5 + i
}))


export const mockTransactions: Transaction = {
    id: 1,
    symbol: 'symbol_1',
    purchasePrice: 99,
    quantity: 6,
    portfolioId: 1,
    profitLoss: (101 - 99) * 6,
    totalValue: 606,
    currentPrice: 101,
    history: mockPriceHistoryEntry
}