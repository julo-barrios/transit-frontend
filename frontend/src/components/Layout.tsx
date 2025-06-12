
import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="drawer">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-ghost shadow-sm">
          <div className="navbar-start">
            <label htmlFor="main-drawer" className="btn btn-ghost btn-circle drawer-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
          </div>

          <div className="navbar-center">
            <a className="text-xl normal-case">Transit</a>
          </div>

          <div className="navbar-end">
            <button className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405M19 13V6a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h8"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-4">{children}</main>
      </div>

      <div className="drawer-side">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/pasajeros">Pasajeros</Link></li>
            <li><Link to="/facturas">Facturas</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Layout;