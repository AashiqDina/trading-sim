import { act, render, screen } from "@testing-library/react"
import '@testing-library/jest-dom';
import Loading from "./Loading";

describe("Renders Loading Content and Functions Correctly", () => {

    test("Renders Correctly", () => {
        render(<Loading/>)
        
        const Load = screen.getByRole("status");

        expect(Load).toBeInTheDocument();
        expect(Load).toHaveAttribute("aria-label", "Loading Content");
        expect(Load).toHaveAttribute("aria-live", "polite");
        expect(screen.queryByText(/this app uses on-demand hosting/i)).not.toBeVisible()
    })

    test("Renders Correctly After 5 Seconds", () => {
        jest.useFakeTimers();

        render(<Loading/>);
        const message = screen.getByText(/this app uses on-demand hosting/i);
        expect(message).not.toBeVisible();

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(message).toBeVisible();
    })

    test("Scale Makes Loading message to Not Appear", () => {
        jest.useFakeTimers();

        render(<Loading scale={2}/>);
        const message = screen.getByText(/this app uses on-demand hosting/i);
        expect(message).not.toBeVisible();

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(message).not.toBeVisible();
    })
})