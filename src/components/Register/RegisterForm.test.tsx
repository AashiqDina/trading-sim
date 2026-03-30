import { render, screen } from "@testing-library/react"
import RegisterForm from "./RegisterForm"
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";

describe("Register Form Renders and Functions", () => {

    test("Components Render Fine", () => {
        render(<RegisterForm
                error={""}
                CompleteRegister={jest.fn()}
              />)
        expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Confirm your password/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Submit and Create account/i})).toBeInTheDocument()
    })

    test('Inputs Input Correctly', async () => {
        render(<RegisterForm
            error={""}
            CompleteRegister={jest.fn()}
        />)
        
        const usernameInput = screen.getByPlaceholderText(/Enter your username/i)
        const passwordInput = screen.getByPlaceholderText(/Enter your password/i)
        const confirmPasswordInput = screen.getByPlaceholderText(/Confirm your password/i)


        await userEvent.type(usernameInput, "testUser")
        await userEvent.type(passwordInput, "thePassword123")
        await userEvent.type(confirmPasswordInput, "Password12")

        expect(usernameInput).toHaveValue("testUser")
        expect(passwordInput).toHaveValue("thePassword123")
        expect(confirmPasswordInput).toHaveValue("Password12")

    })

    test('calls CompleteRegister and submits form with correct values on submit', async () => {

        const CompRegister = jest.fn()

        render(<RegisterForm
            error={""}
            CompleteRegister={CompRegister}
        />)

        const usernameInput = screen.getByPlaceholderText(/Enter your username/i)
        const passwordInput = screen.getByPlaceholderText(/Enter your password/i)
        const confirmPasswordInput = screen.getByPlaceholderText(/Confirm your password/i)
        const RegisterButton = screen.getByRole("button", { name: /Submit and Create account/i})

        await userEvent.type(usernameInput, "testUser")
        await userEvent.type(passwordInput, "thePassword123")
        await userEvent.type(confirmPasswordInput, "Password12")

        await userEvent.click(RegisterButton)

        expect(CompRegister).toHaveBeenCalledTimes(1);
        expect(CompRegister).toHaveBeenCalledWith("testUser", "thePassword123", "Password12")
        
    })

    test('Error shows Register Failed', async () => {

        const CompRegister = jest.fn()
        const InvError = "Passwords Do Not Match"

        render(<RegisterForm
            error={InvError}
            CompleteRegister={CompRegister}
        />)

        expect(screen.getByText(InvError)).toBeInTheDocument()

    })

    test("Calls CompleteRegister and submits form When Pressing Enter", async () => {
        const CompRegister = jest.fn();

        render(<RegisterForm error="" CompleteRegister={CompRegister} />);

        const usernameInput = screen.getByPlaceholderText(/Enter your username/i)
        const passwordInput = screen.getByPlaceholderText(/Enter your password/i)
        const confirmPasswordInput = screen.getByPlaceholderText(/Confirm your password/i)

        await userEvent.type(usernameInput, "testUser")
        await userEvent.type(passwordInput, "thePassword123")
        await userEvent.type(confirmPasswordInput, "Password12{enter}")

        expect(CompRegister).toHaveBeenCalledTimes(1);
        expect(CompRegister).toHaveBeenCalledWith("testUser", "thePassword123", "Password12");
    });
})