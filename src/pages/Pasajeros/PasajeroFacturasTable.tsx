// PasajeroDetalle.tsx (parte de la sección de facturas)
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Factura } from "../../types";

const FacturasTable = ({ facturas }: { facturas: Factura[] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  // useEffect(() => {
  //   getFacturasByPasajeroId(id).then(setFacturas).catch(console.error);
  // }, [id]);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPages = Math.ceil(facturas.length / pageSize);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Facturas</h3>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Periodo</th>
              <th>Importe</th>
              <th>CAI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.slice(startIndex, endIndex).map((f, i) => (
              <tr key={f.id}>
                <th>{startIndex + i + 1}</th>
                <td>{new Date(f.fecha_factura).toLocaleDateString()}</td>
                <td>{f.periodo_desde}</td>
                <td>${Number(f.importe_total).toFixed(2)}</td>
                <td>{f.cai}</td>
                <td>
                  <Link
                    className="btn btn-ghost btn-xs"
                    to={`/facturas/${f.id}`}
                  >
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <div className="join">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`join-item btn ${currentPage === index ? "btn-active" : ""}`}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            key={2}
            className={`join-item btn ${currentPage === 2 ? "btn-active" : ""}`}
            onClick={() => setCurrentPage(2)}
          >
            {1 + 1}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacturasTable;