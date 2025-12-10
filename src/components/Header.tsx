import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;

  const isActive = (path: string) => location.pathname === path;

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    setIsToolsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsToolsOpen(false);
    }, 300);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center transition-all hover:bg-white/30"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Desktop Navigation */}
      <nav className="container mx-auto px-6 py-8 hidden md:block">
        <ul className="flex items-center justify-center gap-8 lg:gap-16">
          <li>
            <Link
              to="/"
              className="relative text-white text-lg lg:text-2xl font-bold tracking-wide transition-all group"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Home
              <span
                className={`absolute bottom-[-6px] left-0 h-[2px] bg-white transition-all duration-300 ${
                  isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          </li>
          
          <li
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span 
              className="relative text-white text-lg lg:text-2xl font-bold tracking-wide transition-all cursor-pointer group flex items-center gap-2"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Tools
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`}
              />
              <span
                className={`absolute bottom-[-6px] left-0 h-[2px] bg-white transition-all duration-300 ${
                  isActive('/pfp-generator') || isActive('/meme-generator') || isActive('/rocky-game')
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }`}
              />
            </span>
            
            <div 
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white/10 backdrop-blur-xl rounded-2xl py-3 min-w-[220px] border border-white/20 shadow-2xl transition-all duration-300 ${
                isToolsOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              <Link
                to="/pfp-generator"
                className="block px-8 py-3 text-white text-lg font-semibold hover:bg-white/20 transition-all duration-200"
                style={{ fontFamily: "Gaegu, cursive" }}
              >
                Pfp Generator
              </Link>
              <Link
                to="/meme-generator"
                className="block px-8 py-3 text-white text-lg font-semibold hover:bg-white/20 transition-all duration-200"
                style={{ fontFamily: "Gaegu, cursive" }}
              >
                Meme Generator
              </Link>
              <Link
                to="/rocky-game"
                className="block px-8 py-3 text-white text-lg font-semibold hover:bg-white/20 transition-all duration-200"
                style={{ fontFamily: "Gaegu, cursive" }}
              >
                Rocky Game
              </Link>
            </div>
          </li>

          <li>
            <Link
              to="/swap"
              className="relative text-white text-lg lg:text-2xl font-bold tracking-wide transition-all group"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Swap
              <span
                className={`absolute bottom-[-6px] left-0 h-[2px] bg-white transition-all duration-300 ${
                  isActive('/swap') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          </li>

          <li>
            <Link
              to="/team"
              className="relative text-white text-lg lg:text-2xl font-bold tracking-wide transition-all group"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Team
              <span
                className={`absolute bottom-[-6px] left-0 h-[2px] bg-white transition-all duration-300 ${
                  isActive('/team') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 55 }}
      >
        <ul className="flex flex-col items-center justify-center h-full gap-8">
          <li>
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-white text-3xl font-bold tracking-wide"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Home
            </Link>
          </li>
          
          <li className="flex flex-col items-center gap-4">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="text-white text-3xl font-bold tracking-wide flex items-center gap-2"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Tools
              <ChevronDown className={`w-6 h-6 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isToolsOpen && (
              <div className="flex flex-col items-center gap-4 mt-2">
                <Link
                  to="/pfp-generator"
                  onClick={closeMobileMenu}
                  className="text-white text-xl font-semibold"
                  style={{ fontFamily: "Gaegu, cursive" }}
                >
                  Pfp Generator
                </Link>
                <Link
                  to="/meme-generator"
                  onClick={closeMobileMenu}
                  className="text-white text-xl font-semibold"
                  style={{ fontFamily: "Gaegu, cursive" }}
                >
                  Meme Generator
                </Link>
                <Link
                  to="/rocky-game"
                  onClick={closeMobileMenu}
                  className="text-white text-xl font-semibold"
                  style={{ fontFamily: "Gaegu, cursive" }}
                >
                  Rocky Game
                </Link>
              </div>
            )}
          </li>

          <li>
            <Link
              to="/swap"
              onClick={closeMobileMenu}
              className="text-white text-3xl font-bold tracking-wide"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Swap
            </Link>
          </li>

          <li>
            <Link
              to="/team"
              onClick={closeMobileMenu}
              className="text-white text-3xl font-bold tracking-wide"
              style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
            >
              Team
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
