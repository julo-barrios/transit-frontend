import api from "@/api/axios";
import type { ObraSocial, CreateObraSocialPayload, UpdateObraSocialPayload, CampoConfiguracion } from "../types";




interface RawObraSocial {
    id: number;
    nombre: string;
    configuracion_campos?: CampoConfiguracion[];
    configuracion_pasajeros?: CampoConfiguracion[];
    datos_adicionales?: Record<string, unknown>;
}

export const obrasSocialesService = {
    getAll: async (search?: string): Promise<ObraSocial[]> => {
        try {
            const { data } = await api.get('/obras-sociales', { params: { search } });
            return (data.data || data || []).map((os: RawObraSocial) => ({
                ...os,
                configuracion_pasajeros: os.configuracion_campos || os.configuracion_pasajeros || []
            }));
        } catch (error) {
            console.error("Error fetching obras sociales:", error);
            throw error;
        }
    },

    getById: async (id: number | string): Promise<ObraSocial> => {
        try {
            const { data } = await api.get(`/obras-sociales/${id}`);
            return {
                ...data,
                configuracion_pasajeros: data.configuracion_campos || data.configuracion_pasajeros || []
            };
        } catch (error) {
            console.error(`Error fetching obra social ${id}:`, error);
            throw error;
        }
    },



    create: async (payload: CreateObraSocialPayload): Promise<ObraSocial> => {
        try {
            const { data } = await api.post('/obras-sociales', payload);
            return data;
        } catch (error) {
            console.error("Error creating obra social:", error);
            throw error;
        }
    },

    update: async (id: number | string, payload: UpdateObraSocialPayload): Promise<ObraSocial> => {
        try {
            const { data } = await api.put(`/obras-sociales/${id}`, payload);
            return data;
        } catch (error) {
            console.error(`Error updating obra social ${id}:`, error);
            throw error;
        }
    },

    delete: async (id: number | string): Promise<void> => {
        try {
            await api.delete(`/obras-sociales/${id}`);
        } catch (error) {
            console.error(`Error deleting obra social ${id}:`, error);
            throw error;
        }
    }
};
