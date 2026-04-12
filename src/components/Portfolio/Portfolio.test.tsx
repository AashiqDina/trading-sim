
jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../hooks/usePortfolio");
jest.mock("../../hooks/usePortfolioViewData");

import { render, screen, within } from "@testing-library/react";
import { usePortfolio } from "../../hooks/usePortfolio";
import { usePortfolioViewData } from "../../hooks/usePortfolioViewData";
import { mockedFullHistory } from "../../mocks/Portfolio/mockedFullHistory";
import { mockedPortfolio } from "../../mocks/Portfolio/mockedPortfolio";
import { mockPortfolioStocks } from "../../mocks/Portfolio/mockPortfolioStocks";
import { mockTableStocks } from "../../mocks/Portfolio/mockTableStocks";
import Portfolio from "./Portfolio";
import '@testing-library/jest-dom';
import { useAuth } from "../../auth/AuthContext";
import { mockedUser } from "../../mocks/Global/mockedUser";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";


const mockedUseAuth = useAuth as jest.Mock;
const mockedUsePortfolio = usePortfolio as jest.Mock;
const mockedUsePortfolioViewData = usePortfolioViewData as jest.Mock;

jest.mock("focus-trap-react", () => ({
  FocusTrap: ({ children }: any) => <div>{children}</div>,
}));

const MockedUsePortfolioObj = {
  portfolio: mockedPortfolio,
  fullHistory: mockedFullHistory,
  loading: false,
  errorCode: null,
  resetError: jest.fn(),
  handleDeleteStock: jest.fn(),
  refreshPortfolio: jest.fn(),
  LastUpdatedDictionary: new Map()
}

describe("Portfolio Integration Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseAuth.mockReturnValue({
            user: mockedUser,
            login: jest.fn(),
            logout: jest.fn()
        });

        mockedUsePortfolio.mockReturnValue(MockedUsePortfolioObj);

        mockedUsePortfolioViewData.mockReturnValue({
            visibleStocks: mockPortfolioStocks,
            tableStocks: mockTableStocks,
            history: mockedFullHistory
        });
    });

    test("Loading renders when data is loading is set to true", async () => {

        mockedUsePortfolio.mockReturnValueOnce({...MockedUsePortfolioObj, loading: true, portfolio: null})

        render(
            <MemoryRouter>
                <Portfolio/>
            </MemoryRouter>
        )

        expect(await screen.findByTestId(/loading/i)).toBeInTheDocument()
    })

    test("Error renders when there is an error", () => {
        mockedUsePortfolio.mockReturnValue({
            ...MockedUsePortfolioObj,
            portfolio: null,
        });

        mockedUsePortfolioViewData.mockReturnValue({
            visibleStocks: mockPortfolioStocks,
            tableStocks: mockTableStocks,
            history: mockedFullHistory
        });

        render(
            <MemoryRouter>
                <Portfolio/>
            </MemoryRouter>
        );

        expect(screen.getByText(/Unknown API Error/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Warning Understood Confirmation/i)).toBeInTheDocument();
    });

    test("Error renders when there is an error", () => {
        mockedUsePortfolio.mockReturnValue({
            ...MockedUsePortfolioObj,
            portfolio: mockedPortfolio,
            errorCode: 429
        });

        mockedUsePortfolioViewData.mockReturnValue({
            visibleStocks: mockPortfolioStocks,
            tableStocks: mockTableStocks,
            history: mockedFullHistory
        });

        render(
            <MemoryRouter>
                <Portfolio/>
            </MemoryRouter>
        );

        expect(screen.getByText(/Slow down!/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Warning Understood Confirmation/i)).toBeInTheDocument();
    });

    test("Everything Renders as it should", () => {

        render(
            <MemoryRouter>
                <Portfolio/>
            </MemoryRouter>
        )

        expect(screen.getByText(/TestUser's Portfolio/i)).toBeInTheDocument()
        expect(screen.getByText(/Hover to see value/i)).toBeInTheDocument()
        expect(screen.getByText(/Holdings/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Enter a stock name or symbol to fiter your stocks/i)).toBeInTheDocument()
        expect(screen.getByRole("table")).toBeInTheDocument()
    })

    test("Delete Modal renders + Cancel works", async () => {
        
        render(
            <MemoryRouter>
                <Portfolio/>
            </MemoryRouter>
        )

        let rows = screen.getAllByRole("row");
         
        await userEvent.click(rows[1])
        rows = screen.getAllByRole("row");

        await userEvent.click(within(rows[2]).getByLabelText("Delete Stock"))
        expect(await screen.findByText(/Are you sure you want to delete?/i)).toBeInTheDocument()

        await userEvent.click(screen.getByRole("button", { name: /cancel/i }))
        expect(await screen.queryByText(/Are you sure you want to delete?/i)).not.toBeInTheDocument()
    })

    test("Delete Modal - Delete Button calls correct function", async () => {

        let trueDelFn = jest.fn().mockResolvedValueOnce(true)
        
        mockedUsePortfolio.mockReturnValue({...MockedUsePortfolioObj, handleDeleteStock: trueDelFn})

        render(
            <MemoryRouter>
                <Portfolio/>
            </MemoryRouter>
        )

        let rows = screen.getAllByRole("row");
         
        await userEvent.click(rows[1])
        rows = screen.getAllByRole("row");

        await userEvent.click(within(rows[2]).getByLabelText("Delete Stock"))
        expect(await screen.findByText(/Are you sure you want to delete?/i)).toBeInTheDocument()

        await userEvent.click(screen.getByRole("button", { name: "Delete Stock?" }));
        expect(trueDelFn).toHaveBeenCalledWith(mockedUser.id, mockPortfolioStocks[0].id)
        expect(screen.queryByText(/Are you sure you want to delete?/i)).not.toBeInTheDocument()

    })
    
})