import { getAllByRole, queryAllByRole, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../../auth/AuthContext';
import Home from '../Home';
import getTrendingStocksMock from "../../../api/getTrendingStocks";
import getStockPriceMock from "../../../api/getStockPrice";
import getMarketNewsMock from '../../../api/getMarketNews';
import GetStockListMock from '../../../api/getStockList';
import GetStockHistoryMock from "../../../api/GetStockHistory";
import StockDetail from '../../StockDetails/StockDetail';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import HomeTrending from './HomeTrending';
import { mockStockList } from '../../../mocks/Home/mockStockList';
import { mockTrendingStocks } from '../../../mocks/Home/mockTrendingStocks';
import { mockHistory } from '../../../mocks/StockDetails/mockHistory';

const mockedGetTrendingStocks = getTrendingStocksMock as jest.Mock; // for typescript compile time we manually tell typescript these are of type jest.mock so we can change the returned value later
const mockedGetStockPrice = getStockPriceMock as jest.Mock;
const mockedGetMarketNews = getMarketNewsMock as jest.Mock;
const mockedGetStockList = GetStockListMock as jest.Mock;
const mockedGetStockHistory = GetStockHistoryMock as jest.Mock;

jest.mock('axios'); // mocks axios functions to test with edge cases without backend

jest.mock("focus-trap-react", () => {
  return ({ children }: any) => <div>{children}</div>;
});

jest.mock("../../../api/getMarketNews", () => ({ 
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../../api/getTrendingStocks", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../../api/getStockPrice", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../../api/getStockList", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock("../../../api/GetStockHistory", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue([]),
}));

describe('Renders Correctly and Functions Correctly', () => {

    test('StockList and trendingStockList - Renders', () => {
        render(<HomeTrending stockList={mockStockList} trendingStocksList={mockTrendingStocks} searchStock={jest.fn()}/>)
        expect(screen.getAllByTestId("trendingStocks")).toHaveLength(20);
    })

    test('StockList Empty and trendingStockList - Renders', () => {
        render(<HomeTrending stockList={null} trendingStocksList={mockTrendingStocks} searchStock={jest.fn()}/>)
        expect(screen.getAllByText(/Error - No Stock Found/i)).toHaveLength(20);
    })

    test('StockList and trendingStockList are falsey', () => {
        render(<HomeTrending stockList={null} trendingStocksList={[]} searchStock={jest.fn()}/>)
        expect(screen.queryAllByRole("button")).toHaveLength(0);
        expect(screen.queryByText(/Error - No Stock Found/i)).not.toBeInTheDocument;
        expect(screen.queryByText(/No Stocks Currently Trending/i)).toBeInTheDocument;
    })

    test('Trending Stocks Calls Functions', async () => {
        const navigate = jest.fn()
        render(<HomeTrending stockList={mockStockList} trendingStocksList={mockTrendingStocks} searchStock={navigate}/>)
        const trendingStock = screen.getAllByRole("button")[0]
        await userEvent.click(trendingStock)
        expect(navigate).toHaveBeenCalledWith(mockTrendingStocks[0])
    })

    test('Trending Stocks - No navigation on broken parameters', async () => {
        const navigate = jest.fn()
        render(<HomeTrending stockList={null} trendingStocksList={mockTrendingStocks} searchStock={navigate}/>)
        const trendingStock = screen.getAllByRole("button")[0]
        await userEvent.click(trendingStock)
        expect(navigate).not.toHaveBeenCalled()
    })

    test('Trending Stocks - Broken TrendingStockList', async () => {
        render(<HomeTrending stockList={mockStockList} trendingStocksList={["BROKEN"]} searchStock={jest.fn()}/>)
        expect(screen.queryAllByRole("button")).toHaveLength(2);
        const Errs = screen.queryAllByText(/Error - No Stock Found/i)
        Errs.forEach(err => expect(err).toBeInTheDocument());
    })

    test('Trending stocks have accessible names (At least One Character)', () => {
        render(<HomeTrending stockList={mockStockList} trendingStocksList={mockTrendingStocks} searchStock={jest.fn()}/>)
        const buttons = screen.getAllByRole("button");
        buttons.forEach(btn => {
            expect(btn).toHaveTextContent(/.+/); 
        });
    });

    test('Renders correct number of trending stocks with any length', () => {
        const smallList = mockTrendingStocks.slice(0, 5);
        render(<HomeTrending stockList={mockStockList} trendingStocksList={smallList} searchStock={jest.fn()}/>)
        expect(screen.getAllByRole("button")).toHaveLength(10);
    });
})

describe("HomeTesting Integration Tests", () => {

    beforeEach(() => {
        mockedGetStockList.mockResolvedValue(mockStockList);
        mockedGetTrendingStocks.mockResolvedValue(mockTrendingStocks);
        mockedGetStockPrice.mockResolvedValue(123.56);
        mockedGetMarketNews.mockResolvedValue([]);
        mockedGetStockHistory.mockResolvedValue(mockHistory);
    });

    test("Navigates to Page", async () => {     

        render(
            <MemoryRouter initialEntries={["/"]}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<div>Stock Page</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        )

        const trendingButton = await screen.findAllByRole("button", { name: /Apple Inc./i });
        await userEvent.click(trendingButton[0]);
        expect(await screen.findByText("Stock Page")).toBeInTheDocument();
    })

    test("Navigates to Stock Details Page", async () => {
            

        render(
            <MemoryRouter initialEntries={["/"]}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<StockDetail/>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        )

        const trendingButton = await screen.findAllByRole("button", { name: /Apple Inc./i });
        await userEvent.click(trendingButton[0]);
        expect(await screen.findByText(/Overview/i)).toBeInTheDocument();
    })
})