import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import HomeNews from './HomeNews';
import { mockMarketNews } from '../../../mocks/Home/mockMarketNews';
import { marketNews } from '../../../types/types';

jest.mock('axios'); // mocks axios functions to test with edge cases without backend

jest.mock("../../../api/getMarketNews", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../../error/Error', () => () => <div>ErrorMock</div>);

function NewsRenderCheck(newsArray: marketNews[]) {
    newsArray.forEach((article, index) => {
        const formattedDate = new Date(article.datetime * 1000).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

        expect(screen.getByText(formattedDate)).toBeInTheDocument();
        expect(screen.getByText(article.headline)).toBeInTheDocument();
        expect(screen.getAllByAltText(article.source + " image")).toHaveLength(2);
        expect(screen.getByText(article.source)).toBeInTheDocument();
        expect(screen.getByText(article.summary)).toBeInTheDocument();
    });
}

function NewsNotRenderedCheck(newsArray: marketNews[]){
        newsArray.forEach(article => {
        expect(screen.queryByText(article.headline)).toBeNull();
        expect(screen.queryAllByAltText(article.source + " image")).toHaveLength(0);
        expect(screen.queryByText(article.source)).toBeNull();
        expect(screen.queryByText(article.summary)).toBeNull();
    });
}

const pageSize = 3

describe("Render News Correctly", () => {
    
    test("Empty Market News", () => {
        render(<HomeNews marketNews={[]}/>)
        expect(screen.getByText(/No News Found/i)).toBeInTheDocument()
        expect(screen.queryByText(/Today's News/i)).not.toBeInTheDocument()

    })

    test("Normal Market News", () => {
        render(<HomeNews marketNews={mockMarketNews}/>)
        expect(screen.getByText(/Today's News/i)).toBeInTheDocument()
        NewsRenderCheck(mockMarketNews.slice(0, pageSize))
    })

})

describe("Market News Functionality", () => {

    test("Right Arrow - Switch News", async () => {
        render(<HomeNews marketNews={mockMarketNews}/>)
        const rightArrow = screen.getByRole("button", { name: /Navigate right/i })
        await userEvent.click(rightArrow)
        NewsRenderCheck(mockMarketNews.slice(0+pageSize, 2*pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(0, pageSize))
    })

    test("Left Arrow - Switch News", async () => {
        render(<HomeNews marketNews={mockMarketNews}/>)
        const leftArrow = screen.getByRole("button", { name: /Navigate left/i })
        await userEvent.click(leftArrow)
        NewsRenderCheck(mockMarketNews.slice(mockMarketNews.length-pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(0, pageSize))
    })

    test("Multiple right clicks cycles correctly", async () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, 3*pageSize)}/>)

        const rightArrow = screen.getByRole("button", { name: /Navigate right/i })

        await userEvent.click(rightArrow)
        await userEvent.click(rightArrow)

        NewsRenderCheck(mockMarketNews.slice(2*pageSize, 3*pageSize))
    })

    test("No Arrows if Page Size is too small", () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, (pageSize-1 || 1))}/>)
        expect(screen.queryAllByRole('button')).toHaveLength(0)
    })

    test("All Render if News Array is less than Page Size", () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, (pageSize-1 || 1))}/>)
        NewsRenderCheck(mockMarketNews.slice(0, pageSize-1))
    })

    test("Right Arrow Loop Back", async () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, 2*pageSize)}/>)
        const rightArrow = screen.getByRole("button", { name: /Navigate right/i })
        await userEvent.click(rightArrow)
        NewsRenderCheck(mockMarketNews.slice(pageSize, 2*pageSize))
        await userEvent.click(rightArrow)
        NewsRenderCheck(mockMarketNews.slice(0, pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(pageSize, 2*pageSize))
    })

    test("Left Arrow Loop Back", async () => {
        render(<HomeNews marketNews={mockMarketNews.slice(0, 2*pageSize)}/>)
        const leftArrow = screen.getByRole("button", { name: /Navigate left/i })
        await userEvent.click(leftArrow)
        NewsRenderCheck(mockMarketNews.slice(pageSize, 2*pageSize))
        NewsNotRenderedCheck(mockMarketNews.slice(0, pageSize))
    })
})