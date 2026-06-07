import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorPopup from "./ErrorPopup";
import { handleErrorMessages } from "../utils/HandleErrorMessages";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const logoutMock = jest.fn();

jest.mock("../hooks/logout/useLogout", () => ({
    useLogout: jest.fn(),
}));

import { useLogout } from "../hooks/logout/useLogout";
const mockedUseLogout = useLogout as jest.Mock;

describe("Error renders correctly", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseLogout.mockReturnValue(logoutMock);
    });

    test("Renders Error correctly", () => {
        const ErrCode = 404;

        render(
            <MemoryRouter>
                <ErrorPopup ErrorCode={ErrCode} Confirm={jest.fn()} />
            </MemoryRouter>
        );

        const err = handleErrorMessages(ErrCode);

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument();
        expect(screen.getByText(err.title)).toBeInTheDocument();
        expect(screen.getByText(err.bodyText)).toBeInTheDocument();
        expect(screen.getByText(err.buttonText)).toBeInTheDocument();
        expect(screen.getByAltText(/ERROR SYMBOL/i)).toBeInTheDocument();
    });

    test("Renders Warning correctly", () => {
        const ErrCode = 1499;

        render(
            <MemoryRouter>
                <ErrorPopup ErrorCode={ErrCode} Confirm={jest.fn()} />
            </MemoryRouter>
        );

        const err = handleErrorMessages(ErrCode);

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument();
        expect(screen.getByText(err.title)).toBeInTheDocument();
        expect(screen.getByText(err.bodyText)).toBeInTheDocument();
        expect(screen.getByText(err.buttonText)).toBeInTheDocument();
        expect(screen.getByAltText(/WARNING SYMBOL/i)).toBeInTheDocument();
    });

    test("Confirmation Button calls correct function", async () => {
        const buttonFn = jest.fn();

        render(
            <MemoryRouter>
                <ErrorPopup ErrorCode={0} Confirm={buttonFn} />
            </MemoryRouter>
        );

        await userEvent.click(
            screen.getByRole("button", {
                name: /warning understood confirmation/i
            })
        );

        expect(buttonFn).toHaveBeenCalledTimes(1);
    });

    test("calls logout when ErrorCode is 4010", async () => {
        const buttonFn = jest.fn();

        render(
            <MemoryRouter>
                <ErrorPopup ErrorCode={4010} Confirm={buttonFn} />
            </MemoryRouter>
        );

        await userEvent.click(
            screen.getByRole("button", {
                name: /warning understood confirmation/i
            })
        );

        expect(logoutMock).toHaveBeenCalledTimes(1);
        expect(buttonFn).toHaveBeenCalledTimes(1);
    });

    test("does NOT call logout when ErrorCode is not 4010", async () => {
        const buttonFn = jest.fn();

        render(
            <MemoryRouter>
                <ErrorPopup ErrorCode={404} Confirm={buttonFn} />
            </MemoryRouter>
        );

        await userEvent.click(
            screen.getByRole("button", {
                name: /warning understood confirmation/i
            })
        );

        expect(logoutMock).not.toHaveBeenCalled();
        expect(buttonFn).toHaveBeenCalledTimes(1);
    });
});