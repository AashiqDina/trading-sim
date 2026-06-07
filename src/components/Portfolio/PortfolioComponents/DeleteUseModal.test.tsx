import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DeleteUserModal from "./DeleteUserModal";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock("focus-trap-react", () => ({
  __esModule: true,
  FocusTrap: ({ children }: any) => <>{children}</>
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../../hooks/logout/useLogout", () => ({
    useLogout: () => mockLogout,
}));

describe("DeleteUserModal", () => {

    const mockCancelDelete = jest.fn();
    const mockHandleDeleteUser = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Renders text and buttons", () => {
        
        render(
            <BrowserRouter>
                <DeleteUserModal
                    cancelDelete={mockCancelDelete}
                    handleDeleteUser={mockHandleDeleteUser}
                />
            </BrowserRouter>
        );

        expect(screen.getByText(/Type "DELETE ACCOUNT" exactly/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /delete stock/i })).toBeInTheDocument();

    });

    test("Calls cancelDelete when cancel is clicked", async () => {

        render(
            <BrowserRouter>
                <DeleteUserModal
                    cancelDelete={mockCancelDelete}
                    handleDeleteUser={mockHandleDeleteUser}
                />
            </BrowserRouter>
        );

        await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(mockCancelDelete).toHaveBeenCalledTimes(1);

    });

    test("Calls handleDeleteUser with confirmation set to false if input is incorrect", async () => {

        mockHandleDeleteUser.mockResolvedValue(false);

        render(
            <BrowserRouter>
                <DeleteUserModal
                    cancelDelete={mockCancelDelete}
                    handleDeleteUser={mockHandleDeleteUser}
                />
            </BrowserRouter>
        );

        await userEvent.type(screen.getByPlaceholderText(/DELETE ACCOUNT/i),"wrong input");
        await userEvent.click(screen.getByRole("button", { name: /delete stock/i }));

        await waitFor(() => {
            expect(mockHandleDeleteUser).toHaveBeenCalledWith(false);
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockLogout).not.toHaveBeenCalled();
    });

    test("Calls handleDeleteUser with confirmation set to true if input is correct", async () => {

        const user = userEvent.setup();

        mockHandleDeleteUser.mockResolvedValue(true);

        render(
            <BrowserRouter>
                <DeleteUserModal
                    cancelDelete={mockCancelDelete}
                    handleDeleteUser={mockHandleDeleteUser}
                />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText(/DELETE ACCOUNT/i), "DELETE ACCOUNT");
        await user.click(screen.getByRole("button", { name: /delete stock/i }));

        await waitFor(() => {
            expect(mockHandleDeleteUser).toHaveBeenCalledWith(true);
        });

        expect(mockNavigate).toHaveBeenCalledWith("/");
        expect(mockLogout).toHaveBeenCalled();
    });

    test("does not navigate or logout if delete fails", async () => {

        const user = userEvent.setup();

        mockHandleDeleteUser.mockResolvedValue(false);

        render(
            <BrowserRouter>
                <DeleteUserModal
                    cancelDelete={mockCancelDelete}
                    handleDeleteUser={mockHandleDeleteUser}
                />
            </BrowserRouter>
        );

        await user.type(screen.getByPlaceholderText(/DELETE ACCOUNT/i), "DELETE ACCOUNT");
        await user.click(screen.getByRole("button", { name: /delete stock/i }));

        await waitFor(() => {expect(mockHandleDeleteUser).toHaveBeenCalled();});

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockLogout).not.toHaveBeenCalled();
    });

});