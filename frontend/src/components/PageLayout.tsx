import React from "react";
import { Link } from "react-router-dom";

interface PageLayoutProps {
  title: string;
  breadcrumbs: string[];
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, breadcrumbs, children }) => {
  return (
    <div className="w-full px-4 py-6">
      {/* Header */}
      <div className="card bg-base-300 rounded-box p-4">
        <div className="breadcrumbs text-sm">
          <ul>
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx}>
                {idx === breadcrumbs.length - 1 ? (
                  <span>{crumb}</span>
                ) : (
                  <Link to="/ruta">{crumb}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Content */}
      <div className="card bg-base-100 rounded-box p-4 shadow">{children}</div>
    </div>
  );
};

export default PageLayout;
