import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom';
import PortfolioHeader from "./PortfolioHeader"

describe("Portfolio Header Renders Correctly", () => {

    test("Props Render Correctly", () => {

        render(
            <PortfolioHeader 
            username={"TestUser"} 
            totalInvested={10} 
            currentValue={15}
            profitLoss={5}/>
        )


        expect(screen.getByText("TestUser's Portfolio")).toBeInTheDocument()
        expect(screen.getByText("Invested")).toBeInTheDocument();
        expect(screen.getByText("Portfolio Value")).toBeInTheDocument();
        expect(screen.getByText("Profit")).toBeInTheDocument();
        expect(screen.getByText("£10.00")).toBeInTheDocument()
        expect(screen.getByText("£15.00")).toBeInTheDocument()
        expect(screen.getByText("+£5.00")).toBeInTheDocument()
        expect(screen.getByText("+50.00%")).toBeInTheDocument()

    })

    test("Props Render Negative Profit Correctly", () => {

        render(
            <PortfolioHeader 
            username={"TestUser"} 
            totalInvested={10} 
            currentValue={5}
            profitLoss={-5}/>
        )

        expect(screen.getByText("TestUser's Portfolio")).toBeInTheDocument()
        expect(screen.getByText("£10.00")).toBeInTheDocument()
        expect(screen.getByText("£5.00")).toBeInTheDocument()
        expect(screen.getByText("-£5.00")).toBeInTheDocument()
        expect(screen.getByText("-50.00%")).toBeInTheDocument()

    })
})