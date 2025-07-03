/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import WishlistIcon from "./WishlistIcon";
import AddToCart from "./AddToCart";
import PropTypes from "prop-types";

const ProductCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeError, setShowSizeError] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Get the appropriate size array based on product category
  const getSizeArray = () => {
    const category = (item.category || "").toLowerCase();
    const type = (item.type || "").toLowerCase();
    
    if (category.includes("shoes") || type.includes("shoes")) {
      return item.available_sizes?.shoes || [];
    }
    if (category.includes("kids") || type.includes("kids")) {
      return item.available_sizes?.kids || [];
    }
    if (category.includes("dress") || type.includes("dress") ||
        category.includes("pants") || type.includes("pants") ||
        category.includes("skirt") || type.includes("skirt")) {
      return item.available_sizes?.numeric || [];
    }
    if (category.includes("accessories") || type.includes("accessories") ||
        category.includes("hat") || type.includes("hat") ||
        category.includes("scarf") || type.includes("scarf") ||
        category.includes("belt") || type.includes("belt")) {
      return item.available_sizes?.one_size || [];
    }
    return item.available_sizes?.standard || [];
  };

  // Get size status for display
  const getSizeStatus = (size) => {
    const sizeData = item.size_inventory?.[size];
    if (!sizeData || sizeData.quantity === 0) return "out_of_stock";
    if (sizeData.quantity <= 5) return "low_stock";
    return "in_stock";
  };

  return (
    <div className="relative mx-1 sm:mx-2">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowSizeError(false);
        }}
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        className="relative rounded flex flex-col items-center justify-center bg-zinc-100 w-[160px] sm:w-[220px] md:w-[270px] h-auto py-3 sm:py-4 transform transition-transform duration-300 hover:scale-105 focus:outline-none hover:-translate-y-2"
      >
        {item.discount && (
          <div className="absolute top-0 left-0 bg-red-500 text-white py-1 px-2 sm:px-3 m-1 sm:m-2 rounded text-xs sm:text-sm">
            -{item.discount}%
          </div>
        )}
        {item.state && (
          <div className="absolute top-0 left-0 bg-green text-white py-1 px-2 sm:px-3 m-1 sm:m-2 rounded text-xs sm:text-sm">
            New
          </div>
        )}
        <Link to={`/product/${item.id}`} key={item.id} onClick={(e) => e.stopPropagation()}>
          <img
            loading="lazy"
            src={item.imageSrc}
            alt={item.title}
            className="hover:animate-pulse max-h-32 sm:max-h-44 md:max-h-52 w-full object-contain"
          />
        </Link>
        <WishlistIcon selectedProduct={item} style="absolute top-2 right-2 sm:top-3 sm:right-3" />
        
        {/* Size Selection - Always Visible on desktop, expandable on mobile */}
        {getSizeArray().length > 0 && (
          <div className={`w-full bg-white p-1 sm:p-2 mt-2 sm:mt-4 ${!isHovered && !isMobileExpanded && 'hidden md:block'}`}>
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {getSizeArray().map((size) => {
                const status = getSizeStatus(size);
                return (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (status !== "out_of_stock") {
                        setSelectedSize(size);
                        setShowSizeError(false);
                      }
                    }}
                    disabled={status === "out_of_stock"}
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm rounded ${
                      selectedSize === size
                        ? 'bg-strand-red text-white'
                        : status === "out_of_stock"
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                    {status === "low_stock" && (
                      <span className="hidden sm:block text-xs text-strand-red">Low Stock</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Add to Cart - Show on Hover for desktop, on expand for mobile */}
        {(isHovered || isMobileExpanded) && (
          <div className="w-full px-2 sm:px-4 mt-2">
            <div onClick={(e) => e.stopPropagation()}>
              <AddToCart item={item} selectedSize={selectedSize} />
            </div>
          </div>
        )}
        
        {showSizeError && (
          <div className="w-full bg-red-100 text-red-600 text-xs sm:text-sm py-1 text-center mt-2">
            Please select a size
          </div>
        )}
      </div>
      <div className="mt-2 sm:mt-4 px-1">
        <h3 className="text-sm sm:text-base md:text-lg font-medium truncate">{item.title}</h3>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-strand-red font-semibold text-sm sm:text-base">৳{item.price}</span>
          {item.original_price && (
            <span className="text-gray-500 line-through text-xs sm:text-sm">৳{item.original_price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    original_price: PropTypes.number,
    imageSrc: PropTypes.string,
    discount: PropTypes.number,
    state: PropTypes.number,
    category: PropTypes.string,
    type: PropTypes.string,
    available_sizes: PropTypes.object,
    size_inventory: PropTypes.object,
  }).isRequired,
};

export default ProductCard; 