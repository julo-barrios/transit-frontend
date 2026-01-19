import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  Bell,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  LayoutDashboard,
  Receipt
} from "lucide-react";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
  { label: "Pasajeros", path: "/pasajeros", icon: <Users size={20} /> },
  { label: "Facturas", path: "/facturas", icon: <Receipt size={20} /> },
  { label: "Obras Sociales", path: "/obras-sociales", icon: <Building2 size={20} /> },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-base-200/50">
      {/* Sidebar Personalizada (Minimizable) */}
      <aside
        className={`
          hidden lg:flex flex-col bg-base-100 border-r border-base-200 transition-all duration-300 ease-in-out sticky top-0 h-screen
          ${isCollapsed ? "w-20" : "w-72"}
        `}
      >
        {/* Menú de Navegación */}
        <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto overflow-x-hidden">
          <div>
            {!isCollapsed && (
              <p className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/40">
                Menú Principal
              </p>
            )}
            <ul className="space-y-2">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-4 py-3 rounded-xl transition-all group
                        ${isCollapsed ? "justify-center px-0" : "px-4"}
                        ${isActive
                          ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                          : "hover:bg-base-200 text-base-content/70"}
                        `}
                    >
                      <div className="shrink-0">{item.icon}</div>
                      {!isCollapsed && <span className="font-semibold whitespace-nowrap">{item.label}</span>}

                      {/* Tooltip simple cuando está colapsado */}
                      {isCollapsed && (
                        <div className="absolute left-20 bg-neutral text-neutral-content px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="btn btn-ghost btn-xs btn-circle absolute -right-3 top-20 bg-base-100 border border-base-200 shadow-md hover:bg-primary hover:text-primary-content z-50"
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>
        </div>

        {/* Footer de la Sidebar */}
        <div className="p-4 border-t border-base-200 space-y-2">
          <Link to="/configuracion" className={`flex items-center gap-4 py-3 opacity-60 hover:opacity-100 ${isCollapsed ? "justify-center" : "px-4"}`}>
            <Settings size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Configuración</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 py-3 text-error opacity-60 hover:opacity-100 w-full ${isCollapsed ? "justify-center" : "px-4"}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Salir</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Superior */}
        <header className="navbar bg-base-100 border-b border-base-200 px-4 h-16 sticky top-0 z-40">
          <div className="navbar-start lg:hidden">
            <label htmlFor="mobile-drawer" className="btn btn-ghost btn-circle">
              <Menu size={20} />
            </label>
          </div>

          <div className="navbar-end gap-2 ml-auto">
            <button className="btn btn-ghost btn-circle btn-sm">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 ml-2 pl-2 border-l border-base-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Julian B.</p>
                <p className="text-[10px] opacity-50">Administrador</p>
              </div>
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8 shadow-inner font-bold">
                  <span className="text-xs text-white">JB</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;