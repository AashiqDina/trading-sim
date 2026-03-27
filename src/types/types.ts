export type marketNews = {
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

export type stockList = Record<string, {symbol: string, logo: string}> | null;

export type trendingStocksList = string[] 

export type Suggestion = {
  name: string;
  symbol: string;
  logo: string;
};

export type HomeData = {
    stockList: stockList,
    trendingList: trendingStocksList,
    marketNews: marketNews[]
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