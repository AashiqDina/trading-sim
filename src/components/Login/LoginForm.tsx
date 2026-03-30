import { useState } from "react";

type props = {
    error: string;
    CompleteLogin: (username: string, password: string) => Promise<void>;
}

export default function LoginForm({error, CompleteLogin}: props ){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

   
    const toLogin = (e: React.FormEvent) => {
       e.preventDefault()
       if(username && password) CompleteLogin(username, password)
    }

   return(
        <>
          <div className={`login-container ${error ? "error" : ""}`}>
            <h2>Login</h2>
            <form onSubmit={toLogin}>
              <div className="form-group">
              <label htmlFor="username" className="SrOnly">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="UsernameInputLogin"
                  aria-label="Enter Username"
                  aria-required="true"
                  required
                />
              </div>
              <div className="form-group">
              <label htmlFor="password" className="SrOnly">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="PasswordInputLogin"
                  aria-label="Enter Password"
                  aria-invalid={error ? "true" : "false"}
                  aria-required="true"
                  required
                />
              </div>
              <button aria-label="Submit Login Form" className="SubmitButton" type="submit">Login</button>
            </form>
            {error && <p role="alert" className="ErrorType">{error}</p>}
            <p className="noAccount">Don't have an account?</p>
            <a aria-label="Go to registration page to create an account" href="/register" className="noAccountRegister">Register</a>
          </div>
        </>
   )
}