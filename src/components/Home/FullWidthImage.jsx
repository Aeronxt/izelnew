import { useContext } from "react";
import { LangContext } from "@/context/LangContext";
import { Link } from "react-router-dom";

const FullWidthImage = () => {
  const { lang } = useContext(LangContext);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <img
        src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//Beige%20Grey%20Photo%20Fashion%20Beauty%20Business%20Facebook%20Cover.png"
        alt="Full width fashion"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24">
        <Link
          to="/products"
          className="inline-block bg-white text-black px-8 py-3 text-lg font-semibold hover:bg-black hover:text-white transition-colors duration-300"
        >
          {lang === "en" ? "SHOP NOW" : "تسوق الآن"}
        </Link>
      </div>
    </div>
  );
};

export default FullWidthImage; 