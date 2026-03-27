import { render, screen } from "@testing-library/react";
import HomeBurgerMenu from "./HomeBurgerMenu";
import { useAuth } from "../../../auth/AuthContext";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import { mockedUser } from "../../../mocks/Global/mockedUser";

jest.mock("../../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

function checkDropDown(){

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
}

describe("Renders Burger Correctly", () => {

    test("Renders when Menu is closed", () => {
        mockedUseAuth.mockReturnValue({
            user: null,
        });

        render(
        <MemoryRouter>
            <HomeBurgerMenu
            setMenuOpen={jest.fn()}
            menuOpen={false}
            handleLink={jest.fn()}
            />
        </MemoryRouter>
        );

        expect(screen.getByTestId("HeaderDropdown")).toHaveClass("DropdownMenuClose");
    });

    test("Renders when Menu is open - Logged ON", () => {
        mockedUseAuth.mockReturnValue({
            user: mockedUser,
            login: jest.fn(),
            logout: jest.fn()
        });

        render(
            <MemoryRouter>
            <HomeBurgerMenu
                setMenuOpen={jest.fn()}
                menuOpen={true}
                handleLink={jest.fn()}
            />
            </MemoryRouter>
        );

        expect(screen.getByTestId("HeaderDropdown")).toHaveClass("DropdownMenuOpen");
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        checkDropDown()
        expect(screen.getByText("Friends")).toBeInTheDocument()
        expect(screen.getByText("Portfolio")).toBeInTheDocument()

    });

    test("Renders when Menu is open - Logged Off", () => {
        mockedUseAuth.mockReturnValue({
            user: null
        })

        render(
            <MemoryRouter>
            <HomeBurgerMenu
                setMenuOpen={jest.fn()}
                menuOpen={true}
                handleLink={jest.fn()}
            />
            </MemoryRouter>
        );
        expect(screen.getByTestId("HeaderDropdown")).toHaveClass("DropdownMenuOpen");
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        checkDropDown();
        
    })
});