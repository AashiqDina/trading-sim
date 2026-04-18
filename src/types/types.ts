export type MarketNews = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};

export type StockList = Record<string, {symbol: string, logo: string}> | null;

export type TrendingStocksList = string[] 

export type Suggestion = {
  name: string;
  symbol: string;
  logo: string;
};

export type HomeData = {
    stockList: StockList,
    trendingList: TrendingStocksList,
    marketNews: MarketNews[]
}

export type DisplayError = {
    display: boolean,
    warning: boolean,
    title: string,
    bodyText: string,
    buttonText: string
};

export type ErrorMessageDetails = {
    warning: boolean,
    title: string,
    bodyText: string,
    buttonText: string
}

export type StockHistoryEntry = {
  timestamp: string;
  price: number;
  quantity: number;
}

export type StockHistoryItem = {
  stockId: number;
  symbol: string;
  history: StockHistoryEntry[];
}

export type IncompleteStock = {
  id: number;
  symbol: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  totalValue: number;
  profitLoss: number;
  portfolioId: number;
  history: StockHistoryEntry[];
};

export type PortfolioStock = {
  id: number;
  symbol: string;
  name: string;
  logo: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  totalValue: number;
  profitLoss: number;
  portfolioId: number;
  history: StockHistoryEntry[];
};

export type UserPortfolio = {
  id: number;
  userId: number;
  stocks: PortfolioStock[];
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
};

export type PortfolioTableStock = {
  symbol: string;
  name: string;
  logo: string;
  avgBuyPrice: number;
  currentWorth: number;
  profitPercent: number;
  totalCost: number;
  totalShares: number;
  transactions: Transaction[];
};

export type Transaction = {
  id: number;
  symbol: string;
  purchasePrice: number;
  quantity: number;
  portfolioId: number;
  profitLoss: number;
  totalValue: number;
  currentPrice: number;
  history: PriceHistoryEntry[]
};

export type PriceHistoryEntry = {
  timestamp: string;
  price: number;
  quantity: number;
};

export type StockHistory = {
  stockId: number;
  symbol: string;
  history: PriceHistoryEntry[];
};

export type StockSummaryItem = {
  company: string;
  logo: string;
  profit: number;
  value: number;
};

export type PortfolioOverview = {
  greatestProfit: StockSummaryItem;
  greatestLoss: StockSummaryItem;
};

export type StockDetailsHistoryItem = {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockQuoteData = {
  symbol: string;
  name: string;
  exchange: string;
  micCode: string;
  currency: string;
  datetime: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  percentChange: number;
  averageVolume: number;
  volume: number;
  previousClose: number;
  isMarketOpen: boolean;
  extendedChange: number;
  extendedPercentChange: number;
  extendedPrice: number;
  extendedTimestamp: number;
  rolling1DChange: number;
  rolling7DChange: number;
  rollingPeriodChange: number;

  fiftyTwoWeek: {
    low: number;
    high: number;
    lowChange: number;
    highChange: number;
    lowChangePercent: number;
    highChangePercent: number;
    range: string;
  };
};

export type CompanyProfile = {
  symbol: string;
  name: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  website: string;
  ceo: string;
  employees: number;
  exchange: string;
  micCode: string;
  industry: string;
  sector: string;
  type: string;
  description: string;
};

export type DisplayedDataType = "Overview" | "CompanyInformation" | "StockData" | "OwnedStocks" | "News";
