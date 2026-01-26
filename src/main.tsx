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
import ObrasSociales from './pages/ObrasSociales/ObrasSociales';
import ObraSocialCrear from './pages/ObrasSociales/ObraSocialCrear';
import ObraSocialEditar from './pages/ObrasSociales/ObraSocialEditar';
import FacturaDetalle from './pages/Facturas/FacturaDetalle';
import Configuracion from './pages/Configuracion/Configuracion';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import OAuthConsent from './pages/Auth/OAuthConsent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Profile from './pages/Configuracion/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/oauth/consent" element={<OAuthConsent />} />
              <Route path="/" element={<App />}>

                <Route index element={<Home />} />
                <Route path="pasajeros" element={<Pasajeros />} />
                <Route path="/pasajeros/:id" element={<PasajeroDetalle />} />
                <Route path="/pasajeros/:id/editar" element={<PasajeroEditar />} />
                <Route path="/pasajeros/crear" element={<PasajeroCrear />} />
                <Route path="/pasajeros/:pasajeroId/facturas/nueva" element={<NuevaFactura />} />
                <Route path="facturas" element={<Facturas />} />
                <Route path="facturas/nueva" element={<FacturaSelectorPasajero />} />
                <Route path="facturas/:id" element={<FacturaDetalle />} />
                <Route path="obras-sociales" element={<ObrasSociales />} />
                <Route path="obras-sociales/nueva" element={<ObraSocialCrear />} />
                <Route path="obras-sociales/:id/editar" element={<ObraSocialEditar />} />
                <Route path="configuracion" element={<Configuracion />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);