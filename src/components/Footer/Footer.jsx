import { Link } from "react-router-dom";
import { useContext } from "react";
import { LangContext } from "@/context/LangContext";
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const { lang } = useContext(LangContext);

  return (
    <footer className="bg-white pt-8 md:pt-12 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8 md:mb-12">
          <a 
            href="https://www.facebook.com/profile.php?id=100093063240151&ref=_xav_ig_profile_page_web#" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-gray-900"
          >
            <Facebook size={20} className="md:w-6 md:h-6" />
          </a>
          <a 
            href="https://www.instagram.com/izel.bd/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 hover:text-gray-900"
          >
            <Instagram size={20} className="md:w-6 md:h-6" />
          </a>
        </div>

        {/* Payment Methods */}
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8 md:mb-12 overflow-x-auto">
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//amexCard.svg" 
            alt="American Express" 
            className="h-6 md:h-8" 
          />
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//visaCard.svg" 
            alt="Visa" 
            className="h-6 md:h-8" 
          />
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//masterCard.svg" 
            alt="Mastercard" 
            className="h-6 md:h-8" 
          />
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//bkash.svg" 
            alt="bKash" 
            className="h-6 md:h-8" 
          />
          <img 
            src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//nagad.svg" 
            alt="Nagad" 
            className="h-6 md:h-8" 
          />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Help and Information */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold mb-3 md:mb-4 uppercase text-gray-900">
              {lang === "en" ? "Help and Information" : "المساعدة والمعلومات"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-600 hover:text-gray-900">Help</Link></li>
              <li><Link to="/track-order" className="text-gray-600 hover:text-gray-900">Track Order</Link></li>
              <li><Link to="/delivery-returns" className="text-gray-600 hover:text-gray-900">Delivery & Returns</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold mb-3 md:mb-4 uppercase text-gray-900">
              {lang === "en" ? "About Us" : "معلومات عنا"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
            </ul>
          </div>

          {/* More From Us */}
          <div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold mb-3 md:mb-4 uppercase text-gray-900">
              {lang === "en" ? "More From Us" : "المزيد منا"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/gift-vouchers" className="text-gray-600 hover:text-gray-900">Gift Vouchers</Link></li>
            </ul>
          </div>
        </div>

        {/* Shopping From - Bangladesh */}
        <div className="text-center mb-6 md:mb-8">
          <h4 className="text-sm font-semibold mb-3 md:mb-4 uppercase text-gray-900">
            {lang === "en" ? "Shopping From:" : "التسوق من:"}
          </h4>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <img 
              src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//Flag_of_Bangladesh.svg.png"
              alt="Bangladesh Flag"
              className="h-4 md:h-5 w-auto"
            />
            <span className="text-sm">Bangladesh</span>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="text-xs md:text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 space-y-2 sm:space-y-0">
          <div>© 2025 Izel Built by <a href="https://flowscape.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 underline">Flowscape.xyz</a></div>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:text-gray-900">Privacy & Cookies</Link>
            <Link to="/terms" className="hover:text-gray-900">Ts&Cs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
