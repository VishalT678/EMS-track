
import { cn } from "@/lib/utils";
import { 
  Ambulance, 
  Hospital, 
  Map, 
  BarChart3, 
  Bell, 
  Settings, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: BarChart3, path: "/" },
  { name: "Map View", icon: Map, path: "/map" },
  { name: "Ambulances", icon: Ambulance, path: "/ambulances" },
  { name: "Hospitals", icon: Hospital, path: "/hospitals" }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-white shadow-md h-screen transition-all duration-300 flex flex-col border-r",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center">
            <Ambulance className="h-6 w-6 text-medical-red mr-2" />
            <span className="font-bold text-medical-dark">EMS Track</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-2 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center p-3 rounded-md transition-colors hover:bg-medical-light group",
                collapsed ? "justify-center" : "justify-start",
                window.location.pathname === item.path && "bg-medical-light text-medical-dark"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  window.location.pathname === item.path
                    ? "text-medical-blue"
                    : "text-gray-500 group-hover:text-medical-blue"
                )}
              />
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell size={20} className="text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings size={20} className="text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
