import { useContext, useEffect, useState } from "react";
import { LangContext } from "@/context/LangContext";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const FlashSale = () => {
  const { lang } = useContext(LangContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchProducts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('clothes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clothes',
          filter: 'is_featured=eq.true'
        },
        () => {
          // Refresh products when changes occur
          fetchProducts();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('clothes')
        .select('id, name, price, original_price, discount_percentage, images, is_featured')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      setProducts(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Section Title */}
      <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-center">
          {lang === "en" ? "LOVE THESE FOR YOU" : "نحب هذه من أجلك"}
        </h2>
        <Heart className="w-5 h-5 md:w-6 md:h-6" fill="black" />
      </div>

      {/* Product Grid - Optimized for mobile with horizontal scroll on small screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden mb-2 rounded-md">
              <img
                src={product.images[0].startsWith('http') ? product.images[0] : product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/assets/notFound.png";
                }}
                loading="lazy"
              />
              {product.discount_percentage > 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                  {product.discount_percentage}% OFF
                </div>
              )}
            </div>
            <div className="space-y-1 px-1">
              <h3 className="text-xs sm:text-sm font-medium line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                {product.name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm sm:text-base font-semibold">
                  ৳{product.price}
                </span>
                {product.original_price && (
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    ৳{product.original_price}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile-friendly "View All" button */}
      <div className="mt-8 text-center">
        <Link 
          to="/allProducts" 
          className="inline-block px-6 py-3 bg-black text-white text-sm md:text-base hover:bg-gray-800 transition-colors duration-300"
        >
          {lang === "en" ? "VIEW ALL PRODUCTS" : "عرض جميع المنتجات"}
        </Link>
      </div>
    </div>
  );
};

export default FlashSale;
