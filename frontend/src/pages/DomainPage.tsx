import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Domain, DomainService } from "../services/DomainService";
import "../styles/styles.css";

export default function DomainPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [name, setName] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const loadDomains = useCallback(async () => {
    if (!token) return;
    try {
      const data = await DomainService.getAllDomains(token);
      setDomains(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load domains.");
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadDomains();
  }, [user, navigate, loadDomains]);

  const addDomain = async () => {
    if (!name) {
      alert("Enter domain name");
      return;
    }
    if (!token) return;

    try {
      await DomainService.addDomain(token, { name });
      setName("");
      loadDomains();
    } catch (err) {
      console.error(err);
      alert("Failed to add domain");
    }
  };

  const deleteDomain = async (id: number) => {
    if (!window.confirm("Delete domain?")) {
      return;
    }
    if (!token) return;

    try {
      await DomainService.deleteDomain(token, id);
      loadDomains();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete domain");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Domains</h1>

      <div className="section-card">
        <h2 className="section-title">Add New Domain</h2>
        <div className="input-row">
          <input
            className="input-field"
            placeholder="Enter domain name (e.g. Computer Science)"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="add-btn" onClick={addDomain}>
            Add Domain
          </button>
        </div>
      </div>

      <div className="section-card" style={{ marginTop: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>All Domains</h2>
          <button className="add-btn" onClick={loadDomains} style={{ padding: "8px 16px", fontSize: "14px" }}>
            Refresh List
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Sr. No.</th>
              <th style={{ textAlign: "left" }}>Domain Name</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                  No domains found. Add one above!
                </td>
              </tr>
            ) : (
              domains.map((domain, index) => (
                <tr key={domain.id}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: "left", fontWeight: 500 }}>{domain.name}</td>
                  <td>
                    <button className="btn-small delete-btn" onClick={() => deleteDomain(domain.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

