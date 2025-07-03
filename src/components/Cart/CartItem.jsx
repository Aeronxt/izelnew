/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { X, Plus, Minus } from "lucide-react";

const CartItem = ({ item }) => {
  const { removeFromCart, handleIncrease, handleDecrease } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleRemove = () => {
    removeFromCart(item.id, item.size);
  };

  const handleDecreaseFunc = () => {
    handleDecrease(item);
  };

  const handleIncreaseFunc = () => {
    handleIncrease(item);
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 py-6 items-center">
        {/* Product Info */}
        <div className="col-span-6 flex gap-4">
          <Link to={`/product/${item.id}`}>
            <img
              loading="lazy"
              src={item.imageSrc || item.image_url}
              alt={item.title || item.name}
              className="w-24 h-24 object-cover"
            />
          </Link>
          <div>
            <Link to={`/product/${item.id}`} className="hover:underline">
              <h3 className="font-medium">{item.title || item.name}</h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
            <button
              onClick={handleRemove}
              className="text-sm text-gray-600 underline mt-2 hover:text-black"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div className="col-span-2 flex justify-center">
          <div className="flex items-center border border-gray-300">
            <button
              className="p-2 hover:bg-gray-100"
              onClick={handleDecreaseFunc}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
            <button
              className="p-2 hover:bg-gray-100"
              onClick={handleIncreaseFunc}
              disabled={quantity >= item.maxQuantity}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="col-span-2 text-center">
          ৳{item.price.toFixed(2)}
        </div>

        {/* Total */}
        <div className="col-span-2 text-right">
          ৳{(item.price * quantity).toFixed(2)}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden py-4">
        <div className="flex gap-4">
          <Link to={`/product/${item.id}`}>
            <img
              loading="lazy"
              src={item.imageSrc || item.image_url}
              alt={item.title || item.name}
              className="w-20 h-20 object-cover"
            />
          </Link>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/product/${item.id}`} className="hover:underline">
                  <h3 className="font-medium text-sm">{item.title || item.name}</h3>
                </Link>
                <p className="text-xs text-gray-600 mt-1">Size: {item.size}</p>
                <p className="text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={handleRemove}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center border border-gray-300">
                <button
                  className="p-1.5 hover:bg-gray-100"
                  onClick={handleDecreaseFunc}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1.5 min-w-[40px] text-center text-sm">{quantity}</span>
                <button
                  className="p-1.5 hover:bg-gray-100"
                  onClick={handleIncreaseFunc}
                  disabled={quantity >= item.maxQuantity}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              <div className="text-sm font-medium">
                ${(item.price * quantity).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
