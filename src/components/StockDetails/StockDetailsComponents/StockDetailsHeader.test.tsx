import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StockDetailsHeader from "./StockDetailsHeader";
import userEvent from "@testing-library/user-event";

describe("StockDetailsHeader Tests", () => {

    test("Renders stock details header correctly", () => {

        render(
            <StockDetailsHeader
                stockLogo="logo.png"
                stockName="Test Stock"
                stockSymbol="TST"
                stockPrice={123.45}
                DisplayedData="Overview"
                userExists={true}
                switchSection={jest.fn}
                changeBuyModal={jest.fn}
            />
        );

        expect(screen.getByText(/Test Stock/i)).toBeInTheDocument();
        expect(screen.getByText(/TST/i)).toBeInTheDocument();
        expect(screen.getByText(/£123.45/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Buy Stock/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /View overview/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /View company information/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /View stock data/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /View owned stocks/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /View stock related news/i })).toBeInTheDocument();
    
    })

    test("Does not render buy button and owned stocks button when user does not exist", () => {

        render(
            <StockDetailsHeader
                stockLogo="logo.png"
                stockName="Test Stock"
                stockSymbol="TST"
                stockPrice={123.45}
                DisplayedData="Overview"
                userExists={false}
                switchSection={jest.fn}
                changeBuyModal={jest.fn}
            />
        );

        expect(screen.queryByRole("button", { name: /Buy Stock/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /View owned stocks/i })).not.toBeInTheDocument();

    })

    test("switchSection is called with correct argument when buttons are clicked", async () => {
        const mockSwitchSection = jest.fn();

        render(
            <StockDetailsHeader
                stockLogo="logo.png"
                stockName="Test Stock"
                stockSymbol="TST"
                stockPrice={123.45}
                DisplayedData="Overview"
                userExists={true}
                switchSection={mockSwitchSection}
                changeBuyModal={jest.fn}
            />
        );

        const overviewButton = await screen.getByRole("button", { name: /View overview/i });
        await userEvent.click(overviewButton);
        expect(mockSwitchSection).toHaveBeenCalledWith("Overview");
        const companyInfoButton = await screen.getByRole("button", { name: /View company information/i });
        await userEvent.click(companyInfoButton);
        expect(mockSwitchSection).toHaveBeenCalledWith("CompanyInformation");
        const stockDataButton = await screen.getByRole("button", { name: /View stock data/i });
        await userEvent.click(stockDataButton);
        expect(mockSwitchSection).toHaveBeenCalledWith("StockData");
        const ownedStocksButton = await screen.getByRole("button", { name: /View owned stocks/i });
        await userEvent.click(ownedStocksButton);
        expect(mockSwitchSection).toHaveBeenCalledWith("OwnedStocks");
        const newsButton = await screen.getByRole("button", { name: /View stock related news/i });
        await userEvent.click(newsButton);
        expect(mockSwitchSection).toHaveBeenCalledWith("News");
    })

    test("changeBuyModal is called when buy button is clicked", async () => {
        const mockChangeBuyModal = jest.fn();
        
        render(
            <StockDetailsHeader
                stockLogo="logo.png"
                stockName="Test Stock"
                stockSymbol="TST"
                stockPrice={123.45}
                DisplayedData="Overview"
                userExists={true}
                switchSection={jest.fn}
                changeBuyModal={mockChangeBuyModal}
            />
        );

        const buyButton = await screen.getByRole("button", { name: /Buy Stock/i });
        await userEvent.click(buyButton);
        expect(mockChangeBuyModal).toHaveBeenCalledTimes(1);

    })

    test("highlights active section correctly", () => {
        render(
            <StockDetailsHeader
                stockLogo="logo.png"
                stockName="Test Stock"
                stockSymbol="TST"
                stockPrice={123.45}
                DisplayedData="Overview"
                userExists={true}
                switchSection={jest.fn()}
                changeBuyModal={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: /View overview/i })).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: /View stock data/i })).toHaveAttribute("aria-pressed", "false");
    });
})