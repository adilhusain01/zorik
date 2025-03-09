"use client";

import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-full w-full px-4 md:px-8 lg:px-[12.5rem]">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo || "/placeholder.svg"}
                alt="Logo"
                className="h-[12.5rem] object-contain filter brightness-110"
              />
              {/* <span className="font-bold text-xl gradient-text hidden md:block">
                ConceptBridge
              </span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/mindmap"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Mind Maps
            </Link>
            <div className="flex items-center gap-4 ml-4">
              {user && (
                <Link to="/profile" className="relative group">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-purple-400 opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition duration-200"></div>
                  <img
                    src={user.picture || "/placeholder.svg"}
                    alt="Profile"
                    className="relative w-9 h-9 rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-300"
                  />
                </Link>
              )}
              <button
                onClick={user ? logout : login}
                className="px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500 text-white"
              >
                {user ? "Logout" : "Login with Google"}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link to="/profile" className="mr-4">
                <img
                  src={user.picture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-primary"
                />
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect absolute top-full left-0 right-0 py-4 px-4 border-t border-white/10 shadow-lg">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/mindmap"
              className="text-gray-300 hover:text-white py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mind Maps
            </Link>
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={user ? logout : login}
                className="w-full py-2 rounded-lg font-medium shadow-lg transition-all bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500 text-white"
              >
                {user ? "Logout" : "Login with Google"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
