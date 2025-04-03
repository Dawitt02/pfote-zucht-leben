
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dog, Calendar, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function Navbar() {
  const isMobile = useIsMobile();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        <NavItem to="/" icon={<Home className="nav-icon" />} label={isMobile ? null : "Home"} />
        <NavItem to="/dogs" icon={<Dog className="nav-icon" />} label={isMobile ? null : "Hunde"} />
        <NavItem to="/breeding" icon={<Calendar className="nav-icon" />} label={isMobile ? null : "Zucht"} />
        <NavItem to="/health" icon={<Activity className="nav-icon" />} label={isMobile ? null : "Gesundheit"} />
        <NavItem to="/community" icon={<Users className="nav-icon" />} label={isMobile ? null : "Community"} />
      </div>
    </nav>
  );
}

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string | null;
};

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "nav-item touch-target",
          isActive 
            ? "text-zucht-amber" 
            : "text-zucht-brown/70 hover:text-zucht-brown"
        )
      }
    >
      {icon}
      {label && <span className="text-xs mt-1">{label}</span>}
    </NavLink>
  );
}

export default Navbar;
