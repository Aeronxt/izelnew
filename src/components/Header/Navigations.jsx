import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext, auth } from "../../Auth/firebase";
import { Menu, X, ChevronDown } from "lucide-react";

const Navigations = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // Navigation items matching Strand Bags structure
  const navigationItems = [
    { 
      label: "SALE", 
      path: "/allProducts", 
      highlight: true, 
      dropdownItems: [
        { label: "All Sale Items", path: "/allProducts" },
        { label: "Handbags Sale", path: "/category/handbags-sale" },
        { label: "Travel Sale", path: "/category/travel-sale" }
      ]
    },
    { 
      label: "NEW IN", 
      path: "/category/new-in",
      dropdownItems: [
        { label: "Latest Arrivals", path: "/category/new-in" },
        { label: "New Handbags", path: "/category/new-handbags" },
        { label: "New Travel", path: "/category/new-travel" }
      ]
    },
    { 
      label: "HANDBAGS", 
      path: "/category/handbags",
      dropdownItems: [
        { label: "All Handbags", path: "/category/handbags" },
        { label: "Tote Bags", path: "/category/tote-bags" },
        { label: "Crossbody Bags", path: "/category/crossbody" },
        { label: "Shoulder Bags", path: "/category/shoulder-bags" },
        { label: "Mini Bags", path: "/category/mini-bags" }
      ]
    },
    { 
      label: "TRAVEL", 
      path: "/category/travel",
      dropdownItems: [
        { label: "All Travel", path: "/category/travel" },
        { label: "Suitcases", path: "/category/suitcases" },
        { label: "Travel Bags", path: "/category/travel-bags" },
        { label: "Backpacks", path: "/category/backpacks" }
      ]
    },
    { 
      label: "WOMENS", 
      path: "/category/women",
      dropdownItems: [
        { label: "All Women's", path: "/category/women" },
        { label: "Handbags", path: "/category/womens-handbags" },
        { label: "Wallets", path: "/category/womens-wallets" },
        { label: "Accessories", path: "/category/womens-accessories" }
      ]
    },
    { 
      label: "MENS", 
      path: "/category/men",
      dropdownItems: [
        { label: "All Men's", path: "/category/men" },
        { label: "Bags", path: "/category/mens-bags" },
        { label: "Wallets", path: "/category/mens-wallets" },
        { label: "Travel", path: "/category/mens-travel" }
      ]
    },
    { 
      label: "BACKPACKS", 
      path: "/category/backpacks",
      dropdownItems: [
        { label: "All Backpacks", path: "/category/backpacks" },
        { label: "Laptop Bags", path: "/category/laptop-bags" },
        { label: "School Bags", path: "/category/school-bags" },
        { label: "Travel Backpacks", path: "/category/travel-backpacks" }
      ]
    },
    { 
      label: "WALLETS", 
      path: "/category/wallets",
      dropdownItems: [
        { label: "All Wallets", path: "/category/wallets" },
        { label: "Women's Wallets", path: "/category/womens-wallets" },
        { label: "Men's Wallets", path: "/category/mens-wallets" },
        { label: "Card Holders", path: "/category/card-holders" }
      ]
    },
    { 
      label: "BRANDS", 
      path: "/category/brands",
      dropdownItems: [
        { label: "All Brands", path: "/category/brands" },
        { label: "Guess", path: "/category/guess" },
        { label: "Samsonite", path: "/category/samsonite" },
        { label: "American Tourister", path: "/category/american-tourister" }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block w-full">
        <div className="flex items-center justify-center space-x-6 xl:space-x-8">
          {navigationItems.map((item, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.path}
                className={`text-sm font-medium tracking-wide hover:text-strand-red transition-colors duration-200 whitespace-nowrap ${
                  item.highlight ? 'text-strand-red' : 'text-strand-black'
                } ${location.pathname === item.path ? 'text-strand-red' : ''}`}
              >
                {item.label}
              </Link>
              
              {/* Dropdown Menu */}
              {item.dropdownItems && (
                <div className={`absolute top-full left-0 w-48 bg-white shadow-strand-lg border border-gray-200 py-2 z-50 transform transition-all duration-200 ${
                  activeDropdown === index ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                  {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                    <Link
                      key={dropdownIndex}
                      to={dropdownItem.path}
                      className="block px-4 py-2 text-sm text-strand-gray-700 hover:bg-strand-gray-100 hover:text-strand-red transition-colors duration-150"
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <li>
            <Link to="/track-delivery" className="text-sm font-medium hover:text-blue-600">
              Track Delivery
            </Link>
          </li>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-strand-black hover:text-strand-red transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[70]" onClick={toggleMobileMenu}>
            <div 
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto z-[80]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-strand-black hover:text-strand-red transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4">
                {navigationItems.map((item, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-3 text-base font-medium ${
                          item.highlight ? 'text-strand-red' : 'text-strand-black'
                        } ${location.pathname === item.path ? 'text-strand-red' : ''}`}
                      >
                        {item.label}
                      </Link>
                      {item.dropdownItems && (
                        <button
                          onClick={() => handleDropdownToggle(index)}
                          className="p-2 text-strand-gray-500"
                        >
                          <ChevronDown 
                            size={16} 
                            className={`transform transition-transform duration-200 ${
                              activeDropdown === index ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Dropdown */}
                    {item.dropdownItems && activeDropdown === index && (
                      <div className="ml-4 border-l border-gray-200 pl-4">
                        {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                          <Link
                            key={dropdownIndex}
                            to={dropdownItem.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm text-strand-gray-600 hover:text-strand-red transition-colors duration-150"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Auth Links */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {currentUser ? (
                    <>
                      <Link
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 text-base text-strand-black hover:text-strand-red transition-colors duration-200"
                      >
                        Account
                      </Link>
                      <button
                    onClick={handleLogout}
                        className="block w-full text-left py-3 text-base text-strand-black hover:text-strand-red transition-colors duration-200"
                      >
                        Logout
                      </button>
        </>
      ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 text-base text-strand-black hover:text-strand-red transition-colors duration-200"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 text-base text-strand-black hover:text-strand-red transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigations;
