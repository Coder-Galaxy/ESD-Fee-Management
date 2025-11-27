import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/styles.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8080/api";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError("Failed to read credentials from Google.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken: response.credential })
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Google authentication failed.");
      }

      const payload: LoginResponse = await res.json();
      login(
        {
          employeeId: payload.employeeId,
          email: payload.email,
          emailVerified: payload.emailVerified,
          name: payload.name || payload.email
        },
        payload.token || response.credential
      );

      navigate("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/auth/login-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const payload: LoginResponse = await res.json();
      login(
        {
          employeeId: payload.employeeId,
          email: payload.email,
          emailVerified: payload.emailVerified,
          name: payload.name || payload.email
        },
        payload.token
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError("Google login was cancelled or interrupted. Try again.");
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isDevMode = !clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <div className="login-container">
      <div className="login-card" style={{ padding: "40px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: "450px" }}>
        <h1 className="login-title" style={{ fontSize: "28px", marginBottom: "10px", color: "#202124" }}>Welcome Back</h1>
        <p style={{ marginBottom: 30, color: "#5f6368", fontSize: "16px" }}>Sign in to manage fees and students</p>

        {error && <div className="alert error" style={{ marginBottom: 20 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email/Password Login */}
          <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <input
              type="email"
              placeholder="Email Address"
              className="modern-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="modern-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="modern-btn"
            >
              Sign In
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#dadce0" }}></div>
            <span style={{ padding: "0 10px", color: "#5f6368", fontSize: "14px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#dadce0" }}></div>
          </div>

          {/* Google Login */}
          {isDevMode ? (
            <button
              onClick={() => handleSuccess({ credential: "dev-token" } as any)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                color: "#3c4043",
                border: "1px solid #dadce0",
                borderRadius: "4px",
                padding: "0 12px",
                height: "40px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                width: "100%",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background-color .3s, box-shadow .3s",
                fontFamily: "Roboto, arial, sans-serif"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f8faff";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{ marginRight: 12, display: "flex", alignItems: "center" }}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48">
                  <g>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </g>
                </svg>
              </div>
              Sign in with Google
            </button>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                width="370"
                theme="outline"
                size="large"
                text="signin_with"
              />
            </div>
          )}
        </div>

        {isLoading && <p style={{ marginTop: 20, color: "#5f6368" }}>Verifying your identity...</p>}
      </div>
    </div>
  );
}

type LoginResponse = {
  employeeId: number;
  email: string;
  emailVerified: boolean;
  name: string;
  token: string;
};

