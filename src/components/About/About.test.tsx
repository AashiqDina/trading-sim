import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from './About';

const bodyText = 'This Stock Trading Simulator is a simplified stock portfolio management system that replicates key investment functionalities to help users experiment with investing. I independently designed and coded every part of this project, from the UI layout to the backend logic, as a hands-on learning exercise to strengthen my understanding of the technologies used. All icons, logos, and visuals were also created by me. While it may not be perfect, I genuinely enjoyed building it and experimenting with new ideas throughout the process.'

describe("Components Renders Correctly", () => {
    test("On-Screen Text Renders Correctly", () => {
        render(<About/>)
        expect(screen.getByText(/About/i)).toBeInTheDocument()
        expect(screen.getByText(bodyText)).toBeInTheDocument()
    })
})