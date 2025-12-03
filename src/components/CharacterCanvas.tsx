/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ACCESSORY_CATEGORIES } from "./config";

interface CharacterCanvasProps {
  selectedAccessories: Record<string, string | null>;
  onReset: () => void;
}

export default function CharacterCanvas({
  selectedAccessories,
  onReset,
}: CharacterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const baseImageRef = useRef<HTMLImageElement>(null);

  const TEMPLATE_IMAGE_URL = "/template.png";

  // Load template image once
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = TEMPLATE_IMAGE_URL;
    img.onload = () => {
      baseImageRef.current = img;
      setIsImageLoaded(true);
    };
  }, []);

  // Draw canvas with layered images
  useEffect(() => {
    if (!canvasRef.current || !isImageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const drawLayers = async () => {
      // 1. Draw selected fond (background)
      const fondsId = selectedAccessories.fonds;
      
      // Check if it's an uploaded image (data URL) or a predefined option
      let backgroundSrc = null;
      if (fondsId) {
        if (fondsId.startsWith('data:image/')) {
          // It's an uploaded image
          backgroundSrc = fondsId;
        } else {
          // It's a predefined option
          const selectedFond = ACCESSORY_CATEGORIES.fonds.options.find((o) => o.id === fondsId);
          if (selectedFond && selectedFond.type === "image") {
            backgroundSrc = selectedFond.value;
          }
        }
      } else {
        // Default background
        backgroundSrc = ACCESSORY_CATEGORIES.fonds.options[0].value;
      }

      if (backgroundSrc) {
        const fondImg = new Image();
        fondImg.crossOrigin = "anonymous";
        fondImg.src = backgroundSrc;
        await new Promise((resolve) => {
          fondImg.onload = () => {
            ctx.drawImage(fondImg, 0, 0, width, height);
            resolve(null);
          };
          fondImg.onerror = () => {
            console.error('Failed to load background image');
            resolve(null);
          };
        });
      }

      // 2. Draw template.png over the background
      if (baseImageRef.current) {
        ctx.drawImage(baseImageRef.current, 0, 0, width, height);
      }

      // 3. Draw Accessories on top of template
      const drawOrder = [
        "eyes",
        "mouth",
        "clothes",
        "hair",
        "badges",
        "accessories",
      ];

      for (const category of drawOrder) {
        const accessory = selectedAccessories[category];
        if (!accessory) continue;

        const categoryData =
          ACCESSORY_CATEGORIES[category as keyof typeof ACCESSORY_CATEGORIES];
        if (!categoryData) continue;

        const { position, options } = categoryData;
        const option = options.find((o: any) => o.id === accessory);

        if (option) {
          ctx.save();

          if (option.type === "emoji" || option.type === "text") {
            ctx.translate(
              position.x,
              position.y + ((option as any).yOffset || 0)
            );
            const scale = (option as any).scale || 1;
            ctx.font = `${scale * 40}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(option.value, 0, 0);
          } else if (option.type === "image") {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = option.value;
            await new Promise((resolve) => {
              img.onload = () => {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(null);
              };
            });
          }

          ctx.restore();
        }
      }
    };

    drawLayers();
  }, [selectedAccessories, isImageLoaded]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement("a");
      link.download = "rocky-head.png";
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert(
        "Unable to download image (browser security). Try taking a screenshot."
      );
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState("");

  const handleShare = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageUrl = canvas.toDataURL("image/png");
      setShareImageUrl(imageUrl);
      setShowShareModal(true);
    } catch (err) {
      console.error("Share failed", err);
      alert("Unable to generate image for sharing.");
    }
  };

  const handleShareOnX = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const text = "Gmic Grocky 🤎\n\nLook at my pfp made by the Rocky's Head pfp generator of @RockySeismic ✨\n\nTry it and make yours at : https://rocky-generator.vercel.app/\n\nRocky's Head on @SeismicSys 🔥";

    try {
      // Try to copy image to clipboard
      canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            alert("Image copied to clipboard! You can now paste it on X/Twitter.");
          } catch (clipboardErr) {
            console.log("Clipboard copy failed, opening X anyway", clipboardErr);
          }
        }
        
        // Detect if mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Open X/Twitter - try app first on mobile, then web
        if (isMobile) {
          // Try to open Twitter app
          const twitterAppUrl = `twitter://post?message=${encodeURIComponent(text)}`;
          window.location.href = twitterAppUrl;
          
          // Fallback to web after 1 second if app doesn't open
          setTimeout(() => {
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            window.open(tweetUrl, '_blank');
          }, 1000);
        } else {
          // Desktop - open in new tab
          const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
          window.open(tweetUrl, '_blank');
        }
      });
    } catch (err) {
      console.error("Share failed", err);
      // Still open X even if copy fails
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(tweetUrl, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-center w-fit max-w-[90%] lg:mb-0 mb-5">
      <div
        className="bg-[#1E1917] rounded-3xl shadow-2xl border border-[#463832]/50 w-full lg:p-6 p-4"
        style={{
          backgroundColor: "rgba(30, 25, 23, 0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* Canvas Section */}
        <div
          className="flex flex-col items-center justify-center flex-1"
          style={{
            minWidth: 0,
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden border border-[#463832] bg-white shadow-xl lg:max-w-[450px] lg:max-h-[450px] max-w-[600px]"
            style={{
              minWidth: "250px",
              minHeight: "250px",
            }}
          >
            <canvas
              ref={canvasRef}
              width={1000}
              height={1000}
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                objectFit: "contain",
                backgroundColor: "white",
              }}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-[#8B7355]">
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* Buttons Section - Right Side */}
        <div className="flex justify-center h-full lg:mt-5 mt-2 lg:gap-5 gap-2">
          <Button
            onClick={onReset}
            variant="outline"
            className="bg-[#5A4A3A] border-[#5A4A3A] text-white hover:bg-[#6B5B4D] transition-all rounded-xl shadow-lg"
            style={{
              width: "100%",
              padding: "min(1rem, 2vh) min(1.5rem, 2vw)",
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              minHeight: "35px",
            }}
          >
            <RotateCcw
              style={{
                width: "clamp(16px, 2vw, 20px)",
                height: "clamp(16px, 2vw, 20px)",
                marginRight: "0.5rem",
              }}
            />
            Reset
          </Button>

          <Button
            onClick={handleDownload}
            className="bg-[#8B7355] text-white hover:bg-[#A68A6D] transition-all rounded-xl shadow-lg"
            style={{
              width: "100%",
              padding: "min(1rem, 2vh) min(1.5rem, 2vw)",
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              minHeight: "35px",
            }}
          >
            <Download
              style={{
                width: "clamp(16px, 2vw, 20px)",
                height: "clamp(16px, 2vw, 20px)",
                marginRight: "0.5rem",
              }}
            />
            <p className="hidden sm:block">Download</p>
            <p className="block sm:hidden">Save</p>
          </Button>

          <Button
            onClick={handleShare}
            variant="secondary"
            className="bg-[#5A4A3A] text-white hover:bg-[#6B5B4D] transition-all rounded-xl shadow-lg"
            style={{
              width: "100%",
              padding: "min(1rem, 2vh) min(1.5rem, 2vw)",
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              minHeight: "35px",
            }}
          >
            <Share2
              style={{
                width: "clamp(16px, 2vw, 20px)",
                height: "clamp(16px, 2vw, 20px)",
                marginRight: "0.5rem",
              }}
            />
            Share
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-[#1E1917] rounded-3xl shadow-2xl border border-[#463832] p-6 max-w-2xl w-[90%] mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "rgba(30, 25, 23, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 className="text-2xl font-bold text-[#D4C5B5] mb-4 text-center">
              Share Your Rocky!
            </h3>
            
            <div className="mb-4 rounded-xl overflow-hidden border border-[#463832] max-w-xs mx-auto">
              <img 
                src={shareImageUrl} 
                alt="Your Rocky's head" 
                className="w-full h-auto"
              />
            </div>

            <div className="bg-[#2A2320] rounded-xl p-4 mb-4 border border-[#463832]">
              <p className="text-[#D4C5B5] text-sm text-center whitespace-pre-line">
                <span className="font-bold">Gmic Grocky 🤎</span>
                {"\n\n"}
                Look at my pfp made by the Rocky's Head pfp generator of{" "}
                <span className="text-[#8B7355] font-semibold">@RockySeismic</span> ✨
                {"\n\n"}
                Try it and make yours at :{"\n"}
                <span className="text-[#A68A6D]">https://rocky-generator.vercel.app/</span>
                {"\n\n"}
                Rocky's Head on <span className="text-[#8B7355] font-semibold">@SeismicSys</span> 🔥
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleShareOnX}
                className="flex-1 bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-all rounded-xl shadow-lg font-semibold"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </Button>
              
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                className="bg-[#5A4A3A] border-[#5A4A3A] text-white hover:bg-[#6B5B4D] transition-all rounded-xl shadow-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
