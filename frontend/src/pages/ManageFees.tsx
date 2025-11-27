import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/styles.css";
import { FeeService, FeeRequest, FeeResponse } from "../services/FeeService";
import { Student, StudentService } from "../services/StudentService";
import { Domain, DomainService } from "../services/DomainService";

export default function ManageFees() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [mode, setMode] = useState<"student" | "domain">("student");
  const [studentId, setStudentId] = useState("");
  const [domainId, setDomainId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [fees, setFees] = useState<FeeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const [studentsData, domainsData] = await Promise.all([
        StudentService.getAllStudents(token),
        DomainService.getAllDomains(token)
      ]);
      setStudents(studentsData);
      setDomains(domainsData);
    } catch (err) {
      console.error(err);
      setError("Failed to load data.");
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadFees = useCallback(async () => {
    if (!studentId) {
      setFees([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await FeeService.getFeesForStudent(parseInt(studentId), token || undefined);
      setFees(data);
    } catch (err) {
      console.error(err);
      setFees([]);
    } finally {
      setLoading(false);
    }
  }, [studentId, token]);

  useEffect(() => {
    if (mode === "student") {
      loadFees();
    }
  }, [loadFees, mode]);

  const handleAddFee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const request: FeeRequest = {
      description,
      amount: parseFloat(amount),
      deadline
    };

    if (request.amount <= 0) {
      setError("Fee amount must be positive.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (request.deadline < today) {
      setError("Deadline cannot be in the past.");
      return;
    }

    try {
      let msg = "";
      if (mode === "student") {
        if (!studentId || !description || !amount || !deadline) {
          setError("Please fill all fields.");
          return;
        }
        msg = await FeeService.addFeeToStudent(parseInt(studentId), request, token || undefined);
        loadFees();
      } else {
        if (!domainId || !description || !amount || !deadline) {
          setError("Please fill all fields.");
          return;
        }
        msg = await FeeService.addFeeToDomain(parseInt(domainId), request, token || undefined);
      }
      setSuccess(msg);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add fee.");
    }
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDeadline("");
    // Keep studentId/domainId selected for convenience
  };

  const startEdit = (fee: FeeResponse) => {
    setEditingId(fee.billId);
    setEditDescription(fee.description);
    setEditAmount(fee.amount.toString());
    setEditDeadline(fee.deadline);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDescription("");
    setEditAmount("");
    setEditDeadline("");
  };

  const saveEdit = async () => {
    if (!editingId) return;

    setError("");
    const parsedAmount = parseFloat(editAmount);
    if (parsedAmount <= 0) {
      setError("Fee amount must be positive.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (editDeadline < today) {
      setError("Deadline cannot be in the past.");
      return;
    }

    try {
      const request: FeeRequest = {
        description: editDescription,
        amount: parsedAmount,
        deadline: editDeadline
      };
      const msg = await FeeService.updateFee(editingId, request, token || undefined);
      setSuccess(msg);
      cancelEdit();
      loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update fee.");
    }
  };

  const deleteFee = async (billId: number) => {
    if (!window.confirm("Are you sure you want to delete this fee?")) {
      return;
    }

    setError("");
    try {
      const msg = await FeeService.deleteFee(billId, token || undefined);
      setSuccess(msg);
      loadFees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete fee.");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Fees</h1>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="section-card">
        <div className="row" style={{ marginBottom: 15 }}>
          <button
            className={`mode-button ${mode === "student" ? "active" : ""}`}
            onClick={() => { setMode("student"); setSuccess(""); setError(""); }}
            style={{ marginRight: 10 }}
          >
            Single Student
          </button>
          <button
            className={`mode-button ${mode === "domain" ? "active" : ""}`}
            onClick={() => { setMode("domain"); setSuccess(""); setError(""); }}
          >
            Entire Domain
          </button>
        </div>

        <h2 className="section-title">{mode === "student" ? "Add Fee to Student" : "Add Fee to Domain"}</h2>
        <form onSubmit={handleAddFee}>
          <div className="input-row">
            {mode === "student" ? (
              <select
                className="input-field"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.rollNumber})
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="input-field"
                value={domainId}
                onChange={(event) => setDomainId(event.target.value)}
                required
              >
                <option value="">Select Domain</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
            <input
              className="input-field"
              placeholder="Description (e.g. Tuition)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>
          <div className="input-row">
            <input
              className="input-field"
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
            <input
              className="input-field"
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="add-btn" style={{ marginTop: 10 }}>
            {mode === "student" ? "Add Fee" : "Add Fee to All Students in Domain"}
          </button>
        </form>
      </div>

      <div className="section-card" style={{ marginTop: 20 }}>
        <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="section-title">Fee History</h2>
          <button className="add-btn" onClick={loadFees} disabled={loading || !studentId}>
            {loading ? "Loading..." : "Refresh Fees"}
          </button>
        </div>

        <table className="data-table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  {studentId ? "No fees found for this student." : "Select a Student to view fees."}
                </td>
              </tr>
            ) : (
              fees.map((fee, index) => (
                <tr key={fee.billId}>
                  <td>{index + 1}</td>
                  {editingId === fee.billId ? (
                    <>
                      <td>
                        <input
                          className="input-field"
                          value={editDescription}
                          onChange={(event) => setEditDescription(event.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="input-field"
                          type="number"
                          value={editAmount}
                          onChange={(event) => setEditAmount(event.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="input-field"
                          type="date"
                          value={editDeadline}
                          onChange={(event) => setEditDeadline(event.target.value)}
                        />
                      </td>
                      <td>
                        <button className="action-btn" onClick={saveEdit}>
                          Save
                        </button>
                        <button className="action-btn delete-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{fee.description}</td>
                      <td>{fee.amount}</td>
                      <td>{fee.deadline}</td>
                      <td>
                        <button className="action-btn" onClick={() => startEdit(fee)}>
                          Edit
                        </button>
                        <button className="action-btn delete-btn" onClick={() => deleteFee(fee.billId)}>
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
