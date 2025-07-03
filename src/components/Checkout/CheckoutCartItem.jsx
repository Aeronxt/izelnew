/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CheckoutCartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex items-center gap-6">
        <div className="flex">
          <Link to={`/product/${item.id}`} key={item.id}>
            <img
              loading="lazy"
              src={item.imageSrc}
              alt={item.title}
              className="w-14 h-14"
            />
          </Link>
        </div>
        <div className="flex flex-col">
          <p className="text-xs md:text-base">{item.title}</p>
          <p className="text-xs text-gray-500">Size: {item.size}</p>
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-gray-500">
          ৳{item.price.toFixed(2)}
          {quantity >= 1 ? ` x ${quantity}` : ""}
        </p>
      </div>
    </div>
  );
};

export default CheckoutCartItem;
