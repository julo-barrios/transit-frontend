import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/PageLayout";

const NuevaFactura = () => {
  const { pasajeroId } = useParams<{ pasajeroId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fecha_factura: "",
    fecha_cai: "",
    periodo_desde: "",
    importe_total: "",
    cai: "",
    letra: "",
    sucursal: "",
    numero: "",
    nro_ad: "",
    archivo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append("pasajero_id", pasajeroId!);

    const res = await fetch("http://localhost:8080/api/v1/facturas", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      navigate(`/pasajeros/${pasajeroId}`);
    } else {
      alert("Error al crear la factura");
    }
  };

  return (
    <PageLayout title = "Cargar una nueva factura" breadcrumbs={["Home", "Pasajeros", "2038948434" ,"Nueva factura"]}>
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Cargar nueva factura</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="date" name="fecha_factura" onChange={handleChange} className="input input-bordered" required />
            <input type="date" name="fecha_cai" onChange={handleChange} className="input input-bordered" required />
            <input type="text" name="periodo_desde" placeholder="Periodo desde" onChange={handleChange} className="input input-bordered" required />
            <input type="number" name="importe_total" placeholder="Importe total" onChange={handleChange} className="input input-bordered" required />
            <input type="text" name="cai" placeholder="CAI" onChange={handleChange} className="input input-bordered" required />
            <input type="text" name="letra" placeholder="Letra" onChange={handleChange} className="input input-bordered" required />
            <input type="text" name="sucursal" placeholder="Sucursal" onChange={handleChange} className="input input-bordered" required />
            <input type="text" name="numero" placeholder="Número" onChange={handleChange} className="input input-bordered" required />
            <input type="text" name="nro_ad" placeholder="Nro AD" onChange={handleChange} className="input input-bordered" required />
            <input type="file" name="archivo" accept="application/pdf" onChange={handleChange} className="file-input file-input-bordered" required />

            <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" className="btn" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar factura</button>
            </div>
        </form>
        </div>
    </PageLayout>
  );
};

export default NuevaFactura;
