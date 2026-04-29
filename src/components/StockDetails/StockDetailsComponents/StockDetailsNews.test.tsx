import { render, screen } from "@testing-library/react";
import { useStockDetailsNews } from "../../../hooks/stockDetails/useStockDetailsNews";
import "@testing-library/jest-dom"
import StockDetailsNews from "./StockDetailsNews";
import { userEvent } from "@testing-library/user-event";
import { mockMarketNews } from "../../../mocks/Home/mockMarketNews";

jest.mock("../../../hooks/stockDetails/useStockDetailsNews", () => ({
    useStockDetailsNews: jest.fn(),
}));

const mockedUseStockDetailsNews = useStockDetailsNews as jest.Mock;


describe("StockDetailsNews Tests", () => {

    const fetchStockNewsMock = jest.fn();

    beforeEach(() => {
        mockedUseStockDetailsNews.mockReturnValue({
            newsLoading: false,
            marketNews: mockMarketNews,
            fetchStockNews: fetchStockNewsMock,
        });
    });

    test("renders loading state correctly", () => {
        mockedUseStockDetailsNews.mockReturnValue({
            newsLoading: true,
            news: null,
            fetchStockNews: jest.fn(),
        })

        render(
            <StockDetailsNews
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(screen.getByTestId(/loading/i)).toBeInTheDocument();

    })

    test("renders news articles correctly", () => {

        render(
            <StockDetailsNews
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(fetchStockNewsMock).toHaveBeenCalledTimes(1);
        for(let i = 1; i <= 5; i++){
            expect(screen.getByText(mockMarketNews[i - 1].headline)).toBeInTheDocument();
            expect(screen.getByText(mockMarketNews[i - 1].summary)).toBeInTheDocument();
            expect(screen.getByText(`Source: ${mockMarketNews[i - 1].source}`)).toBeInTheDocument();
            expect(screen.getByText(new Date(mockMarketNews[i-1].datetime * 1000).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }))).toBeInTheDocument();
        }

        expect(screen.getByRole("button", { name: /View More/i })).toBeInTheDocument();

    })

    test("View More button loads more articles", async () => {

        render(
            <StockDetailsNews
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );
        const viewMoreButton = screen.getByRole("button", { name: /View More/i });
        await userEvent.click(viewMoreButton);

        for(let i = 1; i <= 10; i++){
            expect(screen.getByText(mockMarketNews[i - 1].headline)).toBeInTheDocument();
            expect(screen.getByText(mockMarketNews[i - 1].summary)).toBeInTheDocument();
            expect(screen.getByText(`Source: ${mockMarketNews[i - 1].source}`)).toBeInTheDocument();
            expect(screen.getByText(new Date(mockMarketNews[i-1].datetime * 1000).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }))).toBeInTheDocument();
        }
    })

    test("displays correct message when there are no articles", async () => {

        mockedUseStockDetailsNews.mockReturnValue({
            newsLoading: false,
            marketNews: [],
            fetchStockNews: jest.fn(),
        })
        
        render(
            <StockDetailsNews
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(screen.getByText(/No Articles/i)).toBeInTheDocument();
    })

    test("displays correct message when there are no more articles to load", async () => {

        mockedUseStockDetailsNews.mockReturnValue({
            newsLoading: false,
            marketNews: mockMarketNews.slice(0, 7),
            fetchStockNews: jest.fn(),
        })

        render(
            <StockDetailsNews
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        const viewMoreButton = screen.getByRole("button", { name: /View More/i });
        await userEvent.click(viewMoreButton);
        expect(screen.getByText(/No more Articles/i)).toBeInTheDocument();
    
    })


})