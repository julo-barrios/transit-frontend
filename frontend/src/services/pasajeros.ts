
import { MOCK_PASAJEROS_DETALLADO } from "../mocks/Data";
import type { Pasajero } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const pasajerosService = {
  getAll: async () => {
    await delay(400);
    return MOCK_PASAJEROS_DETALLADO;
  },

  getById: async (id: number) => {
    await delay(200);
    const pasajero = MOCK_PASAJEROS_DETALLADO.find(p => p.id === id);
    if (!pasajero) throw new Error("Pasajero not found");
    return pasajero;
  },

  create: async (data: any) => {
    await delay(800);
    console.log("Mock creating pasajero:", data);
    return { ...data, id: Math.floor(Math.random() * 1000) };
  },

  update: async (id: number, data: any) => {
    await delay(500);
    console.log(`Mock updating pasajero ${id}:`, data);
    return { id, ...data };
  }
};