
import api from "@/api/axios";
import type { Factura, CreateFacturaPayload, UpdateFacturaPayload } from "../types";

export const facturasService = {
  getAll: async (params?: { search?: string; nro_ad?: string; estado?: string; periodo?: string }): Promise<Factura[]> => {
    try {
      const { data } = await api.get('/facturas', { params });
      return data.data || data;
    } catch (error) {
      console.error("Error fetching facturas:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Factura> => {
    try {
      const { data } = await api.get(`/facturas/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching factura ${id}:`, error);
      throw error;
    }
  },

  create: async (payload: CreateFacturaPayload): Promise<Factura> => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if ((value as unknown) instanceof File || (value as unknown) instanceof Blob) {
            formData.append(key, value as Blob);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const { data } = await api.post('/facturas', formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      return data;
    } catch (error) {
      console.error("Error creating factura:", error);
      throw error;
    }
  },

  update: async (id: string, payload: UpdateFacturaPayload): Promise<Factura> => {
    try {
      const { data } = await api.put(`/facturas/${id}`, payload);
      return data;
    } catch (error) {
      console.error(`Error updating factura ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/facturas/${id}`);
    } catch (error) {
      console.error(`Error deleting factura ${id}:`, error);
      throw error;
    }
  }
};