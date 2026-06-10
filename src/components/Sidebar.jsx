import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const links = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/team", label: "Team", icon: <Users size={18} /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className={`
      fixed inset-y-16 left-0 z-30 w-64 border-r border-slate-200 bg-white px-4 py-6 transition-all duration-300 md:sticky md:block
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
    `}>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}