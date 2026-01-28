export interface PasajeroListItem {
  id: number;
  nombre: string;
  apellido: string;
  obra_social: ObraSocial | string;
  identificador_os: string;
  cuil: string;
  fecha_nacimiento: string;
  created_at: NullableDate;
  ultimo_periodo?: string | null;
}

export interface NullableDate {
  Time: Date;
  Valid: boolean;
}

// Configuración de un campo dinámico (Schema)
export interface CampoConfiguracion {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required?: boolean;
  options?: string[]; // Para tipo 'select'
}

export interface ObraSocial {
  id: number;
  nombre: string;
  // Schema: Qué datos pide esta OS a sus pasajeros
  configuracion_pasajeros?: CampoConfiguracion[];
  // Data: Datos extra de la propia OS
  datos_adicionales?: Record<string, unknown>;
}

export type CreateObraSocialPayload = Omit<ObraSocial, "id">;
export type UpdateObraSocialPayload = Partial<ObraSocial>;

export interface Pasajero {
  id: number;
  nombre: string;
  apellido: string;
  cuil: string;
  identificador_os: string;
  obra_social?: ObraSocial;
  fecha_nacimiento: string;
  created_at: NullableDate;
  // Data: Valores de los campos dinámicos
  datos_adicionales?: Record<string, unknown>;
}

export interface CreatePasajeroPayload {
  nombre: string;
  apellido: string;
  cuil: string;
  fecha_nacimiento: string;
  identificador_os: string;
  obra_social_id: number;
  datos_adicionales?: Record<string, unknown>;
}

export type UpdatePasajeroPayload = Partial<CreatePasajeroPayload>;

// Workflow Types
export interface WorkflowStep {
  step_order: number;
  name: string;
  status: "pending" | "current" | "completed" | "error";
  state_label: string;
  is_current: boolean;
}

export const FACTURA_ESTADOS = {
  BORRADOR: "Borrador",
  PENDIENTE_ARCA: "Pendiente ARCA",
  CARGADA_ARCA: "Cargada ARCA",
  FALLO_ARCA: "Fallo ARCA",
  PENDIENTE_ENVIO_OS: "Pendiente Envío OS",
  ENVIADA_OS: "Enviada OS",
  FALLO_ENVIO_OS: "Fallo Envío OS",
  PENDIENTE_ACREDITACION: "Pendiente Acreditación",
  ACREDITADA: "Acreditada"
} as const;

export type FacturaEstado = typeof FACTURA_ESTADOS[keyof typeof FACTURA_ESTADOS];

export interface Factura {
  id: string;
  cliente_id: string;
  fecha_factura: string;
  fecha_cai: string;
  periodo_desde: string;
  importe_total: number;
  kilometros: number;
  cai: string;
  letra: string;
  sucursal: string;
  numero: string;
  pdf_path: string;
  created_at: string;
  acreditada?: boolean;
  fecha_acreditacion?: string;
  estado: FacturaEstado | string; // Allow string fallback for backward compatibility
  planilla_path?: string;
  pasajero_nombre?: string;
  obra_social_nombre?: string;
  workflow?: WorkflowStep[];
}

export type CreateFacturaPayload = Omit<Factura, "id" | "estado" | "created_at" | "acreditada" | "fecha_acreditacion" | "fecha_factura" | "fecha_cai" | "cai" | "letra" | "sucursal" | "numero" | "pdf_path" | "planilla_path"> & { file?: File };
export type UpdateFacturaPayload = Partial<Factura>;

export interface PasajeroDetail extends Pasajero {
  facturas: Factura[];
}

export interface AccreditationPendingItem {
  id: number;
  letra: string;
  sucursal: string;
  numero: string;
  fecha_factura: string;
  pasajero: {
    nombre: string;
    apellido: string;
    obra_social: string;
  };
}

export interface WorkloadItem {
  id: number;
  nombre: string;
  completado: number;
  total: number;
}
