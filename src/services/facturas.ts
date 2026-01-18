
import { MOCK_FACTURAS, MOCK_PASAJEROS } from "../mocks/Data";
import type { Factura } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const facturasService = {
  getAll: async () => {
    await delay(500);
    // Enrich with passenger names for display purposes if needed
    return MOCK_FACTURAS.map(f => {
      const pasajero = MOCK_PASAJEROS.find(p => p.numero_ad.toString() === f.nro_ad);
      return { ...f, passengerName: pasajero ? `${pasajero.nombre} ${pasajero.apellido}` : "Desconocido" };
    });
  },

  getById: async (id: number) => {
    await delay(300);
    const factura = MOCK_FACTURAS.find(f => f.id === id);
    if (!factura) throw new Error("Factura not found");
    return factura;
  },

  create: async (data: Omit<Factura, "id" | "created_at">) => {
    await delay(1000);
    console.log("Mock create invoice:", data);
    return { id: Math.floor(Math.random() * 10000), ...data };
  },

  update: async (id: number, updates: Partial<Factura>) => {
    await delay(500);
    console.log(`Mock update invoice ${id}:`, updates);
    return { id, ...updates };
  }
};