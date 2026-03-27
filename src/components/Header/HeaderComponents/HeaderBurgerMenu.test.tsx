import { render, screen } from "@testing-library/react";
import HeaderBurgerMenu from "./HeaderBurgerMenu";
import { useAuth } from "../../../auth/AuthContext";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import { mockedUser } from "../../../mocks/Global/mockedUser";
import userEvent from "@testing-library/user-event";

jest.mock("../../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

function checkDropDown(){

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
}

describe("Renders Burger Correctly and Functions Correctly", () => {

    test("Renders when Menu is closed", () => {
        mockedUseAuth.mockReturnValue({
            user: null,
        });

        render(
        <MemoryRouter>
            <HeaderBurgerMenu
            setMenuOpen={jest.fn()}
            menuOpen={false}
            handleLink={jest.fn()}
            />
        </MemoryRouter>
        );

        expect(screen.getByTestId("HeaderDropdown")).toHaveClass("DropdownMenuClose");
    });

    test("Renders when Menu is open - Logged ON and Navigates", async () => {

        const logout = jest.fn();
        const closeMenu = jest.fn();

        mockedUseAuth.mockReturnValue({
            user: mockedUser,
            login: jest.fn(),
            logout
        });

        render(
            <MemoryRouter>
                <HeaderBurgerMenu
                    setMenuOpen={closeMenu}
                    menuOpen={true}
                    handleLink={jest.fn()}
                />
            </MemoryRouter>
        );

        expect(screen.getByTestId("HeaderDropdown")).toHaveClass("DropdownMenuOpen");
        checkDropDown()
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        expect(screen.getByText("Friends")).toBeInTheDocument();
        expect(screen.getByText("Portfolio")).toBeInTheDocument();
        await userEvent.click(screen.getByText(/Logout/i));
        expect(logout).toHaveBeenCalled();
        expect(closeMenu).toHaveBeenCalled();
    });

    test("Renders when Menu is open - Logged Off and Navigates", async () => {

        const closeMenu = jest.fn();

        mockedUseAuth.mockReturnValue({
            user: null
        })

        const handleLink = jest.fn();

        render(
            <MemoryRouter>
            <HeaderBurgerMenu
                setMenuOpen={closeMenu}
                menuOpen={true}
                handleLink={handleLink}
            />
            </MemoryRouter>
        );
        expect(screen.getByTestId("HeaderDropdown")).toHaveClass("DropdownMenuOpen");
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        checkDropDown();
        await userEvent.click(screen.getByText(/Login/i))
        expect(handleLink).toHaveBeenCalledWith("/login")
    })

    test("Calls handleLink when a Nav Item is Clicked", async () => {
        mockedUseAuth.mockReturnValue({
            user: null
        })
        const handleLink = jest.fn();
        const closeMenu = jest.fn();

        render(
            <MemoryRouter>
            <HeaderBurgerMenu
                setMenuOpen={closeMenu}
                menuOpen={true}
                handleLink={handleLink}
            />
            </MemoryRouter>
        );

        await userEvent.click(screen.getByText("Home"));
        expect(handleLink).toHaveBeenCalledWith("/");
        await userEvent.click(screen.getByText("About"));
        expect(handleLink).toHaveBeenCalledWith("/about");
    });
});