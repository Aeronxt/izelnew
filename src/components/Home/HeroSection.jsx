const HeroSection = () => {
  return (
    <div className="relative w-full">
      {/* Single Hero Image */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <img
          src="https://cpwowrsesrefnugctpos.supabase.co/storage/v1/object/public/payment//Cream%20and%20Brown%20Classic%20Neutrals%20Jewelry%20Store%20Facebook%20Cover.png"
          alt="Jewelry Store Cover"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default HeroSection; 