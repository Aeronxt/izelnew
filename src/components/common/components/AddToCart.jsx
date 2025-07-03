/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useCart } from "../../../context/CartContext";
import i18n from "./LangConfig";

const AddToCart = ({ item, selectedSize }) => {
  const { addToCart, removeFromCart, isInCart, getCartItemQuantity } = useCart();
  const [isInCartState, setIsInCartState] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(0);

  useEffect(() => {
    if (selectedSize) {
      const inCart = isInCart(item.id, selectedSize);
      setIsInCartState(inCart);
      setCurrentQuantity(getCartItemQuantity(item.id, selectedSize));
    }
  }, [item.id, selectedSize, isInCart, getCartItemQuantity]);

  // Function to add item to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }

    if (isInCartState) {
      removeFromCart(item.id, selectedSize);
      setIsInCartState(false);
      setCurrentQuantity(0);
    } else {
      const sizeInventory = item.size_inventory[selectedSize];
      if (sizeInventory && sizeInventory.quantity > 0) {
        addToCart({ ...item, size: selectedSize });
        setIsInCartState(true);
        setCurrentQuantity(1);
      }
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!selectedSize}
      className={`w-full z-10 py-2 px-4 mt-2 duration-300 focus:outline-none ${
        isInCartState 
          ? 'bg-strand-red text-white hover:bg-red-600' 
          : 'bg-black text-white hover:bg-gray-800'
      } ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isInCartState ? i18n.t("removeFromCart") : i18n.t("addToCart")}
    </button>
  );
};

export default AddToCart;
