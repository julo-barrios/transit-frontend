import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getObrasSociales, createPasajero } from "../../services/pasajeros";

export default function PasajeroCrear() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [obraSocialId, setObraSocialId] = useState<number | null>(null);
  const [obrasSociales, setObrasSociales] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    getObrasSociales().then(setObrasSociales);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obraSocialId) return;
    await createPasajero({ nombre, apellido, obra_social_id: obraSocialId });
    navigate("/pasajeros");
  };

  return (
    <div className="flex w-full flex-col">
      <div className="card bg-base-300 rounded-box grid h-fit place-items-start p-4">
        <h2 className="text-xl font-bold mb-4">Crear pasajero</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            className="input input-bordered w-full"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            className="input input-bordered w-full"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <select
            className="select select-bordered"
            value={obraSocialId ?? ""}
            onChange={(e) => setObraSocialId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Seleccioná una obra social</option>
            {obrasSociales.map((o) => (
              <option key={o.id} value={o.id}>{o.nombre}</option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">Crear</button>
        </form>
      </div>
    </div>
  );
}
