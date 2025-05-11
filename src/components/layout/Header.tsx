
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-medical-dark">Emergency Response System</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-medical-red rounded-full"></span>
        </Button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-medical-blue text-white flex items-center justify-center text-sm font-medium">
            OP
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
