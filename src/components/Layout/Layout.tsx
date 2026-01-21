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
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (

    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen bg-base-200/50">
        <div className="flex flex-1">
          {/* Sidebar Personalizada (Desktop - Minimizable) */}
          <aside
            className={`
              hidden lg:flex flex-col bg-base-100 border-r border-base-200 transition-all duration-300 ease-in-out sticky top-0 h-screen
              ${isCollapsed ? "w-20" : "w-72"}
            `}
          >
            {/* Menú de Navegación Desktop */}
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

            {/* Footer de la Sidebar Desktop */}
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
                  <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold leading-none max-w-[150px] truncate">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario"}
                      </p>
                      <p className="text-[10px] opacity-50 uppercase tracking-wide">
                        {user?.role === 'authenticated' ? 'Usuario' : (user?.role || 'Invitado')}
                      </p>
                    </div>
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8 shadow-inner font-bold">
                        {user?.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="Avatar" />
                        ) : (
                          <span className="text-xs text-white uppercase">
                            {(user?.email || "U").substring(0, 2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-x-hidden p-0">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer Side) */}
      <div className="drawer-side z-50 lg:hidden">
        <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col">
          {/* Logo / Header Mobile */}
          <div className="mb-6 px-2 flex items-center gap-2">
            <div className="bg-primary text-primary-content p-2 rounded-lg">
              <Building2 size={24} />
            </div>
            <span className="font-black text-xl tracking-tight">Transportes Julo</span>
          </div>

          <ul className="space-y-2 flex-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 py-3 px-4 rounded-xl ${isActive ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                    onClick={() => {
                      // Close drawer on click
                      const checkbox = document.getElementById('mobile-drawer') as HTMLInputElement;
                      if (checkbox) checkbox.checked = false;
                    }}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="divider"></div>

          <ul className="space-y-2">
            <li>
              <Link to="/configuracion" className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-base-200"
                onClick={() => {
                  const checkbox = document.getElementById('mobile-drawer') as HTMLInputElement;
                  if (checkbox) checkbox.checked = false;
                }}
              >
                <Settings size={20} />
                <span className="font-medium">Configuración</span>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-4 py-3 px-4 rounded-xl text-error hover:bg-base-200 w-full text-left">
                <LogOut size={20} />
                <span className="font-medium">Salir</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Layout;