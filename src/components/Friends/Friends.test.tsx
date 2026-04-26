import { render, screen } from "@testing-library/react"
import { useAuth } from "../../auth/AuthContext";
import '@testing-library/jest-dom';
import { mockedUser } from "../../mocks/Global/mockedUser";
import Friends from "./Friends";
import { mockUseFriendsHook } from "../../mocks/Friends/mockUseFriends";
import { mockUseFriendsActionsHook } from "../../mocks/Friends/mockUseFriendsActions";

const mockedUseAuth = useAuth as jest.Mock;
const mockUseFriends = jest.fn();
const mockUseFriendsActions = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../hooks/useFriends", () => ({
  useFriends: (args: any) => mockUseFriends(args),
}));

jest.mock("../../hooks/useFriendsActions", () => ({
  useFriendsActions: (args: any) => mockUseFriendsActions(args),
}));

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: any) => <div>{children}</div>
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Friends Tests", () => {

    const mockRefresh = jest.fn()
    const mockResetError = jest.fn()


    beforeEach(() => {
        mockedUseAuth.mockReturnValue({
            user: mockedUser,
            login: jest.fn(),
            logout: jest.fn()
        });

        mockUseFriends.mockReturnValue({
            ...mockUseFriendsHook(),
            refresh: mockRefresh,
            resetError: mockResetError
        });

        mockUseFriendsActions.mockReturnValue({
            ...mockUseFriendsActionsHook(),

        })
    })

    test('Loading renders correctly', () => {

        mockUseFriends.mockReturnValue({
            ...mockUseFriendsHook(),
            loading: true,
            refresh: mockRefresh,
            resetError: mockResetError
        });

        render(
            <Friends/>
        )

        expect(screen.getByTestId("loading")).toBeInTheDocument()
        expect(screen.queryByText(/search for a friend/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/Friends/i)).not.toBeInTheDocument()
        expect(screen.queryByTestId("ErrorMessage")).not.toBeInTheDocument()
        expect(screen.queryByText(/Requests/i)).not.toBeInTheDocument()
        
    })

    test('Data Error loads only error', () => {

        mockUseFriends.mockReturnValue({
            ...mockUseFriendsHook(),
            error: 404,
            refresh: mockRefresh,
            resetError: mockResetError
        });

        render(
            <Friends/>
        )

        expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
        expect(screen.queryByText(/Friends/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/Requests/i)).not.toBeInTheDocument()

    })

    test("Renders correctly", () => {

        render(
            <Friends/>
        )

        expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
        expect(screen.queryByTestId("ErrorMessage")).not.toBeInTheDocument()
        expect(screen.getByLabelText(/search for a friend/i)).toBeInTheDocument()
        expect(screen.getByText(/Friends/i)).toBeInTheDocument()
        expect(screen.getByText(/Requests/i)).toBeInTheDocument()
    })

    test("Action Error is Loaded Correctly", () => {

        mockUseFriendsActions.mockReturnValue({
            ...mockUseFriendsActionsHook(),
            actionsError: 404,
        })

        render(
            <Friends/>
        )

        expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
        expect(screen.getByTestId("ErrorMessage")).toBeInTheDocument()
        expect(screen.getByText(/Friends/i)).toBeInTheDocument()
        expect(screen.getByText(/Requests/i)).toBeInTheDocument()
        
    })
})