import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ErrorPopup from "./ErrorPopup"
import { handleErrorMessages } from "../utils/HandleErrorMessages"
import userEvent from "@testing-library/user-event"

describe("Error renders correctly", () => {

    test("Renders Error correctly", () => {

        const ErrCode = 404

        render(
            <ErrorPopup
                ErrorCode={ErrCode}
                Confirm={jest.fn()}
            />            
        )   

        const err = handleErrorMessages(ErrCode)

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
        expect(screen.getByText(err.title)).toBeInTheDocument()
        expect(screen.getByText(err.bodyText)).toBeInTheDocument()
        expect(screen.getByText(err.buttonText)).toBeInTheDocument()
        expect(screen.getByAltText(/ERROR SYMBOL/i)).toBeInTheDocument()
    })

    test("Renders Warning correctly", () => {

        const ErrCode = 1499

        render(
            <ErrorPopup
                ErrorCode={ErrCode}
                Confirm={jest.fn()}
            />            
        )   

        const err = handleErrorMessages(ErrCode)

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
        expect(screen.getByText(err.title)).toBeInTheDocument()
        expect(screen.getByText(err.bodyText)).toBeInTheDocument()
        expect(screen.getByText(err.buttonText)).toBeInTheDocument()
        expect(screen.getByAltText(/WARNING SYMBOL/i)).toBeInTheDocument()
    })

    test("Confimation Button calls correct function", async () => {

        const buttonFn = jest.fn() 

        render(
            <ErrorPopup
                ErrorCode={0}
                Confirm={buttonFn}
            />            
        )   

        await userEvent.click(screen.getByRole("button", { name: /warning understood confirmation/i}))
        expect(buttonFn).toHaveBeenCalledTimes(1)
    })
})