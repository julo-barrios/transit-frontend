import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Pasajero {
  id: number;
  nombre: string;
  apellido: string;
  cuil: string;
  // Agregá más campos si es necesario
}

export default function PasajeroEditar() {
  const { cuil } = useParams();
  const navigate = useNavigate();
  const [pasajero, setPasajero] = useState<Pasajero | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/pasajeros/${cuil}`)
      .then((res) => res.json())
      .then((data) => setPasajero(data));
  }, [cuil]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pasajero) {
      setPasajero({ ...pasajero, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/api/v1/pasajeros/${cuil}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pasajero),
    });
    navigate(`/pasajeros/${cuil}`);
  };

  if (!pasajero) return <span className="loading loading-spinner"></span>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="breadcrumbs text-sm mb-2">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/pasajeros">Pasajeros</a></li>
          <li>Editar pasajero</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold mb-4">Editar pasajero</h2>
      <div className="divider"></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nombre"
          type="text"
          value={pasajero.nombre}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Nombre"
        />
        <input
          name="apellido"
          type="text"
          value={pasajero.apellido}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Apellido"
        />
        <input
          name="dni"
          type="text"
          value={pasajero.cuil}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="DNI"
        />

        <button type="submit" className="btn btn-primary w-full">Guardar</button>
      </form>
    </div>
  );
}
