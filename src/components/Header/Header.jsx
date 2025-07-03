// Header.jsx
import Logo from "./Logo";
import Navigations from "./Navigations";
import Profile from "./Profile";
import SearchAppBar from "./Search";
import MegaMenu from "./MegaMenu";
import { useHeader } from "../../context/HeaderContext";

const Header = () => {
  const { isTopHeaderVisible } = useHeader();

  return (
    <div className="relative">
      {/* Main Header */}
      <header
        dir="ltr"
        className={`fixed ${isTopHeaderVisible ? 'top-[48px] md:top-[72px]' : 'top-0'} left-0 right-0 w-full z-[50] bg-white shadow-strand border-b border-gray-200 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center h-[56px] md:h-[64px] px-4">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Navigations />
            </div>

            {/* Logo - Centered on mobile, left on desktop */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <Logo />
            </div>

            {/* Center section - Mega Menu Categories (Desktop only) */}
            <div className="hidden lg:flex flex-1 justify-center max-w-4xl mx-8">
              <MegaMenu />
            </div>

            {/* Spacer to push right content to the very end */}
            <div className="hidden lg:block flex-1"></div>

            {/* Right section - All icons */}
            <div className="flex items-center space-x-2">
              <div className="hidden md:block">
                <SearchAppBar />
              </div>
              <Profile />
            </div>
          </div>

          {/* Mobile Search - Full width below header */}
          <div className="md:hidden border-t border-gray-200 p-3">
            <div className="w-full">
                <SearchAppBar />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
