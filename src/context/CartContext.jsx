import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Initialize cart items from local storage on component mount
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (savedCartItems) {
      setCartItems(savedCartItems);
    }
  }, []);

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingItemIndex !== -1) {
      // If item with same size already exists in cart, update its quantity
      const updatedCartItems = [...cartItems];
      const currentItem = updatedCartItems[existingItemIndex];
      
      // Increment quantity
      currentItem.quantity += 1;
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      // If item does not exist in cart, add it
      const newItem = {
        ...item,
        quantity: 1
      };
      const updatedCartItems = [...cartItems, newItem];
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  const removeFromCart = (itemId, size) => {
    const updatedCartItems = cartItems.filter(
      (item) => !(item.id === itemId && item.size === size)
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleIncrease = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      const currentItem = updatedCartItems[existingItemIndex];
      
      currentItem.quantity += 1;
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      addToCart(item);
    }
  };

  const handleDecrease = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      const currentItem = updatedCartItems[existingItemIndex];

      if (currentItem.quantity === 1) {
        removeFromCart(item.id, item.size);
      } else {
        currentItem.quantity -= 1;
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }
    }
  };

  // Function to clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // Function to check if an item with specific size is in the cart
  const isInCart = (itemId, size) => {
    return cartItems.some((item) => item.id === itemId && item.size === size);
  };

  // Function to get the current quantity of an item with specific size in the cart
  const getCartItemQuantity = (itemId, size) => {
    const item = cartItems.find((item) => item.id === itemId && item.size === size);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        handleIncrease,
        handleDecrease,
        isInCart,
        getCartItemQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
