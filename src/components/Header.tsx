import React, { useState } from 'react';
import { Home, Menu, X, User, Calculator, BookOpen, Mail, Info } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (page: string) => {
    setIsMenuOpen(false);
    toast({
      title: "Navigation",
      description: `Navigating to ${page}...`,
    });
  };

  return (
    <header className="bg-primary/90 backdrop-blur-sm border-b border-border shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 cursor-pointer hover-scale" onClick={() => window.location.reload()}>
            <img 
              src="/rgukt.webp" 
              alt="RGUKT Logo" 
              className="h-10 w-10 rounded-full"
              loading="eager"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-primary-foreground">
                RGUKT
              </h1>
              <p className="text-sm text-primary-foreground/80">CGPA & SGPA Calculator</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => handleNavigation('Home')}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => handleNavigation('Calculator')}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => handleNavigation('Blog')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => handleNavigation('About')}
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => handleNavigation('Contact')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => handleNavigation('Login')}
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-primary-foreground"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-in-right">
            <nav className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => handleNavigation('Home')}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => handleNavigation('Calculator')}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => handleNavigation('Blog')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Blog
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => handleNavigation('About')}
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => handleNavigation('Contact')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button
                variant="outline"
                className="justify-start border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => handleNavigation('Login')}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};