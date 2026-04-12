import { StockHistoryItem } from "../../types/types";

export const mockedFullHistory: StockHistoryItem[] = Array.from({ length: 60}, (_, i) => ({
   stockId: i,
   symbol: `symbol_${i}`, 
   history: Array.from({length: 20}, (_,j) => ({
        timestamp: new Date(1680000000000 + j * 3600 * 1000).toISOString(),
        price: 1+j,
        quantity: 1
   }))
}))

export const mockHistoryWeek: StockHistoryItem[] = mockedFullHistory.map(stock => ({
  ...stock,
  history: stock.history.slice(-7)
}));

export const mockHistoryMonth: StockHistoryItem[] = mockedFullHistory.map(stock => ({
  ...stock,
  history: stock.history.slice(-30)
}));


export const mockHistoryAll: StockHistoryItem[] = mockedFullHistory;