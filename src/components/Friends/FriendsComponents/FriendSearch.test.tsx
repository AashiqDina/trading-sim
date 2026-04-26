import { queryByTestId, render, screen, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import FriendsSearch from "./FriendsSearch"
import { mockUserList } from "../../../mocks/Friends/mockUserList"
import { mockFriendList } from "../../../mocks/Friends/mockFriendList"
import { mockSentRequLis } from "../../../mocks/Friends/mockSentReqList"
import { mockRecReqList } from "../../../mocks/Friends/mockRecReqList"
import { MemoryRouter } from "react-router"
import userEvent from "@testing-library/user-event"

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Friend Search Tests", () => {

    test("Renders Input Correctly", () => {

        render(
            <MemoryRouter>
                <FriendsSearch
                    userList={mockUserList}
                    userId={1}
                    friendsList={mockFriendList}
                    sentReqList={mockSentRequLis}
                    recReqList={mockRecReqList}
                    sendFriendRequest={jest.fn()}
                />
            </MemoryRouter>
        )

        expect(screen.getByLabelText(/search for a friend/i)).toBeInTheDocument()
    })

    test("Renders Suggestions Correctly", async () => {
                
        render(
            <MemoryRouter>
                <FriendsSearch
                    userList={mockUserList}
                    userId={1}
                    friendsList={mockFriendList}
                    sentReqList={mockSentRequLis}
                    recReqList={mockRecReqList}
                    sendFriendRequest={jest.fn()}
                />
            </MemoryRouter>
        )

        const input = screen.getByLabelText(/search for a friend/i)

        await userEvent.type(input, mockUserList[0].username.slice(0,3)) // current user doesnt appear in search
        expect(screen.queryByText(mockUserList[0].username)).not.toBeInTheDocument()

        await userEvent.clear(input)

        await userEvent.type(input, mockFriendList[0].username.slice(0,3))
        expect(screen.getByText(mockFriendList[0].username)).toBeInTheDocument()
        expect(screen.getByText(/Friend/i)).toBeInTheDocument()

        await userEvent.clear(input)

        await userEvent.type(input, mockSentRequLis[0].username.slice(0,2))
        expect(screen.getByText(mockSentRequLis[0].username))
        expect(screen.getByText(/pending/i))

        await userEvent.clear(input)

        await userEvent.type(input, mockRecReqList[0].username.slice(0,2))
        expect(screen.getByText(mockRecReqList[0].username))
        expect(screen.getByText(/Pending Accept\/Decline/i))

        await userEvent.clear(input)

        await userEvent.type(input, mockUserList[1].username.slice(0,3))
        expect(screen.getByText(mockUserList[1].username)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: `Send ${mockUserList[1].username} a Friend Request`}))

    })

    test("No input shows no suggestions", () => {

        render(
            <MemoryRouter>
                <FriendsSearch
                    userList={mockUserList}
                    userId={1}
                    friendsList={mockFriendList}
                    sentReqList={mockSentRequLis}
                    recReqList={mockRecReqList}
                    sendFriendRequest={jest.fn()}
                />
            </MemoryRouter>
        )

        expect(screen.queryByTestId("UserFriendSuggestions")).not.toBeInTheDocument()
    })

    test("No input shows no suggestions", async () => {

        render(
            <MemoryRouter>
                <FriendsSearch
                    userList={mockUserList}
                    userId={1}
                    friendsList={mockFriendList}
                    sentReqList={mockSentRequLis}
                    recReqList={mockRecReqList}
                    sendFriendRequest={jest.fn()}
                />
            </MemoryRouter>
        )

        const input = screen.getByLabelText(/search for a friend/i)

        await userEvent.type(input, 'abc123zyx987')

        expect(screen.queryByTestId("UserFriendSuggestions")).not.toBeInTheDocument()
    })

    test("Send Friend Requests calls correct function", async () => {

        const sendReq = jest.fn()

        render(
            <MemoryRouter>
                <FriendsSearch
                    userList={mockUserList}
                    userId={1}
                    friendsList={mockFriendList}
                    sentReqList={mockSentRequLis}
                    recReqList={mockRecReqList}
                    sendFriendRequest={sendReq}
                />
            </MemoryRouter>
        )

        const input = screen.getByLabelText(/search for a friend/i)

        await userEvent.type(input, mockUserList[1].username.slice(0,3))
        await userEvent.click(screen.getByRole("button", { name: `Send ${mockUserList[1].username} a Friend Request`}))

        expect(sendReq).toHaveBeenCalledWith(mockUserList[1].id)
    })

    test("Navigates on clicking friend", async () => {
  
        render(
            <MemoryRouter>
                <FriendsSearch
                    userList={mockUserList}
                    userId={1}
                    friendsList={mockFriendList}
                    sentReqList={mockSentRequLis}
                    recReqList={mockRecReqList}
                    sendFriendRequest={jest.fn()}
                />
            </MemoryRouter>
        )
        

        const input = screen.getByLabelText(/search for a friend/i)
        await userEvent.type(input, mockFriendList[0].username.slice(0,3))

        await userEvent.click(screen.getByTestId("FriendForSearchSugg"))

        expect(mockNavigate).toHaveBeenCalledWith(`/portfolio/${mockFriendList[0].username}/${mockFriendList[0].friendsUserId}`)

    })

    test("Clicking outside clears input and hides suggestions", async () => {
        render(
            <MemoryRouter>
                <FriendsSearch
                    userList={mockUserList}
                    userId={1}
                    friendsList={mockFriendList}
                    sentReqList={mockSentRequLis}
                    recReqList={mockRecReqList}
                    sendFriendRequest={jest.fn()}
                />
            </MemoryRouter>
        )

        const input = screen.getByLabelText(/search for a friend/i)

        await userEvent.type(input, mockUserList[1].username)
        expect(input).toHaveValue(mockUserList[1].username)
        expect(screen.getByText(mockUserList[1].username)).toBeInTheDocument()

        await userEvent.click(document.body)

        expect(input).toHaveValue("")
        expect(screen.queryByText(mockUserList[1].username)).not.toBeInTheDocument()
    })
})