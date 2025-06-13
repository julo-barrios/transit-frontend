export async function createPasajero(data: {
  nombre: string;
  apellido: string;
  obra_social_id: number;
}) {
  const res = await fetch("/api/v1/pasajeros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al crear pasajero");
  }

  return res.json();
}


export async function getObrasSociales(): Promise<{ id: number; nombre: string }[]> {
  const res = await fetch("/api/v1/obras-sociales");
  if (!res.ok) {
    throw new Error("Error al obtener obras sociales");
  }
  return res.json();
}