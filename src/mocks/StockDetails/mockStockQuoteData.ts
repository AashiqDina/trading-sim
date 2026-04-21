import { StockQuoteData } from "../../types/types";

export const mockStockQuoteData: StockQuoteData = {
  symbol: "AAPL",
  name: "Apple Inc.",
  exchange: "NASDAQ",
  micCode: "XNAS",
  currency: "USD",
  datetime: "2026-04-20 12:00:00",
  timestamp: 1713600000,

  open: 180,
  high: 185,
  low: 179,
  close: 183,
  change: 3,
  percentChange: 1.67,

  averageVolume: 50000000,
  volume: 52000000,

  previousClose: 180,
  isMarketOpen: true,

  extendedChange: 0.5,
  extendedPercentChange: 0.27,
  extendedPrice: 183.5,
  extendedTimestamp: 1713610000,

  rolling1DChange: 3,
  rolling7DChange: 8,
  rollingPeriodChange: 12,

  fiftyTwoWeek: {
    low: 140,
    high: 190,
    lowChange: 43,
    highChange: -7,
    lowChangePercent: 30.71,
    highChangePercent: -3.68,
    range: "140 - 190",
  },
};