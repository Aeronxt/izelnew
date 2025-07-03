/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import WishlistIcon from "./WishlistIcon";
import AddToCart from "./AddToCart";
import PropTypes from "prop-types";

const FlashSaleItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeError, setShowSizeError] = useState(false);

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
    <div className="relative mx-2">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowSizeError(false);
        }}
        className="relative rounded flex flex-col items-center justify-center bg-zinc-100 w-[270px] h-auto py-4 transform transition-transform duration-300 hover:scale-105 focus:outline-none hover:-translate-y-2"
      >
        {item.discount && (
          <div className="absolute top-0 left-0 bg-red-500 text-white py-1 px-3 m-2 rounded">
            -{item.discount}%
          </div>
        )}
        {item.state && (
          <div className="absolute top-0 left-0 bg-green text-white py-1 px-3 m-2 rounded">
            New
          </div>
        )}
        <Link to={`/product/${item.id}`} key={item.id}>
          <img
            loading="lazy"
            src={item.imageSrc}
            alt={item.title}
            className="hover:animate-pulse max-h-52 w-full object-contain"
          />
        </Link>
        <WishlistIcon selectedProduct={item} style="absolute top-3 right-3" />
        
        {/* Size Selection - Always Visible */}
        {getSizeArray().length > 0 && (
          <div className="w-full bg-white p-2 mt-4">
            <div className="flex flex-wrap justify-center gap-2">
              {getSizeArray().map((size) => {
                const status = getSizeStatus(size);
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (status !== "out_of_stock") {
                        setSelectedSize(size);
                        setShowSizeError(false);
                      }
                    }}
                    disabled={status === "out_of_stock"}
                    className={`px-2 py-1 text-sm rounded ${
                      selectedSize === size
                        ? 'bg-strand-red text-white'
                        : status === "out_of_stock"
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                    {status === "low_stock" && (
                      <span className="block text-xs text-strand-red">Low Stock</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Add to Cart - Show on Hover */}
        {isHovered && (
          <div className="w-full px-4">
            <AddToCart item={item} selectedSize={selectedSize} />
          </div>
        )}
        
        {showSizeError && (
          <div className="w-full bg-red-100 text-red-600 text-sm py-1 text-center mt-2">
            Please select a size
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">{item.title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-strand-red font-semibold">৳{item.price}</span>
          {item.original_price && (
            <span className="text-gray-500 line-through">৳{item.original_price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

FlashSaleItem.propTypes = {
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

export default FlashSaleItem;
