import type { Pasajero, ObraSocial, Factura, PasajeroListItem } from "../types";

// 1. Mocks de Obras Sociales
export const MOCK_OBRAS_SOCIALES: ObraSocial[] = [
  { id: 1, nombre: "OSECAC" },
  { id: 2, nombre: "OSDE" },
  { id: 3, nombre: "PAMI" },
  { id: 4, nombre: "Swiss Medical" },
  { id: 5, nombre: "IOMA" }
];

// 2. Mocks de Pasajeros (Para el listado y detalle)
export const MOCK_PASAJEROS: Pasajero[] = [
  {
    id: 101,
    nombre: "Julian",
    apellido: "Barrios",
    cuil: "20-38948434-9",
    numero_ad: 450,
    obra_social: MOCK_OBRAS_SOCIALES[0], // OSECAC
    fecha_nacimiento: "1995-05-15",
    created_at: { Time: new Date("2023-01-10"), Valid: true }
  },
  {
    id: 102,
    nombre: "Marta",
    apellido: "Rodriguez",
    cuil: "27-15443221-4",
    numero_ad: 122,
    obra_social: MOCK_OBRAS_SOCIALES[1], // OSDE
    fecha_nacimiento: "1980-08-22",
    created_at: { Time: new Date("2023-02-15"), Valid: true }
  },
  {
    id: 103,
    nombre: "Ricardo",
    apellido: "Darín",
    cuil: "20-11223344-5",
    numero_ad: 89,
    obra_social: MOCK_OBRAS_SOCIALES[2], // PAMI
    fecha_nacimiento: "1957-01-16",
    created_at: { Time: new Date("2023-05-20"), Valid: true }
  }
];

// 3. Mocks de Facturas (Con estados para el flujo de ARCA)
// Nota: He añadido un campo 'estado' para que lo uses en la UI aunque no esté en el tipo original
export interface FacturaExtended extends Factura {
  estado: "Pendiente" | "Procesando ARCA" | "Enviada" | "Error";
  kilometros: number;
  acreditada: boolean;          // Nueva propiedad
  fecha_acreditacion?: string;  // Nueva propiedad
}

export const MOCK_FACTURAS: FacturaExtended[] = [
  {
    id: 1,
    fecha_factura: "2023-08-05",
    periodo_desde: "2023-08",
    importe_total: 85000,
    kilometros: 180,
    acreditada: true,
    fecha_acreditacion: "2023-11-10", // Tardó 3 meses
    estado: "Enviada",
    // ... resto de campos
  },
  {
    id: 2,
    fecha_factura: "2023-09-10",
    periodo_desde: "2023-09",
    importe_total: 92000,
    kilometros: 205,
    acreditada: true,
    fecha_acreditacion: "2023-12-15",
    estado: "Enviada",
    // ...
  },
  {
    id: 3,
    fecha_factura: "2023-10-05",
    periodo_desde: "2023-10",
    importe_total: 75000,
    kilometros: 160,
    acreditada: false, // Aún no cobrada
    estado: "Enviada",
    // ...
  }
];