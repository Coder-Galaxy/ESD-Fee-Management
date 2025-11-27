const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8080/api";

export type Domain = {
    id: number;
    name: string;
};

export type DomainRequest = {
    name: string;
};

export const DomainService = {
    getAllDomains: async (token: string): Promise<Domain[]> => {
        const res = await fetch(`${BACKEND_URL}/domain`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch domains");
        return res.json();
    },

    addDomain: async (token: string, request: DomainRequest): Promise<Domain> => {
        const res = await fetch(`${BACKEND_URL}/domain`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error("Failed to add domain");
        return res.json();
    },

    deleteDomain: async (token: string, id: number): Promise<void> => {
        const res = await fetch(`${BACKEND_URL}/domain/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to delete domain");
        }
    },
};
