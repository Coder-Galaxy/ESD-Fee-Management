const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8080/api";

export type FeeRequest = {
    description: string;
    amount: number;
    deadline: string;
};

export type FeeResponse = {
    billId: number;
    description: string;
    amount: number;
    deadline: string;
};

export const FeeService = {
    async getFeesForStudent(studentId: number, token?: string): Promise<FeeResponse[]> {
        const headers: HeadersInit = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${BACKEND_URL}/fee/student/${studentId}`, { headers });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async addFeeToStudent(studentId: number, request: FeeRequest, token?: string): Promise<string> {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${BACKEND_URL}/fee/student/${studentId}`, {
            method: "POST",
            headers,
            body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.text();
    },

    async addFeeToDomain(domainId: number, request: FeeRequest, token?: string): Promise<string> {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${BACKEND_URL}/fee/domain/${domainId}`, {
            method: "POST",
            headers,
            body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.text();
    },

    async updateFee(billId: number, request: FeeRequest, token?: string): Promise<string> {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${BACKEND_URL}/fee/${billId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.text();
    },

    async deleteFee(billId: number, token?: string): Promise<string> {
        const headers: HeadersInit = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${BACKEND_URL}/fee/${billId}`, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) throw new Error(await res.text());
        return res.text();
    },
};
