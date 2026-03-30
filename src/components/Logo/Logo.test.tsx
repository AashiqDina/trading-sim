import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom';
import Logo from "./Logo";


describe("Renders Successfully", () => {

    test("Renders AiLoading", () => {
        render(<Logo/>)
        expect(screen.getByTestId("SiteLogo")).toBeInTheDocument();
    })
})