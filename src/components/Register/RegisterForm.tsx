import { useState } from "react";

type props = {
    error: string;
    CompleteRegister: (username: string, password: string, confirmPassword: string) => Promise<void>;
}

export default function RegisterForm({error, CompleteRegister}: props ){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

   
    const toRegister = async (e: React.FormEvent) => {
       e.preventDefault()
       await CompleteRegister(username, password, confirmPassword)
    }

  return (
    <section className={`register-container ${error ? "error" : ""}`}>
      <h2>Register</h2>
      <form onSubmit={toRegister}>
      <label htmlFor="username" className="SrOnly">Username</label>
        <div className="form-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="UsernameInput"
            aria-label="input chosen username"
            aria-required
            required
          />
        </div>
        <div className="form-group">
        <label htmlFor="password" className="SrOnly">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="PasswordInput"
            aria-label="input chosen password"
            aria-required
            required
          />
        </div>
        <div className="form-group">
        <label htmlFor="confirmPassword" className="SrOnly">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="ConfirmPasswordInput"
            aria-label="confirm chosen password"
            aria-required
            required
          />
        </div>

        {error && <p role="alert" className="RegisterError">{error}</p>}

        <button aria-label="Submit and Create account" className="SubmitButton" type="submit">Register</button>
      </form>
      <a className="HaveALook" href="#/user/1/AashiqD">
        See my profile for a preview.
      </a>
      <p className="noAccount" style={{marginTop: "0.8rem"}}>
        Already have an account?
      </p>
      <a className="noAccountRegister" aria-label="Go to login page" href="#/login">Login here</a>
    </section>
  );

}