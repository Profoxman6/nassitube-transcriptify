import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from "@/components/ui/button";
import { Home, History, User, Globe } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/10 backdrop-blur-sm fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto p-4 border-t md:border-b border-white/20">
      <div className="max-w-6xl mx-auto flex justify-center md:justify-between items-center gap-4">
        <div className="hidden md:block">
          <Link to="/" className="text-white text-xl font-bold">
            نصي تيوب - Nassi Tube
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isActive('/') ? "secondary" : "ghost"}
            asChild
            className="text-white"
          >
            <Link to="/">
              <Home className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </Button>

          <Button
            variant={isActive('/all-transcripts') ? "secondary" : "ghost"}
            asChild
            className="text-white"
          >
            <Link to="/all-transcripts">
              <Globe className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Community</span>
            </Link>
          </Button>

          {user && (
            <>
              <Button
                variant={isActive('/history') ? "secondary" : "ghost"}
                asChild
                className="text-white"
              >
                <Link to="/history">
                  <History className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">History</span>
                </Link>
              </Button>

              <Button
                variant={isActive('/profile') ? "secondary" : "ghost"}
                asChild
                className="text-white"
              >
                <Link to="/profile">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;