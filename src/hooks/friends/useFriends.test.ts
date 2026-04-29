import { renderHook, waitFor } from "@testing-library/react"
import { useFriends } from "./useFriends"
import getAllUsers from "../../api/getAllUsers"
import getFriends from "../../api/getFriends"
import getSentRequests from "../../api/getSentRequests"
import getReceivedRequests from "../../api/getReceivedRequests"
import { mockUserList } from "../../mocks/Friends/mockUserList"
import { mockFriendList } from "../../mocks/Friends/mockFriendList"
import { mockSentRequLis } from "../../mocks/Friends/mockSentReqList"
import { mockRecReqList } from "../../mocks/Friends/mockRecReqList"
import { ApiError } from "../../error/ApiError"

jest.mock("../../api/getAllUsers")
jest.mock("../../api/getFriends")
jest.mock("../../api/getSentRequests")
jest.mock("../../api/getReceivedRequests")

const mockedGetAllUsers = jest.mocked(getAllUsers)
const mockedGetFriends = jest.mocked(getFriends)
const mockedGetSentRequests = jest.mocked(getSentRequests)
const mockedGetReceivedRequests = jest.mocked(getReceivedRequests)

describe("useFriends Hook Tests", () => {

    test("All data is fetched correctly", async () => {

        mockedGetAllUsers.mockResolvedValue(mockUserList)
        mockedGetFriends.mockResolvedValue(mockFriendList)
        mockedGetSentRequests.mockResolvedValue(mockSentRequLis)
        mockedGetReceivedRequests.mockResolvedValue(mockRecReqList)

        const { result } = renderHook(() => useFriends({ userId: 1 }))
 
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.userList).toEqual(mockUserList)
        expect(result.current.friendsList).toEqual(mockFriendList)
        expect(result.current.sentReqList).toEqual(mockSentRequLis)
        expect(result.current.recReqList).toEqual(mockRecReqList)
        expect(result.current.error).toBeNull()
    })

    test("Sets error when API throws error", async () => {

        mockedGetAllUsers.mockRejectedValue(new ApiError(404))

        const { result } = renderHook(() => useFriends({ userId: 1 }))

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe(404)

    })

    test("Sets error to -1 when not ApiError", async () => {

        mockedGetFriends.mockRejectedValue(new Error("should set err to -1"))

        const { result } = renderHook(() => useFriends({ userId: 1 }))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.error).toBe(-1)
    })

    test("ResetError removes the error from the screen", async () => {

        mockedGetReceivedRequests.mockRejectedValue(new ApiError(419))

        const { result } = renderHook(() => useFriends({ userId: 1 }))

        await waitFor(() => {
            expect(result.current.error).toBe(419)
        })

        result.current.resetError()

        await waitFor(() => {
            expect(result.current.error).toBeNull()
        })
    })

    test("Refresh re-calls APIs", async () => {

        mockedGetAllUsers.mockResolvedValue(mockUserList)
        mockedGetFriends.mockResolvedValue(mockFriendList)
        mockedGetSentRequests.mockResolvedValue(mockSentRequLis)
        mockedGetReceivedRequests.mockResolvedValue(mockRecReqList)

        const { result } = renderHook(() => useFriends({ userId: 1 }))

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        mockedGetAllUsers.mockClear()

        result.current.refresh()

        expect(mockedGetAllUsers).toHaveBeenCalled()

    })

    test("No user doesnt call APIs", () => {

        renderHook(() => useFriends({ userId: undefined}))

        expect(mockedGetAllUsers).not.toHaveBeenCalled()
    })


})