import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import Pasajeros from './pages/Pasajeros';
import Facturas from './pages/Facturas';
import PasajeroDetalle from './pages/PasajeroDetalle';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="pasajeros" element={<Pasajeros />} />
          <Route path="/pasajeros/:cuil" element={<PasajeroDetalle />} />
          <Route path="facturas" element={<Facturas />} />
        </Route>
      </Routes>w
    </BrowserRouter>
  </React.StrictMode>
);