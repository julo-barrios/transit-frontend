import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, Home, Users, FileText, Settings, LogOut } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Inicio", path: "/", icon: <Home size={20} /> },
    { name: "Pasajeros", path: "/pasajeros", icon: <Users size={20} /> },
    { name: "Facturas", path: "/facturas", icon: <FileText size={20} /> },
  ];

  return (
    <div className="drawer lg:drawer-open"> {/* lg:drawer-open lo hace tipo Sidebar fija en desktop */}
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-base-200/50"> {/* Fondo sutilmente gris */}
        {/* Navbar limpia sin centro */}
        <div className="navbar bg-base-100 border-b border-base-200 px-4">
          <div className="navbar-start gap-2">
            <label htmlFor="main-drawer" className="btn btn-ghost btn-circle lg:hidden">
              <Menu size={20} />
            </label>
            <Link to="/" className="text-xl font-black tracking-tighter text-primary px-2">
              TRANSIT
            </Link>
          </div>

          <div className="navbar-end gap-2">
            <button className="btn btn-ghost btn-circle btn-sm">
              <Bell size={20} />
            </button>
            <div className="avatar placeholder ml-2">
              <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs">JB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Sidebar Profesional */}
      <div className="drawer-side">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <div className="menu bg-base-100 text-base-content min-h-full w-72 p-6 border-r border-base-200">
          <div className="mb-10 px-4 opacity-50 text-xs font-bold uppercase tracking-widest">
            Menú Principal
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path 
                    ? "bg-primary text-primary-content shadow-lg shadow-primary/20" 
                    : "hover:bg-base-200"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-2 pt-10">
            <li><Link to="/config" className="flex items-center gap-4 px-4 py-3 opacity-60 hover:opacity-100"><Settings size={20} /> Configuración</Link></li>
            <li><button className="flex items-center gap-4 px-4 py-3 text-error opacity-60 hover:opacity-100 w-full"><LogOut size={20} /> Cerrar Sesión</button></li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;