/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, User, Search } from "lucide-react";

const Profile = () => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      {/* Search icon (mobile) */}
      <Link to="/search" className="md:hidden">
        <button className="p-2 text-gray-700 hover:text-black transition-colors duration-200 rounded-full hover:bg-gray-100">
          <Search size={20} />
        </button>
      </Link>

      {/* Wishlist */}
      <Link to="/wishlist" className="relative">
        <button className="p-2 text-gray-700 hover:text-black transition-colors duration-200 rounded-full hover:bg-gray-100">
          <Heart size={20} />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
        </button>
      </Link>

      {/* Cart */}
      <Link to="/cart" className="relative">
        <button className="p-2 text-gray-700 hover:text-black transition-colors duration-200 rounded-full hover:bg-gray-100">
          <ShoppingCart size={20} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </Link>

      {/* User Profile Icon - Always visible */}
      <div className="relative">
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="p-2 text-gray-700 hover:text-black transition-colors duration-200 rounded-full hover:bg-gray-100"
        >
          <User size={20} />
        </button>

        {/* Dropdown Menu */}
        {profileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-50">
            <Link
              to="/track-delivery"
              onClick={() => setProfileMenuOpen(false)}
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
            >
              Track Delivery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
