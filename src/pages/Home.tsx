import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const { nightMode, lightsOn } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSocialClick = (platform: string) => {
    const links = {
      // discord removed: Discord is "coming soon" and should not open a link
      twitter: 'https://x.com/RockySeismic'
    };
    if (platform === 'twitter') {
      window.open(links[platform as keyof typeof links], '_blank');
    }
  };

  const getBackgroundImage = () => {
    if (!nightMode) return "url(/pres3.png)";
    return lightsOn ? "url(/nuit_lum.png)" : "url(/nuuit_sans_lum.png)";
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background image with parallax effect */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          backgroundImage: getBackgroundImage(),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`,
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          imageRendering: "crisp-edges",
        }}
      />

      {/* Theme Toggle Buttons */}
      <ThemeToggle />

      {/* Social media buttons - positioned at the bottom left */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex flex-col gap-3 md:gap-4 z-50">
        {/* Discord Button — coming soon tooltip on hover (no link) */}
        <button
          onClick={(e) => e.preventDefault()}
          onMouseEnter={() => setHoveredSocial('discord')}
          onMouseLeave={() => setHoveredSocial(null)}
          onFocus={() => setHoveredSocial('discord')}
          onBlur={() => setHoveredSocial(null)}
          aria-label="Discord (coming soon)"
          title="Coming soon"
          className="relative group cursor-default"
        >
          <div
            className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/30 ${
              hoveredSocial === 'discord'
                ? 'bg-[#5865F2] scale-110 shadow-2xl shadow-[#5865F2]/50'
                : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
            }`}
          >
            <svg
              className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-300 ${
                hoveredSocial === 'discord' ? 'text-white' : 'text-white/80'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>
          {/* Tooltip - visible when hovered */}
          {hoveredSocial === 'discord' && (
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 whitespace-nowrap bg-black/90 text-white text-sm px-3 py-1 shadow-lg rounded-full"
              style={{ fontFamily: 'Gaegu, cursive', fontWeight: 700 }}
            >
              coming soon
            </div>
          )}
        </button>

        {/* X/Twitter Button */}
        <button
          onClick={() => handleSocialClick('twitter')}
          onMouseEnter={() => setHoveredSocial('twitter')}
          onMouseLeave={() => setHoveredSocial(null)}
          className="relative group"
        >
          <div
            className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/30 ${
              hoveredSocial === 'twitter'
                ? 'bg-black scale-110 shadow-2xl shadow-black/50'
                : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
            }`}
          >
            <svg
              className={`w-7 h-7 md:w-9 md:h-9 transition-colors duration-300 ${
                hoveredSocial === 'twitter' ? 'text-white' : 'text-white/80'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
