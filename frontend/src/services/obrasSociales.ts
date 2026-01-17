
import { MOCK_OBRAS_SOCIALES } from "../mocks/Data";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const obrasSocialesService = {
    getAll: async () => {
        await delay(200);
        return MOCK_OBRAS_SOCIALES;
    },

    getById: async (id: number) => {
        await delay(200);
        const os = MOCK_OBRAS_SOCIALES.find(o => o.id === id);
        if (!os) throw new Error("Obra Social not found");
        return os;
    },

    create: async (data: any) => {
        await delay(600);
        console.log("Mock create OS:", data);
        return { id: 999, ...data };
    }
};
