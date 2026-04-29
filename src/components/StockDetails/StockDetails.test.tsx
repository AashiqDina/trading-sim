import { render, screen } from "@testing-library/react"
import { useAuth } from "../../auth/AuthContext";
import '@testing-library/jest-dom';
import { mockedUser } from "../../mocks/Global/mockedUser";
import StockDetails from "./StockDetail"
import { MockUseStockDetails } from "../../mocks/StockDetails/mockUseStockDetails";
import userEvent from "@testing-library/user-event";
import { ApiError } from "../../error/ApiError";


const mockedUseAuth = useAuth as jest.Mock;
const mockUseStockDetails = jest.fn();

jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ symbol: "AAPL" }),
  useLocation: () => ({ state: { stockPrice: 150 } }),
}));

jest.mock("../../hooks/stockDetails/useStockDetails", () => ({
  useStockDetails: (args: any) => mockUseStockDetails(args),
}));

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: any) => <div>{children}</div>
}));

jest.mock('./StockDetailsComponents/StockDetailsOverview', () => () => <div>Overview Component</div>);
jest.mock('./StockDetailsComponents/StockDetailsCompanyInformation', () => () => <div>Company Info Component</div>);
jest.mock('./StockDetailsComponents/StockDetailsStockData', () => () => <div>Stock Data Component</div>);
jest.mock('./StockDetailsComponents/StockDetailsOwnedStocks', () => () => <div>Owned Stocks Component</div>);
jest.mock('./StockDetailsComponents/StockDetailsNews', () => () => <div>News Component</div>);

describe("StockDetails tests", () => {

    const mockHandleBuy = jest.fn()
    const mockChangeBuyModal = jest.fn()

    beforeEach(() => {
        mockedUseAuth.mockReturnValue({
            user: mockedUser,
            login: jest.fn(),
            logout: jest.fn()
        });

        mockUseStockDetails.mockReturnValue({
            ...MockUseStockDetails(),
            handleBuyStock: mockHandleBuy,
            changeBuyModal: mockChangeBuyModal
        });
    })

    test("Everything Renders as Expected on initial render", () => {

        render(
            <StockDetails/>
        )

        expect(screen.getByText("Overview Component")).toBeInTheDocument()
        expect(screen.getByText("AAPL")).toBeInTheDocument()
        expect(screen.getByText("Apple Inc")).toBeInTheDocument()
        expect(screen.getByText("£150.00")).toBeInTheDocument()
        expect(screen.queryByTestId("ErrorMessage")).not.toBeInTheDocument()
        expect(screen.queryByTestId("BuyModal")).not.toBeInTheDocument()
    })

    test("Renders switching fine", async () => {

        render(
            <StockDetails/>
        )

        await userEvent.click(screen.getByText(/About/i))
        expect(screen.getByText(/Company Info Component/i)).toBeInTheDocument()
        await userEvent.click(screen.getByText(/Stock Data/i))
        expect(screen.getByText(/Stock Data Component/i)).toBeInTheDocument()
        await userEvent.click(screen.getByText(/Owned Stocks/i))
        expect(screen.getByText(/Owned Stocks Component/i)).toBeInTheDocument()
        await userEvent.click(screen.getByText(/News/i))
        expect(screen.getByText(/News Component/i)).toBeInTheDocument()
        await userEvent.click(screen.getByText(/Overview/i))
        expect(screen.getByText(/Overview Component/i)).toBeInTheDocument()
    })

    test("Renders loading states correctly", () => {

        mockUseStockDetails.mockReturnValue({
            ...MockUseStockDetails(),
            baseLoading: true
        })

        render(
            <StockDetails/>
        );

        expect(screen.getByTestId('loading')).toBeInTheDocument()

    })

    test("Shows error popup when handleError is triggered", async () => {

        mockUseStockDetails.mockImplementation(({ handleError }) => {
            setTimeout(() => handleError(new ApiError(429)), 0);

            return {
            ...MockUseStockDetails(),
            };
        });

        render(<StockDetails />);

        expect(await screen.findByTestId("ErrorMessage")).toBeInTheDocument();
    });

    test("Shows buy modal when open", () => {

        mockUseStockDetails.mockReturnValue({
            ...MockUseStockDetails(),
            buyModalOpen: true
        });

        render(<StockDetails />);

        expect(screen.getByTestId("BuyModal")).toBeInTheDocument();
    });

    test("Prevents buy modal when error exists", async () => {

        mockUseStockDetails.mockReturnValue({
            ...MockUseStockDetails(),
            buyModalOpen: true
        });

        mockUseStockDetails.mockImplementation(({ handleError }) => {
            setTimeout(() => handleError(new ApiError(429)));

            return {
                ...MockUseStockDetails(),
                buyModalOpen: true
            };
        });

        render(<StockDetails />);

        expect(await screen.findByTestId("ErrorMessage")).toBeInTheDocument();
        expect(screen.queryByTestId("BuyModal")).not.toBeInTheDocument();
    });

    test("Opens buy modal when Buy Stock button is clicked", async () => {

        const user = userEvent.setup();

        mockUseStockDetails.mockReturnValue({
            ...MockUseStockDetails(),
            buyModalOpen: false,
            changeBuyModal: mockChangeBuyModal
        });

        render(<StockDetails />);

        await user.click(screen.getByRole("button", { name: /buy stock/i }));
        expect(mockChangeBuyModal).toHaveBeenCalledTimes(1);
    });

})