import { render, screen } from "@testing-library/react";
import { useAuth } from "../../auth/AuthContext"
import { mockedUser } from "../../mocks/Global/mockedUser";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import Register from "./Register";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";

jest.mock("../../auth/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../hooks/useRegister", () => ({
    useRegister: jest.fn()
}))

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const mockedUseAuth = useAuth as jest.Mock
const mockedUseRegister = useRegister as jest.Mock

describe("Register Renders and functuonality tests", () => {

    test("redirects if Logged in", () => {

        mockedUseAuth.mockReturnValue({
            user: mockedUser
        })

        mockedUseRegister.mockReturnValue({
            CompleteRegister: jest.fn(),
            error: '',
            errorCode: null,
            resetError: jest.fn()
        })

        render(
            <MemoryRouter initialEntries={["/register"]}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Home Page/i)).toBeInTheDocument()
    })

    test('Renders Register Form When User Not Logged In', () => {

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseRegister.mockReturnValue({
            CompleteRegister: jest.fn(),
            error: '',
            errorCode: null,
            resetError: jest.fn()
        })

        render(
            <MemoryRouter initialEntries={["/register"]}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Confirm your password/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Submit and Create account/i})).toBeInTheDocument()
    })

    test('Integration Test - Passes Correct Props To RegisterForm', async () => {

        const CompleteRegister = jest.fn()
        const error = "Unknown"
        const errorCode = null
        const resetError = jest.fn()

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseRegister.mockReturnValue({
            toRegister: CompleteRegister,
            error: error,
            errorCode: errorCode,
            resetError: resetError
        })

        render(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        const usernameInput = screen.getByPlaceholderText(/Enter your username/i)
        const passwordInput = screen.getByPlaceholderText(/Enter your password/i)
        const confirmPasswordInput = screen.getByPlaceholderText(/Confirm your password/i)
        const RegisterButton = screen.getByRole("button", { name: /Submit and Create account/i})

        await userEvent.type(usernameInput, "testUser")
        await userEvent.type(passwordInput, "thePassword123")
        await userEvent.type(confirmPasswordInput, "password12")

        await userEvent.click(RegisterButton)

        expect(CompleteRegister).toHaveBeenCalledTimes(1);
        expect(CompleteRegister).toHaveBeenCalledWith("testUser", "thePassword123", "password12")

    })

    test("Error Renders Correctly When Error Exists", () => {
        
        const CompleteRegister = jest.fn()
        const error = ""
        const errorCode = 404
        const resetError = jest.fn()

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseRegister.mockReturnValue({
            toRegister: CompleteRegister,
            error: error,
            errorCode: errorCode,
            resetError: resetError
        })

        render(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
    })

    test("Error calls Reset on Error confirmation", async () => {
        
        const CompleteRegister = jest.fn()
        const error = ""
        const errorCode = 404
        const resetError = jest.fn()

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseRegister.mockReturnValue({
            toRegister: CompleteRegister,
            error: error,
            errorCode: errorCode,
            resetError: resetError
        })

        render(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
        await userEvent.click(screen.getByRole("button", { name: /warning understood confirmation/i }))
        expect(resetError).toHaveBeenCalledTimes(1)
    })

    test("Error does not Render when errorCode is Null", () => {
        mockedUseAuth.mockReturnValue({ user: null });

        mockedUseRegister.mockReturnValue({
            toRegister: jest.fn(),
            error: "",
            errorCode: null,
            resetError: jest.fn()
        });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        expect(screen.queryByTestId("ErrorMessage")).not.toBeInTheDocument();
    });

})