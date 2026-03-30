// Components tested in their own files

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import getTrendingStocksMock from "../../api/getTrendingStocks";
import getMarketNewsMock from '../../api/getMarketNews';
import GetStockListMock from '../../api/getStockList';
import '@testing-library/jest-dom';
import { mockMarketNews } from '../../mocks/Home/mockMarketNews';
import { mockStockList } from '../../mocks/Home/mockStockList';
import { mockTrendingStocks } from '../../mocks/Home/mockTrendingStocks';
import userEvent from '@testing-library/user-event';

const mockedGetTrendingStocks = getTrendingStocksMock as jest.Mock;
const mockedGetStockList = GetStockListMock as jest.Mock;
const mockedGetMarketNews = getMarketNewsMock as jest.Mock;

jest.mock('axios');

jest.mock("focus-trap-react", () => ({
  __esModule: true,
  FocusTrap: ({ children }: any) => <>{children}</>
}));

jest.mock("../../api/getMarketNews", () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock("../../api/getStockList", () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock("../../api/getTrendingStocks", () => ({
    __esModule: true,
    default: jest.fn()
}))

describe("Home - Render", () => {

    test("Loading when awaiting data", async () => {
        mockedGetMarketNews.mockResolvedValueOnce(new Promise(() => {}))
        mockedGetStockList.mockResolvedValueOnce(new Promise(() => {}))
        mockedGetTrendingStocks.mockResolvedValue(new Promise(() => {}))

        render(  
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        )

        expect(await screen.findByTestId(/loading/i)).toBeInTheDocument()
    })

    test("Data Correctly Loaded", async () => {

        const pageSize = 3

        mockedGetMarketNews.mockResolvedValueOnce(mockMarketNews)
        mockedGetStockList.mockResolvedValueOnce(mockStockList)
        mockedGetTrendingStocks.mockResolvedValueOnce(mockTrendingStocks)

        render(
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        )

        await screen.findByPlaceholderText(/search by stock name or symbol/i);
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "a");

        const suggestions = await screen.findAllByRole("option");
        expect(suggestions.length).toBeGreaterThan(0);
        const trendingStocks = await screen.findAllByTestId("trendingStocks");
        expect(trendingStocks).toHaveLength(20);
        expect(screen.getByText(/Today's News/i)).toBeInTheDocument()
        mockMarketNews.slice(0, pageSize).forEach((article, index) => {
            const formattedDate = new Date(article.datetime * 1000).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });

            expect(screen.getByText(formattedDate)).toBeInTheDocument();
            expect(screen.getByText(article.headline)).toBeInTheDocument();
            expect(screen.getAllByAltText(article.source + " image")).toHaveLength(2);
            expect(screen.getByText(article.source)).toBeInTheDocument();
            expect(screen.getByText(article.summary)).toBeInTheDocument();
        });
    })

    test("Data Patially Correctly Loaded", async () => {

        const pageSize = 3

        mockedGetMarketNews.mockResolvedValueOnce([])
        mockedGetStockList.mockResolvedValueOnce(mockStockList)
        mockedGetTrendingStocks.mockResolvedValueOnce(mockTrendingStocks)

        render(
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        )

        await screen.findByPlaceholderText(/search by stock name or symbol/i);
        const input = screen.getByPlaceholderText(/search by stock name or symbol/i);
        await userEvent.type(input, "a");

        const suggestions = await screen.findAllByRole("option");
        expect(suggestions.length).toBeGreaterThan(0);
        const trendingStocks = await screen.findAllByTestId("trendingStocks");
        expect(trendingStocks).toHaveLength(20);
        expect(screen.getByText(/No News Found/i)).toBeInTheDocument()
        expect(screen.queryByText(/Today's News/i)).not.toBeInTheDocument()

        });

    test("Error Handled", async () => {
        mockedGetStockList.mockRejectedValueOnce(new Error("API failure"));
        mockedGetMarketNews.mockRejectedValueOnce(new Error("API failure"));
        mockedGetTrendingStocks.mockRejectedValueOnce(new Error("API failure"));

        render(
            <MemoryRouter>
                <Home/>
            </MemoryRouter>
        )
        expect(await screen.findByTestId(/ErrorMessage/i)).toBeInTheDocument()
    })
})