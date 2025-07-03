import PropTypes from "prop-types";

const WhiteButton = ({ name, onClick, disabled = false }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${
        disabled
          ? "cursor-not-allowed hover:text-gray-400 bg-gray-100 hover:bg-gray-200"
          : "cursor-pointer border-gray-600 hover:shadow-xl text-black transition-transform duration-100 transform hover:translate-y-[-4px] focus:translate-y-0 active:translate-y-0"
      }
      text-sm md:text-base border px-4 sm:px-6 md:px-12 py-2.5 md:py-3 rounded-md w-full sm:w-auto`}
    >
      {name}
    </button>
  );
};

WhiteButton.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default WhiteButton;
