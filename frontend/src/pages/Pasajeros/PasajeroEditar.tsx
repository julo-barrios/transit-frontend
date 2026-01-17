import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PASAJEROS } from "../../mocks/Data";
import { MOCK_OBRAS_SOCIALES } from "../../mocks/Data";
import type { Pasajero } from "../../types";

export default function PasajeroEditar() {
  const { cuil } = useParams();
  const navigate = useNavigate();
  // Inicializamos con null, tipado como Pasajero
  const [pasajero, setPasajero] = useState<Pasajero | null>(null);

  useEffect(() => {
    // Simular fetch encontrando por CUIL en el mock
    // Usamos 'as Pasajero' porque MOCK_PASAJEROS a veces puede tener pequeñas discrepancias de tipo si no está 100% alineado, 
    // pero aquí asumios que cumple la interfaz
    const found = MOCK_PASAJEROS.find(p => p.cuil === cuil);
    if (found) {
      setPasajero(found);
    }
  }, [cuil]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (pasajero) {
      // Si cambiamos obra social es un objeto, aquí simplificamos solo strings por ahora
      // O si es un select, manejamos el ID. 
      // Para simplificar el mock, solo permitimos editar textos planos del primer nivel.
      // Si editamos obra social, necesitaríamos buscar el objeto en MOCK_OBRAS_SOCIALES
      setPasajero({ ...pasajero, [e.target.name]: e.target.value });
    }
  };

  const handleObraSocialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (pasajero) {
      const nuevaOS = MOCK_OBRAS_SOCIALES.find(os => os.nombre === e.target.value);
      if (nuevaOS) {
        setPasajero({ ...pasajero, obra_social: nuevaOS })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Simulando actualización de pasajero:", pasajero);
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    // Navegar vuelta al detalle
    navigate(`/pasajeros/${cuil}`);
  };

  if (!pasajero) return <span className="loading loading-spinner text-primary"></span>;

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
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Nombre</span>
          </div>
          <input
            name="nombre"
            type="text"
            value={pasajero.nombre}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Nombre"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Apellido</span>
          </div>
          <input
            name="apellido"
            type="text"
            value={pasajero.apellido}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Apellido"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">CUIL/DNI</span>
          </div>
          <input
            name="cuil"
            type="text"
            value={pasajero.cuil}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="CUIL"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Obra Social</span>
          </div>
          <select
            className="select select-bordered"
            value={pasajero.obra_social?.nombre}
            onChange={handleObraSocialChange}
          >
            {MOCK_OBRAS_SOCIALES.map(os => (
              <option key={os.id} value={os.nombre}>{os.nombre}</option>
            ))}
          </select>
        </label>

        <button type="submit" className="btn btn-primary w-full">Guardar Cambios</button>
      </form>
    </div>
  );
}
