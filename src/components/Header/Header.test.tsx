import { render, screen } from "@testing-library/react"
import Header from "./Header"
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import userEvent from "@testing-library/user-event";
import { mockedUser } from "../../mocks/Global/mockedUser";


jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;


describe("Renders Correctly and Functions as Intended", () => {
    

    test("Renders Logo and Logo Calls navigate function", async () => {
        
        mockedUseAuth.mockReturnValue({
            user: null,
        });

        render(
            <MemoryRouter initialEntries={["/about"]}>
                <Header />
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/about" element={<div>About Page</div>} />
                </Routes>
            </MemoryRouter>
        )
        expect(screen.getByTestId("SiteLogo")).toBeInTheDocument()
        await userEvent.click(screen.getByTestId("SiteLogo"))

        expect(screen.getByText("Home Page")).toBeInTheDocument();
    })

    test ("Logged In - Button Renders and Navigates Correctly", async () => {

        mockedUseAuth.mockReturnValue({
            user: mockedUser,
            login: jest.fn(),
            logout:  jest.fn()
        });

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Header />
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/portfolio" element={<div>Portfolio Page</div>} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        )


        expect(screen.getByRole("button", { name: /click here to visit your portfolio/i})).toBeInTheDocument()
        expect(screen.queryByAltText("Icon for a user that is not logged in")).not.toBeInTheDocument()
        await userEvent.click(screen.getByText(mockedUser.username))
        expect(screen.getByText("Portfolio Page")).toBeInTheDocument()

    })

    test ("Logged Out - Button Renders and Navigates Correctly", async () => {

        mockedUseAuth.mockReturnValue({
            user: null,
        });

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Header />
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/portfolio" element={<div>Portfolio Page</div>} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByTestId("HeaderLoginButton")).toBeInTheDocument()
        await userEvent.click(screen.getByTestId("HeaderLoginButton"))
        expect(screen.getByText("Login Page")).toBeInTheDocument()

    })

    test("Username Button Navigates on Enter key", async () => {
        mockedUseAuth.mockReturnValue({
            user: mockedUser,
            login: jest.fn(),
            logout: jest.fn()
        });

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Header />
                <Routes>
                    <Route path="/portfolio" element={<div>Portfolio Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        const userButton = screen.getByRole("button", { name: /click here to visit your portfolio/i});
        userButton.focus();
        await userEvent.keyboard("{Enter}");
        expect(screen.getByText("Portfolio Page")).toBeInTheDocument();
    });
})