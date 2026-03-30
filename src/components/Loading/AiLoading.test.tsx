import { render, screen } from "@testing-library/react"
import AiLoading from "./AiLoading"
import '@testing-library/jest-dom';


describe("Renders Successfully", () => {

    test("Renders AiLoading", () => {
        render(<AiLoading/>)
        const AiLoad = screen.getByRole("status");

        expect(AiLoad).toBeInTheDocument();
        expect(AiLoad).toHaveAttribute("aria-label", "Loading Content");
        expect(AiLoad).toHaveAttribute("aria-live", "polite");
    })
})