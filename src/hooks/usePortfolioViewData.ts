import { useMemo, useState } from "react";
import { StockHistoryItem, UserPortfolio } from "../types/types";
import { createPortfolioTables } from "../utils/createPortfolioTable";

type props = {
    portfolio: UserPortfolio | null
    searchInput: string
    FilteredOption: string
    fullHistory: StockHistoryItem[] | null,
    filterHistory: string
}

export function usePortfolioViewData({portfolio, searchInput, FilteredOption, fullHistory, filterHistory}: props){

    const visibleStocks = useMemo(() => {
        if (!portfolio?.stocks) return [];

        let result = [...portfolio.stocks];

        if (searchInput.trim() !== "") {
            result = result.filter((stock) =>
            stock.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            stock.symbol.toLowerCase().includes(searchInput.toLowerCase())
            );
        }

        switch (FilteredOption) {
            case "Newest":
                result.sort((a, b) => b.id - a.id);
                break;
            case "Oldest":
                result.sort((a, b) => a.id - b.id);
                break;
            case "ProfitAsc":
                result.sort((a, b) => a.profitLoss - b.profitLoss);
                break;
            case "ProfitDesc":
                result.sort((a, b) => b.profitLoss - a.profitLoss);
                break;
            case "ValueAsc":
                result.sort((a, b) => a.totalValue - b.totalValue);
                break;
            case "ValueDesc":
                result.sort((a, b) => b.totalValue - a.totalValue);
                break;
        }
        return result;
    }, [portfolio, searchInput, FilteredOption]);

    const tableStocks = useMemo(() => {
        return createPortfolioTables(visibleStocks);
    }, [visibleStocks]);

    const history = useMemo(() => {
        if (!fullHistory) return null;

        const now = new Date();

        return fullHistory.map(stock => {
            let filtered = stock.history;

            switch (filterHistory) {
            case "week":
                filtered = stock.history.filter(tx =>
                (now.getTime() - new Date(tx.timestamp).getTime()) <= 7 * 24 * 60 * 60 * 1000
                );
                break;

            case "month":
                filtered = stock.history.filter(tx =>
                (now.getTime() - new Date(tx.timestamp).getTime()) <= 30 * 24 * 60 * 60 * 1000
                );
                break;

            case "year":
                filtered = stock.history.filter(tx =>
                (now.getTime() - new Date(tx.timestamp).getTime()) <= 365 * 24 * 60 * 60 * 1000
                );
                break;

            case "all":
            default:
                filtered = stock.history;
            }

            return {
            ...stock,
            history: filtered
            };
        });

        }, [fullHistory, filterHistory]);



    return { visibleStocks, tableStocks, history }
}