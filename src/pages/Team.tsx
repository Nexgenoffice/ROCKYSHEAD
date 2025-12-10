import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

interface TeamMember {
  id: number;
  name: string;
  image: string;
  description: string;
  role: string;
  twitter: string;
}

const Team = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { nightMode } = useTheme();

  useEffect(() => {
    const img = new Image();
    const imageSrc = nightMode ? '/murd_n.png' : '/murd.png';
    img.src = imageSrc;
    img.onload = () => setImageLoaded(true);
  }, [nightMode]);

  const checkPixelAlpha = (e: React.MouseEvent<HTMLImageElement>, img: HTMLImageElement): boolean => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const rect = img.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / rect.width * canvas.width);
    const y = Math.floor((e.clientY - rect.top) / rect.height * canvas.height);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return pixel[3] > 50; // Alpha > 50 pour considérer le pixel comme opaque
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>, index: number) => {
    const img = e.currentTarget;
    if (!checkPixelAlpha(e, img)) {
      setHoveredIndex(null);
      return;
    }

    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsClosing(false);
  };

  const closePopup = () => {
    if (isClosing) return; // Empêcher les clics multiples
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMember(null);
      setIsClosing(false);
    }, 300);
  };

  // Images de team avec positions style mur de tags
  const teamMembers: TeamMember[] = [
    { 
      id: 1, 
      name: 'Ash', 
      role: 'Co-founder',
      twitter: 'https://x.com/0xAsh24',
      image: '/team/ash.png',
      description: 'I\'m Ash, co-founder of Rocky\'s Head. I love Satoru Gojo.'
    },
    { 
      id: 2, 
      name: 'Nexgen', 
      role: 'Founder',
      twitter: 'https://x.com/nexgen_office',
      image: '/team/nex.png',
      description: 'Im Nexgen, founder of Rocky\'s Head, Let\'s Rocking Goooooo.' 
    },
    { 
      id: 3, 
      name: 'Oxy-Math', 
      role: 'Artist',
      twitter: 'https://x.com/Math_FTN74',
      image: '/team/oxy.png',
      description: 'French mag 9.0 by excellence. Still not sure how I got here, but I\'m having fun.' 
    },
    { 
      id: 4, 
      name: 'Isa', 
      role: 'Great Guide',
      twitter: 'https://x.com/infoCryptoWeb3',
      image: '/team/isa.png',
      description: 'The Rocky\'s Head guide. Wisdom and cats.' 
    },
    { 
      id: 5, 
      name: 'Novasko', 
      role: 'Community Manager',
      twitter: 'https://x.com/Novasko17',
      image: '/team/novasko.png',
      description: 'Hi I\'m Novasko, life is like a game, and I hate to lose.' 
    },
    { 
      id: 6, 
      name: 'Novee (Kevindu93)', 
      role: 'Dev',
      twitter: 'https://x.com/OgWxzz',
      image: '/team/novee.png',
      description: 'Just a random dev trying to make cool stuff. My code has bugs but I come from the 93.' 
    },
    { 
      id: 7, 
      name: 'Lele', 
      role: 'Artist',
      twitter: 'https://x.com/RockySeismic',
      image: '/team/lele.png',
      description: 'Hey I\'m Lele and I\'m an artist. I love candies and cute things.' 
    },
    { 
      id: 8, 
      name: 'ROH', 
      role: 'Team Member',
      twitter: 'https://x.com/ROH_ETH',
      image: '/team/roh.png',
      description: 'Hello, I\'m ROH, just a random artist making bangers.' 
    },
  ];

  // Nexgen en haut centre, les autres de chaque côté orientés vers l'intérieur
  const tagPositions = [
    { top: '0%', left: '10%', rotate: 0, scale: 0.90 },        // Ash - haut gauche (orienté vers l'intérieur)
    { top: '10%', left: '40%', rotate: 0, scale: 1.5 },        // Nexgen - en haut centre sous le header (le plus gros)
    { top: '0%', left: '65%', rotate: 0, scale: 0.90 },      // Oxy - haut droite (orienté vers l'intérieur)
    { top: '30%', left: '5%', rotate: 0, scale: 0.90 },       // Isa - milieu gauche (orienté vers l'intérieur)
    { top: '52%', left: '18%', rotate: 0, scale: 1.00 },       // Novasko - bas gauche
    { top: '30%', left: '75%', rotate: 0, scale: 0.8 },     // Novee - milieu droite (orienté vers l'intérieur)
    { top: '52%', left: '62%', rotate: 0, scale: 0.90 },      // Lele - bas droite
    { top: '55%', left: '40%', rotate: 0, scale: 0.90 },       // ROH - bas centre
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Fond murd.png */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: nightMode ? "url(/murd_n.png)" : "url(/murd.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Theme Toggle Buttons */}
      <ThemeToggle />

      {/* Mur de tags avec les membres de l'équipe */}
      {/* Mobile: Grid layout */}
      <div className="md:hidden relative z-10 w-full h-full overflow-y-auto pt-20 pb-8 px-4">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative aspect-square transition-all duration-300 hover:scale-105"
              onClick={() => handleMemberClick(member)}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-contain cursor-pointer"
                style={{
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
                  imageRendering: '-webkit-optimize-contrast',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm py-2 text-center">
                <p className="text-white text-sm font-bold" style={{ fontFamily: "Gaegu, cursive" }}>
                  {member.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Scattered layout */}
      <div className="hidden md:block relative z-10 w-full h-full p-8 mt-16">
        {teamMembers.map((member, index) => {
          const position = tagPositions[index];
          return (
            <div
              key={member.id}
              className="absolute w-80 h-80 transition-all duration-300"
              style={{
                top: position.top,
                left: position.left,
                transform: `rotate(${position.rotate}deg) scale(${position.scale})`,
                zIndex: hoveredIndex === index ? 50 : 10,
                pointerEvents: 'none',
              }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-contain transition-all duration-200 ease-out cursor-pointer"
                style={{
                  transform: hoveredIndex === index 
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) rotate(0deg)`
                    : 'translate(0, 0)',
                  filter: hoveredIndex === index 
                    ? 'drop-shadow(0 25px 40px rgba(0,0,0,0.6))' 
                    : 'drop-shadow(0 15px 25px rgba(0,0,0,0.4))',
                  imageRendering: '-webkit-optimize-contrast',
                  pointerEvents: 'auto',
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleMemberClick(member)}
              />
            </div>
          );
        })}
      </div>

      {/* Popup Modal */}
      {selectedMember && (
        <div 
          key={selectedMember.id}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closePopup}
          style={{
            animation: isClosing ? 'fadeOut 0.3s ease-out forwards' : 'fadeIn 0.3s ease-out forwards',
            pointerEvents: isClosing ? 'none' : 'auto'
          }}
        >
          <div 
            className="relative bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 max-w-5xl w-full mx-4 border-4 md:border-8 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_rgba(0,0,0,1)] overflow-visible"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isClosing 
                ? 'scaleOut 0.3s cubic-bezier(0.36, 0, 0.66, -0.56) forwards' 
                : 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            }}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-[#D4A574] rounded-full text-[#D4A574] text-2xl md:text-3xl font-black hover:scale-110 transition-transform border-2 md:border-4 border-black shadow-lg flex items-center justify-center"
              style={{
                color: '#D4A574',
                backgroundColor: 'white'
              }}
            >
              ×
            </button>

            {/* Photo du membre - Chevauche à gauche sur desktop, en haut sur mobile */}
            <div 
              className="relative md:absolute mx-auto md:mx-0 md:-left-32 md:top-1/2 md:-translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] z-10 mb-4 md:mb-0"
              style={{
                backgroundImage: `url(${selectedMember.image})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "drop-shadow(8px 8px 12px rgba(0,0,0,0.4))"
              }}
            />

            {/* Info du membre */}
            <div className="md:ml-72 flex-1 text-center md:text-left">
              <h2 
                className="text-4xl md:text-8xl font-black mb-2 md:mb-4 uppercase tracking-tight"
                style={{ 
                  fontFamily: "Gaegu, cursive",
                  color: '#D4A574',
                  textShadow: "none",
                  filter: "drop-shadow(3px 3px 0px rgba(0,0,0,0.2))"
                }}
              >
                {selectedMember.name}
              </h2>
              <p 
                className="text-gray-600 text-2xl md:text-4xl mb-4 md:mb-8 uppercase tracking-wide"
                style={{ 
                  fontFamily: "Gaegu, cursive",
                  fontWeight: 700
                }}
              >
                {selectedMember.role}
              </p>
              <p 
                className="text-gray-800 text-xl md:text-3xl leading-relaxed mb-4 md:mb-6"
                style={{ 
                  fontFamily: "Gaegu, cursive",
                  fontWeight: 400
                }}
              >
                {selectedMember.description}
              </p>
              <a 
                href={selectedMember.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-blue-400 transition-colors border-2 md:border-4 border-black shadow-lg"
                style={{ fontFamily: "Gaegu, cursive", fontWeight: 700 }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-lg md:text-2xl">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
