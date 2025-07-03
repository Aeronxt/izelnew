// TopHeader.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useHeader } from "../../context/HeaderContext";

const TopHeader = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const { isTopHeaderVisible, setIsTopHeaderVisible } = useHeader();

  const banners = [
    {
      text: "CLICK & COLLECT YOUR ORDER FOR FREE",
      link: "/contact",
      bgColor: "bg-strand-red"
    },
    {
      text: "SEEN IT FOR LESS? WE WILL PRICE MATCH*",
      link: "/about",
      bgColor: "bg-strand-red"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (!isTopHeaderVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 w-full z-[60] h-[48px] md:h-[72px]">
      {/* Promotional Banner Carousel */}
      <div className={`${banners[currentBanner].bgColor} text-white h-[32px] md:h-[44px] relative overflow-hidden`}>
        <div className="flex items-center justify-center h-full px-8 md:px-4">
          <Link 
            to={banners[currentBanner].link}
            className="text-center hover:underline transition-all duration-300"
          >
            <p className="text-[10px] md:text-sm font-medium tracking-wide truncate">
              {banners[currentBanner].text}
            </p>
          </Link>
          
          {/* Close button */}
          <button
            onClick={() => setIsTopHeaderVisible(false)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors duration-200"
            aria-label="Close banner"
          >
            <X size={14} className="md:w-4 md:h-4" />
          </button>
        </div>

        {/* Progress indicators - hidden on mobile */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 hidden md:flex space-x-1">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 rounded-full transition-all duration-300 ${
                index === currentBanner ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Secondary promotional banner */}
      <div className="bg-strand-gray-800 text-white h-[16px] md:h-[28px] flex items-center">
        <div className="flex justify-center items-center max-w-7xl mx-auto px-2 md:px-4 w-full">
          <div className="flex items-center md:space-x-6">
            <Link to="/allProducts" className="text-[9px] md:text-xs hover:underline truncate">
              SALE UP TO 50% OFF* | SHOP NOW
            </Link>
            <Link to="/category/travel" className="text-xs hover:underline hidden md:block">
              SPEND ৳3000 SAVE 30%* ON ALL | SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
