
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthDialog from "./AuthDialog";
import { useState } from "react";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            HackBuddy
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  href="/" 
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  href="/about" 
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Sign In
                  </Button>
                </AuthDialog>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
