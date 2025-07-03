/* eslint-disable react/prop-types */
import { useCart } from "../context/CartContext";
import CartItem from "../components/Cart/CartItem";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const Cart = () => {
  const { cartItems } = useCart();

  // Calculate subtotal of all cart items
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">MY BAG</h1>
          <p className="text-gray-600">
            {cartItems.length === 0 
              ? "Your bag is currently empty" 
              : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-6">Add some items to get started</p>
            <Link to="/allProducts" className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors">
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items Table */}
            <div className="mb-8">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm text-gray-600">
                <div className="col-span-6">PRODUCT</div>
                <div className="col-span-2 text-center">QUANTITY</div>
                <div className="col-span-2 text-center">PRICE</div>
                <div className="col-span-2 text-right">TOTAL</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={`${item.id}-${item.size}`}
                    item={item}
                    index={index}
                    stars={item.stars}
                    rates={item.rates}
                  />
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Continue Shopping */}
              <div>
                <Link to="/allProducts" className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Right - Totals and Checkout */}
              <div className="lg:text-right">
                <div className="max-w-sm ml-auto">
                  {/* Promo Code */}
                  <div className="mb-6">
                    <form className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                      />
                      <button 
                        type="submit"
                        className="px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors"
                      >
                        APPLY
                      </button>
                    </form>
                  </div>

                  {/* Totals */}
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)} AUD</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link to="/checkout" className="block">
                    <button className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors">
                      CHECKOUT
                    </button>
                  </Link>

                  {/* Payment Methods */}
                  <div className="mt-4 flex justify-center gap-4">
                    <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//visaCard.svg" alt="Visa" className="h-8" />
                    <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//masterCard.svg" alt="Mastercard" className="h-8" />
                    <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//amexCard.svg" alt="Amex" className="h-8" />
                    <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//bkash.svg" alt="bKash" className="h-8" />
                    <img src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//nagad.svg" alt="Nagad" className="h-8" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
