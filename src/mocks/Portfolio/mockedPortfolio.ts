import { UserPortfolio } from "../../types/types";
import { mockPortfolioStocks } from "./mockPortfolioStocks";

export const mockedPortfolio: UserPortfolio = {
    id: 1,
    userId: 1,
    stocks: mockPortfolioStocks,
    totalInvested: 100,
    currentValue: 150,
    profitLoss: 50
}