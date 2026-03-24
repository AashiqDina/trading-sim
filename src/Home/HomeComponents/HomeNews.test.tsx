import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../Functions/AuthContext';
import Home from '../Home';
import getTrendingStocksMock from "../../Functions/getTrendingStocks";
import getStockPriceMock from "../../Functions/getStockPrice";
import getMarketNewsMock from '../../Functions/getMarketNews';
import GetStockListMock from '../../Functions/getStockList';
import GetStockHistoryMock from "../../Functions/GetStockHistory";
import StockDetail from '../../StockDetails/StockDetail';
import HomeSearch from './HomeSearch';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { mockStockList } from '../../mocks/Home/mockStockList';
import { mockHistory } from '../../mocks/StockDetails/mockHistory';
import HomeNews from './HomeNews';
import { mockMarketNews } from '../../mocks/Home/mockMarketNews';
import { marketNews } from '../../types';

const mockedGetTrendingStocks = getTrendingStocksMock as jest.Mock; // for typescript compile time we manually tell typescript these are of type jest.mock so we can change the returned value later
const mockedGetStockPrice = getStockPriceMock as jest.Mock;
const mockedGetStockList = GetStockListMock as jest.Mock; // use .default for ES module default export
const mockedGetMarketNews = getMarketNewsMock as jest.Mock;
const mockedGetStockHistory = GetStockHistoryMock as jest.Mock;


jest.mock('axios'); // mocks axios functions to test with edge cases without backend

jest.mock("../../Functions/AuthContext", () => {
  const actual = jest.requireActual("../../Functions/AuthContext"); // loads the real module
  return {
    ...actual, // copies it over here to keep the other functions
    useAuth: () => ({ // useAuth is overridden with what we want it to output so the output of the function useAuth would be a use Obj as specified below
      user: {
        id: 1,
        username: "TestUser",
        investedAmount: 0,
        currentValue: 0,
        profitLoss: 0,
        portfolio: undefined
      }
    })
  };
});

jest.mock("focus-trap-react", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))

jest.mock("../../Functions/getTrendingStocks", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../Functions/getStockPrice", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../Functions/getStockList", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock("../../Functions/getMarketNews", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock("../../Functions/GetStockHistory", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue([]),
}));

jest.mock("../../Functions/getStockName", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue("Apple Inc."),
}));

jest.mock('../../Error/Error', () => () => <div>ErrorMock</div>);

function NewsRenderCheck(newsArray: marketNews[]) {
    newsArray.forEach((article, index) => {
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
}

function NewsNotRenderedCheck(newsArray: marketNews[]){
        newsArray.forEach(article => {
        expect(screen.queryByText(article.headline)).toBeNull();
        expect(screen.queryAllByAltText(article.source + " image")).toHaveLength(0);
        expect(screen.queryByText(article.source)).toBeNull();
        expect(screen.queryByText(article.summary)).toBeNull();
    });
}

const pageSize = 3

describe("Render News Correctly", () => {
    
    test("Empty Market News", () => {
        render(<HomeNews marketNews={[]}/>)
        expect(screen.getByText(/No News Found/i)).toBeInTheDocument()
        expect(screen.queryByText(/Today's News/i)).not.toBeInTheDocument()

    })

    test("Normal Market News", () => {
        render(<HomeNews marketNews={mockMarketNews}/>)
        expect(screen.getByText(/Today's News/i)).toBeInTheDocument()
        NewsRenderCheck(mockMarketNews.slice(0, pageSize))
    })

})

describe("Market News Functionality", () => {

    test("Right Arrow - Switch News", async () => {
        render(<HomeNews marketNews={mockMarketNews}/>)
        const rightArrow = screen.getByRole("button", { name: /Navigate right/i })
        await userEvent.click(rightArrow)
        NewsRenderCheck(mockMarketNews.slice(0+pageSize, 2*pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(0, pageSize))
    })

    test("Left Arrow - Switch News", async () => {
        render(<HomeNews marketNews={mockMarketNews}/>)
        const leftArrow = screen.getByRole("button", { name: /Navigate left/i })
        await userEvent.click(leftArrow)
        NewsRenderCheck(mockMarketNews.slice(mockMarketNews.length-pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(0, pageSize))
    })

    test("Multiple right clicks cycles correctly", async () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, 3*pageSize)}/>)

        const rightArrow = screen.getByRole("button", { name: /Navigate right/i })

        await userEvent.click(rightArrow)
        await userEvent.click(rightArrow)

        NewsRenderCheck(mockMarketNews.slice(2*pageSize, 3*pageSize))
    })

    test("No Arrows if Page Size is too small", () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, (pageSize-1 || 1))}/>)
        expect(screen.queryAllByRole('button')).toHaveLength(0)
    })

    test("All Render if News Array is less than Page Size", () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, (pageSize-1 || 1))}/>)
        NewsRenderCheck(mockMarketNews.slice(0, pageSize-1))
    })

    test("Right Arrow Loop Back", async () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, 2*pageSize)}/>)
        const rightArrow = screen.getByRole("button", { name: /Navigate right/i })
        await userEvent.click(rightArrow)
        NewsRenderCheck(mockMarketNews.slice(pageSize, 2*pageSize))
        await userEvent.click(rightArrow)
        NewsRenderCheck(mockMarketNews.slice(0, pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(pageSize, 2*pageSize))
    })

    test("Left Arrow Loop Back", async () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, 2*pageSize)}/>)
        const leftArrow = screen.getByRole("button", { name: /Navigate left/i })
        await userEvent.click(leftArrow)
        NewsRenderCheck(mockMarketNews.slice(pageSize, 2*pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(0, pageSize))
    })
})