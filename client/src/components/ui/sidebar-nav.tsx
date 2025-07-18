import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Home, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Trophy, 
  Settings,
  GraduationCap
} from "lucide-react";

interface SidebarNavProps {
  user?: {
    firstName: string;
    lastName: string;
    grade: string;
  };
}

export function SidebarNav({ user }: SidebarNavProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "Tableau de bord", href: "/", icon: Home },
    { name: "Mes Matières", href: "/subjects", icon: BookOpen },
    { name: "Planning", href: "/schedule", icon: Calendar },
    { name: "Progression", href: "/progress", icon: TrendingUp },
    { name: "Récompenses", href: "/rewards", icon: Trophy },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-gray-900">ProfPlus</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-sm font-medium ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                {user?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Élève niveau {user?.grade || "N/A"}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
