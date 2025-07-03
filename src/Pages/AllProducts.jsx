import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Flame, Heart } from "lucide-react";
import Loader from "../components/common/components/Loader";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [priceRange, setPriceRange] = useState(150);

  const categories = [
    { id: "Clothing", name: "Clothing" },
    { id: "Accessories", name: "Accessories" },
    { id: "shoes", name: "Shoes" }
  ];

  const colors = [
    { id: "black", color: "bg-black" },
    { id: "white", color: "bg-white border border-gray-200" },
    { id: "teal", color: "bg-teal-500" },
    { id: "brown", color: "bg-amber-800" },
    { id: "pink", color: "bg-pink-500" },
    { id: "red", color: "bg-red-600" },
    { id: "gray", color: "bg-gray-500" },
    { id: "yellow", color: "bg-yellow-400" },
    { id: "purple", color: "bg-purple-600" },
    { id: "orange", color: "bg-orange-500" },
    { id: "silver", color: "bg-gray-300" },
    { id: "green", color: "bg-green-500" }
  ];

  const sizes = ["ONE SIZE", "XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedColor, selectedSize, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from("clothes").select("*");

      // Apply filters
      if (selectedCategory !== "all") {
        query = query.eq("item_type", selectedCategory);
      }

      if (selectedColor) {
        query = query.contains("colors", [selectedColor]);
      }

      if (selectedSize) {
        // Check if the size exists in any of the size categories
        query = query.or(`sizes_available->kids.cs.{${selectedSize}},sizes_available->shoes.cs.{${selectedSize}},sizes_available->numeric.cs.{${selectedSize}},sizes_available->one_size.cs.{${selectedSize}},sizes_available->standard.cs.{${selectedSize}}`);
      }

      if (priceRange < 150) {
        query = query.lte("price", priceRange);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mt-16">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-light tracking-wide">CLOTHING</h1>
      </div>

      <div className="max-w-[2000px] mx-auto px-4">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-bold mb-4">CATEGORIES</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === "all"
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg ${
                        selectedCategory === category.id
                          ? "bg-gray-900 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="font-bold mb-4">COLOR</h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-8 h-8 rounded-full ${color.color} ${
                        selectedColor === color.id
                          ? "ring-2 ring-offset-2 ring-gray-900"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-bold mb-4">SIZE</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedSize === size
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold mb-4">PRICE RANGE</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span>0</span>
                    <span>{priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Clear All */}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedColor(null);
                  setSelectedSize(null);
                  setPriceRange(150);
                }}
                className="text-xs underline hover:text-red-600"
              >
                CLEAR ALL
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <Link to={`/product/${product.id}`} className="block">
                    {/* Product Image */}
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Trending Badge */}
                      {product.is_bestseller && (
                        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                          <Flame size={16} className="text-red-500" />
                          <span className="text-xs font-medium">Trending</span>
                        </div>
                      )}
                      {/* Wishlist Button */}
                      <button 
                        className="absolute top-2 right-2 bg-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation when clicking the heart
                          // Add wishlist functionality here
                        }}
                      >
                        <Heart size={20} className="text-gray-900" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">৳{product.price}</span>
                          {product.is_on_sale && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ৳{product.original_price}
                            </span>
                          )}
                        </div>
                        {product.is_on_sale && (
                          <span className="text-xs font-medium text-red-500">-{product.discount_percentage}%</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
