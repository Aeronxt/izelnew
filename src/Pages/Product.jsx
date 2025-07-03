import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const Product = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('clothes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Transform the data to match the UI requirements
        setSelectedProduct({
          ...data,
          title: data.name,
          price: parseFloat(data.price),
          original_price: parseFloat(data.original_price),
          images: data.images,
          description: data.description,
          brand: data.brand,
          materials: data.materials,
          sizes_available: data.sizes_available,
          stock_by_size: data.stock_by_size,
          colors: data.colors,
          is_on_sale: data.is_on_sale,
          discount_percentage: data.discount_percentage,
          is_new: data.is_new,
          is_bestseller: data.is_bestseller,
          category: data.category,
          item_type: data.item_type,
          sku: data.sku,
          loyaltyPoints: Math.floor(data.price * 0.05), // 5% of price as loyalty points
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    
    // Check if the selected size has stock
    const stockForSize = selectedProduct.stock_by_size[selectedSize];
    if (!stockForSize || stockForSize <= 0) {
      toast.error('Selected size is out of stock');
      return;
    }

    // Get current quantity in cart
    const currentQuantityInCart = cartItems.find(
      item => item.id === selectedProduct.id && item.size === selectedSize
    )?.quantity || 0;

    // Check if adding one more would exceed stock
    if (currentQuantityInCart + 1 > stockForSize) {
      toast.error('Cannot add more of this item - stock limit reached');
      return;
    }

    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.images[0],
      size: selectedSize,
      maxStock: stockForSize
    });
    toast.success('Added to cart!');
  };

  if (loading || !selectedProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Get available sizes based on the product type
  const getAvailableSizes = () => {
    const sizesData = selectedProduct.sizes_available;
    let availableSizes = [];

    if (selectedProduct.item_type === 'shoes') {
      availableSizes = sizesData.shoes || [];
    } else if (selectedProduct.category === 'Children') {
      availableSizes = sizesData.kids || [];
    } else if (selectedProduct.item_type === 'Accessories') {
      availableSizes = sizesData.one_size || [];
    } else {
      availableSizes = sizesData.standard || [];
    }

    return availableSizes;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {selectedProduct.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${selectedProduct.name} view ${index + 2}`}
                  className="w-full h-full object-center object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-light">{selectedProduct.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{selectedProduct.brand}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-medium">৳{selectedProduct.price}</span>
            {selectedProduct.is_on_sale && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ৳{selectedProduct.original_price}
            </span>
                <span className="text-red-600">-{selectedProduct.discount_percentage}%</span>
              </>
            )}
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {getAvailableSizes().map((size) => {
                const isInStock = selectedProduct.stock_by_size[size] > 0;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (isInStock) {
                        setSelectedSize(size);
                        setSizeError(false);
                      }
                    }}
                    className={`py-2 text-sm font-medium rounded-lg ${
                      selectedSize === size
                        ? 'bg-gray-900 text-white'
                        : isInStock
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isInStock}
                  >
                    {size}
          </button>
                );
              })}
            </div>
            {sizeError && (
              <p className="text-red-600 text-sm mt-1">Please select a size</p>
            )}
          </div>

          {/* Add to Cart Button */}
                <button
            onClick={handleAddToCart}
            className="w-full bg-gray-900 text-white py-4 px-8 rounded-lg hover:bg-gray-800 flex items-center justify-center space-x-2"
                >
            <ShoppingBag size={20} />
            <span>Add to Cart</span>
                </button>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
            <button
              onClick={() => setShowDescription(!showDescription)}
                className="flex items-center justify-between w-full py-2 text-left"
            >
                <span className="font-medium">Description</span>
                {showDescription ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
            </button>
            {showDescription && (
                <div className="mt-2 prose prose-sm">
                  <p>{selectedProduct.description}</p>
                  <ul className="list-disc pl-4 mt-2">
                    {selectedProduct.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
              </div>
            )}
            </div>

            <div>
            <button
              onClick={() => setShowDelivery(!showDelivery)}
                className="flex items-center justify-between w-full py-2 text-left"
            >
                <span className="font-medium">Delivery</span>
                {showDelivery ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
            </button>
            {showDelivery && (
                <div className="mt-2 prose prose-sm">
                  <p>Free standard delivery on orders over BDT 2000</p>
                  <p>Express delivery available</p>
              </div>
            )}
            </div>

            <div>
            <button
              onClick={() => setShowReturns(!showReturns)}
                className="flex items-center justify-between w-full py-2 text-left"
            >
                <span className="font-medium">Returns</span>
                {showReturns ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
            </button>
            {showReturns && (
                <div className="mt-2 prose prose-sm">
                  <p>Free returns within 30 days</p>
                  <p>See our returns policy for more details</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
