import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

const SearchAppBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { products } = useProducts();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);

    setSearchResults(filteredResults);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/allProducts?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue("");
      setSearchResults([]);
      setIsExpanded(false);
    }
  };

  const handleReset = () => {
    setSearchValue('');
    setSearchResults([]);
  };

  const handleIconClick = () => {
    if (!isMobile) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      } else {
        setSearchValue('');
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsExpanded(false);
      setIsSearchOpen(false);
      setSearchValue('');
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mobile search bar
  if (isMobile) {
    return (
      <div className="relative w-full" ref={containerRef}>
        <form className="form relative w-full" onSubmit={handleSubmit}>
          <button 
            type="submit"
            className="absolute left-3 -translate-y-1/2 top-1/2 p-1 hover:text-black transition-colors duration-200 z-10"
          >
            <svg 
              width={17} 
              height={16} 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              role="img" 
              aria-labelledby="search" 
              className="w-5 h-5 text-gray-700"
            >
              <path 
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" 
                stroke="currentColor" 
                strokeWidth="1.333" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </button>
          <input 
            ref={inputRef}
            className="input rounded-full px-10 py-2.5 border-2 border-gray-200 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-sm w-full bg-white text-sm" 
            placeholder="Search products..." 
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => {
              setTimeout(() => setIsSearchOpen(false), 200);
            }}
          />
          {searchValue && (
            <button 
              type="button"
              onClick={handleReset}
              className="absolute right-3 -translate-y-1/2 top-1/2 p-1 hover:text-black transition-colors duration-200 z-10"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </form>

        {/* Mobile Search Results */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-50 max-h-64 overflow-y-auto">
            {searchResults.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  navigate(`/product/${product.id}`);
                  setIsSearchOpen(false);
                  setSearchValue("");
                  setSearchResults([]);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image_url || "/assets/notFound.png"}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/assets/notFound.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {product.category} • ${product.price}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {/* View All Results Link */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                to={`/allProducts?search=${encodeURIComponent(searchValue)}`}
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchValue("");
                  setSearchResults([]);
                }}
                className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors duration-150 text-center font-medium"
              >
                View all results for &quot;{searchValue}&quot;
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop search (existing code)
  return (
    <div className="relative" ref={containerRef}>
      {/* Search Icon - Always visible */}
      <button
        onClick={handleIconClick}
        className="p-2 text-gray-700 hover:text-black transition-colors duration-200 rounded-full hover:bg-gray-100"
        aria-label="Search"
      >
        <svg 
          width={20} 
          height={20} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-5 h-5"
        >
          <path 
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM20 20l-4.35-4.35" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </button>

      {/* Expanded Search Form */}
      <div 
        className={`absolute right-0 top-0 transition-all duration-300 ease-in-out ${
          isExpanded 
            ? 'w-80 opacity-100 pointer-events-auto' 
            : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        <form className="form relative" onSubmit={handleSubmit}>
          <button 
            type="submit"
            className="absolute left-2 -translate-y-1/2 top-1/2 p-1 hover:text-black transition-colors duration-200"
          >
            <svg 
              width={17} 
              height={16} 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              role="img" 
              aria-labelledby="search" 
              className="w-5 h-5 text-gray-700"
            >
              <path 
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" 
                stroke="currentColor" 
                strokeWidth="1.333" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </button>
          <input 
            ref={inputRef}
            className="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-full bg-white" 
            placeholder="Search..." 
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => {
              setTimeout(() => setIsSearchOpen(false), 200);
            }}
          />
          {searchValue && (
            <button 
              type="button"
              onClick={handleReset}
              className="absolute right-3 -translate-y-1/2 top-1/2 p-1 hover:text-black transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Search Results Dropdown */}
      {isExpanded && isSearchOpen && searchResults.length > 0 && (
        <div className="absolute top-full right-0 mt-1 w-80 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-50 max-h-80 overflow-y-auto">
          {searchResults.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                navigate(`/product/${product.id}`);
                setIsSearchOpen(false);
                setSearchValue("");
                setSearchResults([]);
                setIsExpanded(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={product.image_url || "/assets/notFound.png"}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "/assets/notFound.png";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {product.category} • ${product.price}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* View All Results Link */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <Link
              to={`/allProducts?search=${encodeURIComponent(searchValue)}`}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchValue("");
                setSearchResults([]);
                setIsExpanded(false);
              }}
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors duration-150 text-center font-medium"
            >
              View all results for &quot;{searchValue}&quot;
            </Link>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isExpanded && isSearchOpen && searchValue && searchResults.length === 0 && (
        <div className="absolute top-full right-0 mt-1 w-80 bg-white shadow-lg border border-gray-200 rounded-lg py-4 z-50">
          <p className="text-center text-gray-600 text-sm">
            No results found for &quot;{searchValue}&quot;
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchAppBar;
