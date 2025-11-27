import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Domain, DomainService } from "../services/DomainService";
import { Student, StudentService } from "../services/StudentService";
import "../styles/styles.css";

type StudentRow = Student & {
  serial: number;
};

export default function StudentPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [roll, setRoll] = useState("");
  const [domainId, setDomainId] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFname, setEditFname] = useState("");
  const [editLname, setEditLname] = useState("");
  const [editRoll, setEditRoll] = useState("");
  const [editDomainId, setEditDomainId] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const loadDomains = useCallback(async () => {
    if (!token) return;
    try {
      const data = await DomainService.getAllDomains(token);
      setDomains(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load domains");
    }
  }, [token]);

  const loadStudents = useCallback(async () => {
    if (!token) return;
    try {
      const data = await StudentService.getAllStudents(token);
      const normalized: StudentRow[] = data.map((student, index) => ({
        ...student,
        serial: index + 1
      }));
      setStudents(normalized);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    loadDomains();
    loadStudents();
  }, [user, navigate, loadDomains, loadStudents]);

  const addStudent = async () => {
    if (!fname || !lname || !roll || !domainId) {
      alert("Fill all fields");
      return;
    }
    if (!token) return;

    try {
      await StudentService.addStudent(token, {
        firstName: fname,
        lastName: lname,
        rollNumber: roll,
        domainId: parseInt(domainId)
      });
      setFname("");
      setLname("");
      setRoll("");
      setDomainId("");
      loadStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  const deleteStudent = async (id: number) => {
    if (!window.confirm("Delete student?")) {
      return;
    }
    if (!token) return;

    try {
      await StudentService.deleteStudent(token, id);
      loadStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  const startEdit = (student: Student) => {
    setEditingId(student.id);
    setEditFname(student.firstName);
    setEditLname(student.lastName);
    setEditRoll(student.rollNumber);
    setEditDomainId(student.domain?.id.toString() ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFname("");
    setEditLname("");
    setEditRoll("");
    setEditDomainId("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!token) return;

    try {
      await StudentService.updateStudent(token, editingId, {
        firstName: editFname,
        lastName: editLname,
        rollNumber: editRoll,
        domainId: parseInt(editDomainId)
      });
      cancelEdit();
      loadStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Manage Students</h1>

      <div className="section-card">
        <h2 className="section-title">{editingId ? "Edit Student" : "Add Student"}</h2>

        <div className="input-row">
          <input
            className="input-field"
            placeholder="First name"
            value={editingId ? editFname : fname}
            onChange={(event) =>
              editingId ? setEditFname(event.target.value) : setFname(event.target.value)
            }
          />
          <input
            className="input-field"
            placeholder="Last name"
            value={editingId ? editLname : lname}
            onChange={(event) =>
              editingId ? setEditLname(event.target.value) : setLname(event.target.value)
            }
          />
        </div>

        <div className="input-row">
          <input
            className="input-field"
            placeholder="Roll number"
            value={editingId ? editRoll : roll}
            onChange={(event) =>
              editingId ? setEditRoll(event.target.value) : setRoll(event.target.value)
            }
          />
          <select
            className="input-field"
            value={editingId ? editDomainId : domainId}
            onChange={(event) =>
              editingId ? setEditDomainId(event.target.value) : setDomainId(event.target.value)
            }
          >
            <option value="">Select Domain</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
        </div>

        {editingId ? (
          <>
            <button className="add-btn" onClick={saveEdit}>
              Save
            </button>
            <button className="add-btn" onClick={cancelEdit} style={{ marginLeft: 10, background: "#777" }}>
              Cancel
            </button>
          </>
        ) : (
          <button className="add-btn" onClick={addStudent}>
            Add Student
          </button>
        )}
      </div>

      <div className="section-card">
        <h2 className="section-title">All Students</h2>
        <button className="add-btn" onClick={loadStudents}>
          Refresh
        </button>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Roll</th>
              <th>Domain</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.serial}</td>
                  <td>
                    {student.firstName} {student.lastName}
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>{student.domain?.name}</td>
                  <td>
                    <button className="edit-btn" onClick={() => startEdit(student)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteStudent(student.id)}>
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

