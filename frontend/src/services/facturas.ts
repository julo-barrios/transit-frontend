import type{ Factura } from "../types";

export async function getFacturasByPasajeroId(id: number): Promise<Factura[]> {
  const response = await fetch(`http://localhost:8080/api/v1/pasajeros/${id}/facturas`);
  console.log(response);
  if (!response.ok) throw new Error("Error fetching facturas");
  return response.json();
}