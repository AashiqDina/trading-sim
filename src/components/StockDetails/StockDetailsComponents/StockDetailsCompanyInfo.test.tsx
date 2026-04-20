import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StockDetailsCompanyInformation from "./StockDetailsCompanyInformation";
import { useStockDetailsInfo } from "../../../hooks/useStockDetailsInfo";
import { userEvent } from "@testing-library/user-event";
import { mockCompanyInformation } from "../../../mocks/StockDetails/mockCompanyInfortmation";

jest.mock("../../../hooks/useStockDetailsInfo", () => ({
    useStockDetailsInfo: jest.fn(),
}));

const mockedUseStockDetailsInfo = useStockDetailsInfo as jest.Mock;

describe("StockDetailsCompanyInformation tests", () => {

    const fetchInfoMock = jest.fn();

    beforeEach(() => {
    mockedUseStockDetailsInfo.mockReturnValue({
        infoLoading: false,
        companyInformation: mockCompanyInformation,
        fetchStocksInfo: fetchInfoMock,
        });
    });

    test("renders company information correctly", () => {
        
        render(
            <StockDetailsCompanyInformation
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(fetchInfoMock).toHaveBeenCalledTimes(1);
        expect(screen.getByText(/Description/i)).toBeInTheDocument();
        expect(screen.getByText(/Desc Test that is long enough/i)).toBeInTheDocument();
        expect(screen.getByText(/CEO/i)).toBeInTheDocument();
        expect(screen.getByText(/Mr. Timothy D. Cook/i)).toBeInTheDocument();
        expect(screen.getByText(/Industry/i)).toBeInTheDocument();
        expect(screen.getByText(/Technology/i)).toBeInTheDocument();
        expect(screen.getByText(/Sector/i)).toBeInTheDocument();
        expect(screen.getByText(/Consumer Electronics/i)).toBeInTheDocument();
        expect(screen.getByText(/Website/i)).toBeInTheDocument();
        expect(screen.getByText(/https:\/\/www.example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Phone/i)).toBeInTheDocument();
        expect(screen.getByText(/\(408\) 996-1010/i)).toBeInTheDocument();
        expect(screen.getByText(/Employees/i)).toBeInTheDocument();
        expect(screen.getByText(/150000/i)).toBeInTheDocument();
        expect(screen.getByText(/Exchange/i)).toBeInTheDocument();
        expect(screen.getByText(/NASDAQ/i)).toBeInTheDocument();
        expect(screen.getByText(/Type/i)).toBeInTheDocument();
        expect(screen.getByText(/Common Stock/i)).toBeInTheDocument();
        expect(screen.getByText(/Address/i)).toBeInTheDocument();
        expect(screen.getByText(/One Apple Park Way, Cupertino, CA 95014, United States/i)).toBeInTheDocument();
    })

    test("renders loading state correctly", () => {

        mockedUseStockDetailsInfo.mockReturnValue({
            infoLoading: true,
            companyInformation: null,
            fetchStocksInfo: jest.fn(),
        })

        render(
            <StockDetailsCompanyInformation
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        expect(screen.getByTestId(/loading/i)).toBeInTheDocument();

    })

    test("renders error message for non-Apple stocks", () => {

        mockedUseStockDetailsInfo.mockReturnValue({
            infoLoading: false,
            companyInformation: null,
            fetchStocksInfo: jest.fn(),
        })

        render(
            <StockDetailsCompanyInformation
                symbol="MSFT"
                handleError={jest.fn()}
            />
        )

        expect(screen.getByText(/Due to restrictions in the Twelve Data API’s free tier, this section’s data is only available for Apple./i)).toBeInTheDocument();

    })

    test("toggles see more and see less", async () => {

        mockedUseStockDetailsInfo.mockReturnValue({
            infoLoading: false,
            companyInformation: {
                description: "A".repeat(300),
            },
            fetchStocksInfo: jest.fn(),
        });

        render(
            <StockDetailsCompanyInformation
                symbol="AAPL"
                handleError={jest.fn()}
            />
        );

        const seeMore = screen.getByText(/See more/i);
        expect(seeMore).toBeInTheDocument();

        await userEvent.click(seeMore);

        const seeLess = screen.getByText(/See less/i);
        expect(seeLess).toBeInTheDocument();

    });

})