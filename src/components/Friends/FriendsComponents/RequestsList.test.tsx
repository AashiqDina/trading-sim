import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import RequestsList from "./RequestsList"
import { mockRecReqList } from "../../../mocks/Friends/mockRecReqList"
import { mockSentRequLis } from "../../../mocks/Friends/mockSentReqList"
import userEvent from "@testing-library/user-event"

describe("RequestsList Tests", () => {

    test("Requests (Both Lists) renders correctly", () => {

        render(
            <RequestsList
                recReqList={mockRecReqList}
                sentReqList={mockSentRequLis}
                handleAcceptRequest={jest.fn()}
                handleDeclineRequest={jest.fn()}
            />
        )

        mockRecReqList.forEach(req => {
            expect(screen.getByText(req.username)).toBeInTheDocument()
        });
        expect(screen.getAllByText(/Accept/i)).toHaveLength(mockRecReqList.length)
        expect(screen.getAllByText(/Decline/i)).toHaveLength(mockRecReqList.length)

        mockSentRequLis.forEach(req => {
            expect(screen.getByText(req.username)).toBeInTheDocument()
        })
        expect(screen.getAllByText(/Pending/i)).toHaveLength(mockSentRequLis.length)

    })

    test("Renders received requests correctly", () => {

        render(
            <RequestsList
                recReqList={mockRecReqList}
                sentReqList={[]}
                handleAcceptRequest={jest.fn()}
                handleDeclineRequest={jest.fn()}
            />
        )

        mockRecReqList.forEach(req => {
            expect(screen.getByText(req.username)).toBeInTheDocument()
        })

        expect(screen.getAllByRole("button", { name: /Accept/i }))
            .toHaveLength(mockRecReqList.length)

        expect(screen.getAllByRole("button", { name: /Decline/i }))
            .toHaveLength(mockRecReqList.length)
    })

    test("Renders sent requests correctly", () => {

        render(
            <RequestsList
                recReqList={[]}
                sentReqList={mockSentRequLis}
                handleAcceptRequest={jest.fn()}
                handleDeclineRequest={jest.fn()}
            />
        )

        mockSentRequLis.forEach(req => {
            expect(screen.getByText(req.username)).toBeInTheDocument()
        })

        expect(screen.getAllByText(/Pending/i))
            .toHaveLength(mockSentRequLis.length)

        expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })

    test("Accept and Decline Button calls correct function", async () => {

        const acc = jest.fn()
        const dec = jest.fn()
                
        render(
            <RequestsList
                recReqList={mockRecReqList}
                sentReqList={mockSentRequLis}
                handleAcceptRequest={acc}
                handleDeclineRequest={dec}
            />
        )

        await userEvent.click(screen.getAllByText(/Accept/i)[0])

        expect(acc).toHaveBeenCalledWith(mockRecReqList[0].friendsUserId)
        expect(dec).not.toHaveBeenCalled()

        await userEvent.click(screen.getAllByText(/Decline/i)[0])

        expect(dec).toHaveBeenCalledWith(mockRecReqList[0].friendsUserId)

    })

    test("Renders empty state correctly", () => {
        render(
            <RequestsList
            recReqList={[]}
            sentReqList={[]}
            handleAcceptRequest={jest.fn()}
            handleDeclineRequest={jest.fn()}
            />
        )

        expect(screen.queryByRole("button")).not.toBeInTheDocument()
        })
})