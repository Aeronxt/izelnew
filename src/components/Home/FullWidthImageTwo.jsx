import { useContext } from "react";
import { LangContext } from "@/context/LangContext";
import { Link } from "react-router-dom";

const FullWidthImageTwo = () => {
  const { lang } = useContext(LangContext);

  return (
    <div className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//Beige%20Modern%20Minimalist%20Monochrome%20Photo%20Fashion%20Brand%20Promotion%20Facebook%20Cover.png")',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          {lang === "en" ? "COZY ESSENTIALS" : "الأساسيات المريحة"}
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          {lang === "en" 
            ? "Discover our collection of comfortable and stylish loungewear pieces" 
            : "اكتشف مجموعتنا من ملابس الراحة الأنيقة والمريحة"}
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-black px-10 py-4 text-lg font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          {lang === "en" ? "SHOP NOW" : "تسوق الآن"}
        </Link>
      </div>
    </div>
  );
};

export default FullWidthImageTwo; 