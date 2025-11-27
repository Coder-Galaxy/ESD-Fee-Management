import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageFees from "./pages/ManageFees";
import StudentPage from "./pages/StudentPage";
import DomainPage from "./pages/DomainPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/manage-fees" element={user ? <ManageFees /> : <Navigate to="/" replace />} />
        <Route path="/students" element={user ? <StudentPage /> : <Navigate to="/" replace />} />
        <Route path="/domains" element={user ? <DomainPage /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

