import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ActiveFriends from "./ActiveFriends"
import { mockFriendList } from "../../../mocks/Friends/mockFriendList"
import { mockProfitLossMap } from "../../../mocks/Friends/mockProfitLossMap"
import { MemoryRouter } from "react-router"
import userEvent from "@testing-library/user-event"

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: any) => <div>{children}</div>
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Active Friends List Tests", () => {

    test("Renders Correctly", async () => {

        render(
            <MemoryRouter>
                <ActiveFriends
                    friendsList={mockFriendList}
                    profitLossMap={mockProfitLossMap}
                    handleDeleteFriend={jest.fn}
                />
            </MemoryRouter>
        )

        expect(screen.getByText(/Friends/i)).toBeInTheDocument()
        mockFriendList.forEach(friend => {
            expect(screen.getByText(friend.username)).toBeInTheDocument()
            expect(screen.getByLabelText(`Remove ${friend.username} as a friend`))
            if(friend.profitLoss >= 0){
                expect(screen.getByText(`+£${friend.profitLoss.toFixed(2)}`)).toBeInTheDocument()
            }
            else{
                expect(screen.getByText(`-£${Math.abs(friend.profitLoss).toFixed(2)}`)).toBeInTheDocument()
            }
        });
    })

    test("Renders correctly without friends", () => {

        render(
            <MemoryRouter>
                <ActiveFriends
                    friendsList={[]}
                    profitLossMap={new Map<number, number>()}
                    handleDeleteFriend={jest.fn}
                />
            </MemoryRouter>
        )

        expect(screen.getByText(/No Friends/i)).toBeInTheDocument()

    })

    test("Clicking friend navigates user", async () => {

        render(
            <MemoryRouter>
                <ActiveFriends
                    friendsList={mockFriendList}
                    profitLossMap={mockProfitLossMap}
                    handleDeleteFriend={jest.fn}
                />
            </MemoryRouter>
        )

        const friends = screen.getAllByTestId("friendInstance")

        await userEvent.click(friends[0])

        expect(mockNavigate).toHaveBeenCalledWith(`/portfolio/${mockFriendList[0].username}/${mockFriendList[0].friendsUserId}`);

    })

    test("FriendToDeleteModal shows when deleting friends", async () => {

        render(
            <MemoryRouter>
                <ActiveFriends
                    friendsList={mockFriendList}
                    profitLossMap={mockProfitLossMap}
                    handleDeleteFriend={jest.fn()}
                />
            </MemoryRouter>
        )

        await userEvent.click(screen.getByLabelText(`Remove ${mockFriendList[0].username} as a friend`))
        expect(screen.getByText(`Are you sure you want to remove ${mockFriendList[0].username}?`)).toBeInTheDocument()

    })

    test("Clicking Delete calls correct funcion with correct variables", async () => {
        
        const del = jest.fn()

        render(
            <MemoryRouter>
                <ActiveFriends
                    friendsList={mockFriendList}
                    profitLossMap={mockProfitLossMap}
                    handleDeleteFriend={del}
                />
            </MemoryRouter>
        )

        await userEvent.click(screen.getByLabelText(`Remove ${mockFriendList[0].username} as a friend`))
        await userEvent.click(screen.getByLabelText(`Remove ${mockFriendList[0].username}`))
        
        expect(del).toHaveBeenCalledWith(mockFriendList[0].friendsUserId)

    })

    test("FriendToDeleteModal closes when cancel deleting friends", async () => {

        render(
            <MemoryRouter>
                <ActiveFriends
                    friendsList={mockFriendList}
                    profitLossMap={mockProfitLossMap}
                    handleDeleteFriend={jest.fn()}
                />
            </MemoryRouter>
        )

        await userEvent.click(screen.getByLabelText(`Remove ${mockFriendList[0].username} as a friend`))
        expect(screen.getByText(`Are you sure you want to remove ${mockFriendList[0].username}?`)).toBeInTheDocument()
        await userEvent.click(screen.getByLabelText(`Cancel`))
        expect(screen.queryByText(`Are you sure you want to remove ${mockFriendList[0].username}?`)).not.toBeInTheDocument()

    })

    test("Clicking delete does NOT nav", async () => {

        render(
            <MemoryRouter>
                <ActiveFriends
                    friendsList={mockFriendList}
                    profitLossMap={mockProfitLossMap}
                    handleDeleteFriend={jest.fn}
                />
            </MemoryRouter>
        )

        await userEvent.click(screen.getByLabelText(`Remove ${mockFriendList[0].username} as a friend`))

        expect(mockNavigate).not.toHaveBeenCalled();

    })
})