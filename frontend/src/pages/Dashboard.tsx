import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user?.name || user?.email}</h1>

      <div className="dashboard-card">
        <div className="dashboard-grid">
          <button className="dash-btn" onClick={() => navigate("/manage-fees")}>
            Manage Fees
          </button>

          <button className="dash-btn" onClick={() => navigate("/students")}>
            Manage Students
          </button>

          <button className="dash-btn" onClick={() => navigate("/domains")}>
            Manage Domains
          </button>

          <button
            className="dash-btn logout-btn"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

