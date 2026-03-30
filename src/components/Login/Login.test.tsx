import { render, screen } from "@testing-library/react";
import { useAuth } from "../../auth/AuthContext"
import { mockedUser } from "../../mocks/Global/mockedUser";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import Login from "./Login";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";

jest.mock("../../auth/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../hooks/useLogin", () => ({
    useLogin: jest.fn()
}))

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const mockedUseAuth = useAuth as jest.Mock
const mockedUseLogin = useLogin as jest.Mock

describe("Login Renders and functuonality tests", () => {

    test("redirects if Logged in", () => {

        mockedUseAuth.mockReturnValue({
            user: mockedUser
        })

        mockedUseLogin.mockReturnValue({
            CompleteLogin: jest.fn(),
            error: '',
            errorCode: null,
            resetError: jest.fn()
        })

        render(
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Home Page/i)).toBeInTheDocument()
    })

    test('Renders Login Form When User Not Logged In', () => {

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseLogin.mockReturnValue({
            CompleteLogin: jest.fn(),
            error: '',
            errorCode: null,
            resetError: jest.fn()
        })

        render(
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Login/i})).toBeInTheDocument()
    })

    test('Integration Test - Passes Correct Props To LoginForm', async () => {

        const CompleteLogin = jest.fn()
        const error = "Unknown"
        const errorCode = null
        const resetError = jest.fn()

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseLogin.mockReturnValue({
            CompleteLogin: CompleteLogin,
            error: error,
            errorCode: errorCode,
            resetError: resetError
        })

        render(
            <MemoryRouter>
                <Login/>
            </MemoryRouter>
        )

        expect(screen.getByText("Unknown")).toBeInTheDocument()

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const LoginButton = screen.getByRole("button", {name: /Login/i})

        await userEvent.type(usernameInput, "testUser")
        await userEvent.type(passwordInput, "thePassword123")

        await userEvent.click(LoginButton)

        expect(CompleteLogin).toHaveBeenCalledTimes(1);
        expect(CompleteLogin).toHaveBeenCalledWith("testUser", "thePassword123")

    })

    test("Error Renders Correctly When Error Exists", () => {
        
        const CompleteLogin = jest.fn()
        const error = ""
        const errorCode = 404
        const resetError = jest.fn()

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseLogin.mockReturnValue({
            CompleteLogin: CompleteLogin,
            error: error,
            errorCode: errorCode,
            resetError: resetError
        })

        render(
            <MemoryRouter>
                <Login/>
            </MemoryRouter>
        )

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
    })

    test("Error calls Reset on Error confirmation", async () => {
        
        const CompleteLogin = jest.fn()
        const error = ""
        const errorCode = 404
        const resetError = jest.fn()

        mockedUseAuth.mockReturnValue({
            user: null
        })

        mockedUseLogin.mockReturnValue({
            CompleteLogin: CompleteLogin,
            error: error,
            errorCode: errorCode,
            resetError: resetError
        })

        render(
            <MemoryRouter>
                <Login/>
            </MemoryRouter>
        )

        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
        await userEvent.click(screen.getByRole("button", { name: /warning understood confirmation/i }))
        expect(resetError).toHaveBeenCalledTimes(1)
    })

    test("Error does not Render when errorCode is Null", () => {
        mockedUseAuth.mockReturnValue({ user: null });

        mockedUseLogin.mockReturnValue({
            CompleteLogin: jest.fn(),
            error: "",
            errorCode: null,
            resetError: jest.fn()
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.queryByTestId("ErrorMessage")).not.toBeInTheDocument();
    });

})