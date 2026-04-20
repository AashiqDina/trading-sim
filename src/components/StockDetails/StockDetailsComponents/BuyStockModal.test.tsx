import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"
import BuyStockModal from "./BuyStockModal";
import userEvent from "@testing-library/user-event";

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: any) => <div>{children}</div>
}));

describe("BuyStockModal", () => {
    test("renders the stock correctly", () => {
        render(
            <BuyStockModal
                stockName="Test Stock"
                stockLogo="logo.png"
                stockSymbol="AAPL"
                stockPrice={150}
                handlebuyStock={jest.fn()}
                changeBuyModal={jest.fn()}
            />
        );

        expect(screen.getByText(/Test Stock/i)).toBeInTheDocument();
        expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Enter the quantity here/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Enter the Price here/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Confirm Purchase/i })).toBeInTheDocument();
    });

    test("updates quantity and cost when inputs are changed", async () => {
        render(
            <BuyStockModal
                stockName="Test Stock"
                stockLogo="logo.png"
                stockSymbol="AAPL"
                stockPrice={150}
                handlebuyStock={jest.fn()}
                changeBuyModal={jest.fn()}
            />
        );

        const quantityInput = screen.getByLabelText(/Enter the quantity here/i);
        const costInput = screen.getByLabelText(/Enter the Price here/i);

        await userEvent.type(quantityInput, "2");
        await userEvent.tab();
        expect(costInput).toHaveValue(300);

        await userEvent.clear(costInput);
        await userEvent.type(costInput, "525");
        await userEvent.tab();
        expect(quantityInput).toHaveValue(3.5);
    });


    test("calls handlebuyStock on form submission", async () => {
        const mockHandleBuyStock = jest.fn();

        render(
            <BuyStockModal
                stockName="Test Stock"
                stockLogo="logo.png"
                stockSymbol="AAPL"
                stockPrice={150}
                handlebuyStock={mockHandleBuyStock}
                changeBuyModal={jest.fn()}
            />
        );

        const quantityInput = screen.getByLabelText(/Enter the quantity here/i);
        const costInput = screen.getByLabelText(/Enter the Price here/i);
        const submitButton = screen.getByRole("button", { name: /Confirm Purchase/i });

        await userEvent.type(costInput, "525");
        expect(quantityInput).toHaveValue(3.50); // input only accepts numbers not strings

        await userEvent.click(submitButton);
        expect(mockHandleBuyStock).toHaveBeenCalledWith(150, "3.50");
    })

    test("Calls changeBuyModal when cancel button is clicked", async () => {
        const mockChangeBuyModal = jest.fn();

        render(
            <BuyStockModal
                stockName="Test Stock"
                stockLogo="logo.png"
                stockSymbol="AAPL"
                stockPrice={150}
                handlebuyStock={jest.fn()}
                changeBuyModal={mockChangeBuyModal}
            />
        );

        const cancelButton = screen.getByRole("button", { name: /Cancel/i });
        await userEvent.click(cancelButton);
        expect(mockChangeBuyModal).toHaveBeenCalled();
    });

})