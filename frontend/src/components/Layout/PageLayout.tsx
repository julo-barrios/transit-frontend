import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface PageLayoutProps {
  title: string;
  breadcrumbs: string[];
  children: React.ReactNode;
  action?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, breadcrumbs, children, action }) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8">
      {/* Header Minimalista */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-xs mb-3 opacity-50 uppercase tracking-wider font-bold">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={12} />}
                <Link to="/" className="hover:text-primary transition-colors italic">
                  {crumb}
                </Link>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-4xl font-black text-base-content tracking-tight">
            {title}
          </h1>
        </div>
        {action && (
          <div className="flex items-center gap-3">
            {action}
          </div>
        )}
      </div>

      {/* Contenedor de Contenido Limpio */}
      <div className="card bg-base-100 shadow-xl shadow-base-300/10 border border-base-200">
        <div className="card-body p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;