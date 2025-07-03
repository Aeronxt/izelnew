import { useContext } from "react";
import { LangContext } from "@/context/LangContext";
import { Link } from "react-router-dom";

const ShopCategories = () => {
  const { lang } = useContext(LangContext);

  const categories = [
    {
      title: "SHOP DENIM",
      image: "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//Neutral%20Elegant%20Brand%20Photo%20Feature%20Instagram%20Post.png",
      link: "/category/denim",
      position: "object-left"
    },
    {
      title: "SHOP OUTERWEAR",
      image: "https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//Beige%20Minimalist%20Fashion%20Discount%20Instagram%20Post.png",
      link: "/category/outerwear",
      position: "object-center"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category, index) => (
        <Link 
          key={index} 
          to={category.link}
          className="relative group overflow-hidden h-[800px] md:h-[900px]"
        >
          <img
            src={category.image}
            alt={category.title}
            className={`w-full h-full object-cover ${category.position} transition-transform duration-700 group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <h3 className="text-white text-4xl md:text-5xl font-bold tracking-wider">
              {lang === "en" ? category.title : (
                category.title === "SHOP DENIM" ? "تسوق الجينز" : "تسوق الملابس الخارجية"
              )}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ShopCategories; 