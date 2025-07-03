import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <img
          src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/izel//Black%20and%20Beige%20Minimalist%20Elegant%20Cosmetics%20Logo.png"
          alt="IZEL Logo"
          className="h-6 md:h-8"
        />
      </Link>
    </div>
  );
};

export default Logo;
