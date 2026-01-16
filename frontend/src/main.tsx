import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import Pasajeros from './pages/Pasajeros/Pasajeros';
import Facturas from './pages/Facturas/Facturas';
import PasajeroDetalle from './pages/Pasajeros/PasajeroDetalle';
import React from 'react';
import PasajeroEditar from './pages/Pasajeros/PasajeroEditar';
import PasajeroCrear from './pages/Pasajeros/PasajeroCrear';
import NuevaFactura from './pages/Facturas/NuevaFactura';
import FacturaSelectorPasajero from './pages/Facturas/FacturasSelectorPasajero';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="pasajeros" element={<Pasajeros />} />
          <Route path="/pasajeros/:cuil" element={<PasajeroDetalle />} />
          <Route path="/pasajeros/:cuil/editar" element={<PasajeroEditar />} />
          <Route path="/pasajeros/crear" element={<PasajeroCrear />} />
          <Route path="/pasajeros/:pasajeroId/facturas/nueva" element={<NuevaFactura />} />
          <Route path="facturas" element={<Facturas />} />
          <Route path="facturas/nueva" element={<FacturaSelectorPasajero />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);