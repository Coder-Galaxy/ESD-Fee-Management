import { Domain } from "./DomainService";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8080/api";

export type Student = {
    id: number;
    firstName: string;
    lastName: string;
    rollNumber: string;
    domain?: Domain;
};

export type StudentRequest = {
    firstName: string;
    lastName: string;
    rollNumber: string;
    domainId: number;
};

export const StudentService = {
    getAllStudents: async (token: string): Promise<Student[]> => {
        const res = await fetch(`${BACKEND_URL}/student`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
    },

    addStudent: async (token: string, request: StudentRequest): Promise<string> => {
        const res = await fetch(`${BACKEND_URL}/student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error("Failed to add student");
        return res.text();
    },

    updateStudent: async (token: string, id: number, request: StudentRequest): Promise<string> => {
        const res = await fetch(`${BACKEND_URL}/student/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error("Failed to update student");
        return res.text();
    },

    deleteStudent: async (token: string, id: number): Promise<string> => {
        const res = await fetch(`${BACKEND_URL}/student/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete student");
        return res.text();
    },
};
