import { act, renderHook } from "@testing-library/react"
import "@testing-library/jest-dom"
import { jest } from "@jest/globals"
import AddFriend from "../../api/AddFriend"
import { useFriendsActions } from "./useFriendsActions"
import AcceptFriendRequest from "../../api/AcceptFriendRequest"
import DeclineFriendRequest from "../../api/DeclineFriendRequest"
import DeleteFriend from "../../api/DeleteFriend"
import { ApiError } from "../../error/ApiError"

jest.mock("../../api/AddFriend")    
const mockedAddFriend = jest.mocked(AddFriend)

jest.mock("../../api/AcceptFriendRequest")
const mockedAcceptFriendRequest = jest.mocked(AcceptFriendRequest)

jest.mock("../../api/DeclineFriendRequest")
const mockedDeclineFriendRequest = jest.mocked(DeclineFriendRequest)

jest.mock("../../api/DeleteFriend")
const mockedDeleteFriend = jest.mocked(DeleteFriend)

describe("useFriendActionsTests", () => {

    const refresh = jest.fn()

    test("SendFriendRequest calls correct function and also refreshes", async () => {

        mockedAddFriend.mockResolvedValue(undefined)

        const { result } = renderHook(() => useFriendsActions({ refresh })    )

        await act(async () => {
            await result.current.sendFriendRequest(3)
        })

        expect(mockedAddFriend).toHaveBeenCalledWith({friendId: 3})
        expect(refresh).toHaveBeenCalled()

    })

    test("handleAcceptRequests calls correct function and refreshes", async () => {

        mockedAcceptFriendRequest.mockResolvedValue(undefined)

        const { result } = renderHook(() => useFriendsActions({refresh}))

        await act(async () => {
            await result.current.handleAcceptRequest(5)
        })

        expect(mockedAcceptFriendRequest).toHaveBeenCalledWith({ friendId: 5 })
        expect(refresh).toHaveBeenCalled()
    })

    test("handlesDeclineRequests calls correct function and refreshes", async () => {

        mockedDeclineFriendRequest.mockResolvedValue(undefined)

        const { result } = renderHook(() =>  useFriendsActions({ refresh }))

        await act(async () => {
            await result.current.handleDeclineRequest(9)
        })

        expect(mockedDeclineFriendRequest).toHaveBeenCalledWith({friendId: 9})
        expect(refresh).toHaveBeenCalled()
    })

    test("handleDeleteFriend calls correct function and refreshes", async () => {

        mockedDeleteFriend.mockResolvedValue(undefined)

        const { result } = renderHook(() => useFriendsActions({ refresh }))

        await act(async () => {
            await result.current.handleDeleteFriend(33)
        })

        expect(mockedDeleteFriend).toHaveBeenCalledWith({ friendId: 33 })
        expect(refresh).toHaveBeenCalled()
        
    })

    test("handles known error correctly", async () => {

        mockedAcceptFriendRequest.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => useFriendsActions({ refresh }))

        await act(async () => { 
            await result.current.handleAcceptRequest(99)
        })

        expect(result.current.actionsError).toBe(404)
    })

    test("handles unknown error correctly", async () => {

        mockedDeleteFriend.mockRejectedValue(false)

        const { result } = renderHook(() => useFriendsActions({ refresh }))

        await act(async () => {
            await result.current.handleDeleteFriend(20)
        })

        expect(result.current.actionsError).toBe(-1)
    })

    test("Reset ActionError works correctly", async () => {

        mockedDeclineFriendRequest.mockRejectedValue(new ApiError(419))

        const { result } = renderHook(() => useFriendsActions({ refresh }))

        await act(async () => {
            await result.current.handleDeclineRequest(38)
        })

        expect(result.current.actionsError).toBe(419)

        mockedDeclineFriendRequest.mockClear()
        result.current.resetActionError()

        expect(mockedDeclineFriendRequest).not.toHaveBeenCalled()

    })

})