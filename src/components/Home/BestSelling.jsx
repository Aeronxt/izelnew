import { useContext, useState } from "react";
import { LangContext } from "@/context/LangContext";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBestsellerProducts } from "@/hooks/useProducts";

export const BestSelling = () => {
  const { lang } = useContext(LangContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, loading } = useBestsellerProducts();

  if (loading) {
    return (
      <div className="max-w-[1800px] mx-auto px-4">
        <h2 className="text-4xl md:text-5xl text-center mb-12">
          {lang === "en" ? "Bestsellers" : "الأكثر مبيعاً"}
        </h2>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Filter only bestseller products
  const bestsellerProducts = products.filter(product => product.is_bestseller);

  return (
    <div className="max-w-[1800px] mx-auto px-4">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl text-center mb-12">
        {lang === "en" ? "Bestsellers" : "الأكثر مبيعاً"}
      </h2>

      {/* Product Grid/Carousel */}
      <div className="relative">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? Math.ceil(bestsellerProducts.length / 4) - 1 : prev - 1))}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 bg-white rounded-full p-3 shadow-md hover:bg-gray-100"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Products Container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-full px-2">
              {bestsellerProducts.map((product) => (
                <Link 
                  key={product.id}
                  to={`/product/${product.id}`} 
                  className="group"
                >
                  <div className="aspect-[4/5] overflow-hidden mb-4">
                    <img
                      src={product.imageSrc || "/assets/notFound.png"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/assets/notFound.png";
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-medium line-clamp-2">
                      {product.brand && `${product.brand} - `}{product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg md:text-xl font-semibold">
                        ৳{product.price.toFixed(2)} {lang === "en" ? "BDT" : "تاكا"}
                      </span>
                      {product.original_price && (
                        <span className="text-lg md:text-xl text-gray-500 line-through">
                          ৳{product.original_price.toFixed(2)}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="text-base text-red-600 font-medium">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % Math.ceil(bestsellerProducts.length / 4))}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 bg-white rounded-full p-3 shadow-md hover:bg-gray-100"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {[...Array(Math.ceil(bestsellerProducts.length / 4))].map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                currentSlide === index ? "bg-black" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Shop Now Button */}
      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-block bg-black text-white px-10 py-4 text-lg font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          {lang === "en" ? "SHOP NOW" : "تسوق الآن"}
        </Link>
      </div>
    </div>
  );
};

export default BestSelling;
