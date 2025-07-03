import { useProducts } from "../hooks/useProducts";
import HeroSection from "../components/Home/HeroSection";
import FlashSale from "../components/Home/FlashSale";
import { BestSelling } from "../components/Home/BestSelling";
import Loading from "../components/common/components/Loading";
import FullWidthImage from "../components/Home/FullWidthImage";
import FullWidthImageTwo from "../components/Home/FullWidthImageTwo";
import ShopCategories from "../components/Home/ShopCategories";

const Home = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading products</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section full width */}
      <div>
        <HeroSection />
      </div>

      {/* Shop Categories Grid */}
      <div className="mt-4 px-4">
        <ShopCategories />
      </div>

      {/* Full width image section */}
      <div className="mt-4">
        <FullWidthImage />
      </div>

      {/* Best Selling and Flash Sale sections */}
      <div dir="ltr" className="max-w-7xl mx-auto px-4 mt-16 space-y-16">
        <BestSelling />
        <FlashSale items={products} />
      </div>

      {/* Second Full width image section - Cozy Essentials */}
      <div className="mt-16">
        <FullWidthImageTwo />
      </div>
    </div>
  );
};

export default Home;
