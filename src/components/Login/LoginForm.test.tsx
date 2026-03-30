import { fireEvent, render, screen } from "@testing-library/react"
import LoginForm from "./LoginForm"
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Login from "./Login";

describe("Login Form Renders and Functions", () => {

    test("Components Render Fine", () => {
        render(<LoginForm
                error={""}
                CompleteLogin={jest.fn()}
              />)
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Login/i})).toBeInTheDocument()
    })

    test('Inputs Input Correctly', async () => {
        render(<LoginForm
            error={""}
            CompleteLogin={jest.fn()}
        />)
        
        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)

        await userEvent.type(usernameInput, "testUser")
        await userEvent.type(passwordInput, "thePassword123")

        expect(usernameInput).toHaveValue("testUser")
        expect(passwordInput).toHaveValue("thePassword123")
    })

    test('calls CompleteLogin and submits form with correct values on submit', async () => {

        const CompLogin = jest.fn()

        render(<LoginForm
            error={""}
            CompleteLogin={CompLogin}
        />)

        const usernameInput = screen.getByLabelText(/username/i)
        const passwordInput = screen.getByLabelText(/password/i)
        const LoginButton = screen.getByRole("button", {name: /Login/i})

        await userEvent.type(usernameInput, "testUser")
        await userEvent.type(passwordInput, "thePassword123")

        await userEvent.click(LoginButton)

        expect(CompLogin).toHaveBeenCalledTimes(1);
        expect(CompLogin).toHaveBeenCalledWith("testUser", "thePassword123")
    })

    test('Error shows Login Failed', async () => {

        const CompLogin = jest.fn()
        const InvError = "Invalid Username or Password"

        render(<LoginForm
            error={InvError}
            CompleteLogin={CompLogin}
        />)

        expect(screen.getByText(InvError)).toBeInTheDocument()

    })

    test("Calls CompleteLogin and submits form When Pressing Enter", async () => {
        const CompLogin = jest.fn();

        render(<LoginForm error="" CompleteLogin={CompLogin} />);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await userEvent.type(usernameInput, "testUser");
        await userEvent.type(passwordInput, "password123{enter}");

        expect(CompLogin).toHaveBeenCalledTimes(1);
        expect(CompLogin).toHaveBeenCalledWith("testUser", "password123");
    });
})