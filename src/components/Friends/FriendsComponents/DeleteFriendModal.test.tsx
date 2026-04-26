import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import DeleteFriendModal from "./DeleteFriendModal"
import { mockDeleteFriend } from "../../../mocks/Friends/mockDeleteFriend"
import userEvent from "@testing-library/user-event";

jest.mock("focus-trap-react", () => ({
    FocusTrap: ({ children }: any) => <div>{children}</div>
}));

describe("DeleteFriendModal Tests", () => {

    test("Renders correctly", () => {

        render(
            <DeleteFriendModal
                DeleteFriend={mockDeleteFriend}
                cancelDeleteFriend={jest.fn()}
                handleDeleteFriend={jest.fn()}
            />
        )

        expect(screen.getByText(`Are you sure you want to remove ${mockDeleteFriend.username}?`)).toBeInTheDocument()
        expect(screen.getByLabelText("Cancel")).toBeInTheDocument()
        expect(screen.getByLabelText(`Remove ${mockDeleteFriend.username}`)).toBeInTheDocument()
    })

    test("Falsey DeleteFriend returns nothing", () => {

        render(
            <DeleteFriendModal
                DeleteFriend={null}
                cancelDeleteFriend={jest.fn()}
                handleDeleteFriend={jest.fn()}
            />
        )

        expect(screen.queryByText(`Are you sure you want to remove ${mockDeleteFriend.username}?`)).not.toBeInTheDocument()
        expect(screen.queryByLabelText("Cancel")).not.toBeInTheDocument()
        expect(screen.queryByLabelText(`Remove ${mockDeleteFriend.username}`)).not.toBeInTheDocument()
    })

    test("Cancel Button calls correct function", async () => {

        const remove = jest.fn()
        const cancel = jest.fn()

        render(
            <DeleteFriendModal
                DeleteFriend={mockDeleteFriend}
                cancelDeleteFriend={cancel}
                handleDeleteFriend={remove}
            />
        )

        await userEvent.click(screen.getByLabelText("Cancel"))

        expect(cancel).toHaveBeenCalledTimes(1)
        expect(remove).not.toHaveBeenCalled()

    })

    test("Remove Button calls correct function", async () => {

        const remove = jest.fn()
        const cancel = jest.fn()

        render(
            <DeleteFriendModal
                DeleteFriend={mockDeleteFriend}
                cancelDeleteFriend={cancel}
                handleDeleteFriend={remove}
            />
        )

        await userEvent.click(screen.getByLabelText(`Remove ${mockDeleteFriend.username}`))

        expect(remove).toHaveBeenCalledWith(mockDeleteFriend.id)
        expect(cancel).toHaveBeenCalledTimes(1)

    })

})