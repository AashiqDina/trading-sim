import { mockFriendList } from "./mockFriendList"
import { mockProfitLossMap } from "./mockProfitLossMap"
import { mockRecReqList } from "./mockRecReqList"
import { mockSentRequLis } from "./mockSentReqList"
import { mockUserList } from "./mockUserList"

export const mockUseFriendsHook = () => {

    return {
        loading: false,
        error: null,
        userList: mockUserList,
        friendsList: mockFriendList,
        profitLossMap: mockProfitLossMap,
        sentReqList: mockSentRequLis,
        recReqList: mockRecReqList,
        refresh: () => {},
        resetError: () => {},
    }
}