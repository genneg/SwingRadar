import { Home, Search, Heart, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Compass", href: "/" },
  { id: "search", icon: Search, label: "Explore", href: "/search" },
  { id: "following", icon: Heart, label: "Following", href: "/dashboard" },
  { id: "profile", icon: User, label: "Profile", href: "/profile" }
];

export function BottomNavigationEnhanced({ activeTab, onTabChange }: BottomNavigationProps) {
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Enhanced background with blur effect */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-xl border-t border-border/50"></div>
      
      {/* Navigation content */}
      <div className="relative px-4 py-3 safe-area-pb">
        <div className="relative">
          {/* Enhanced Floating Action Button */}
          <Button
            size="icon"
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl border-4 border-background transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
          >
            <Plus className="w-6 h-6" />
          </Button>
          
          {/* Navigation items */}
          <div className="flex justify-around items-center pt-2">
            {navItems.map((item, index) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-3 px-4 transition-all duration-300 relative",
                    activeTab === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                    // Add extra spacing for middle items to account for FAB
                    index === 1 ? "mr-8" : index === 2 ? "ml-8" : ""
                  )}
                  onClick={() => handleTabClick(item.id)}
                >
                  {/* Active indicator */}
                  {activeTab === item.id && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                  )}
                  
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    activeTab === item.id ? "scale-110" : "group-hover:scale-105"
                  )} />
                  <span className={cn(
                    "text-xs transition-all duration-300",
                    activeTab === item.id ? "font-medium" : "font-normal"
                  )}>
                    {item.label}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-card/95"></div>
    </div>
  );
}