/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

const RedButton = ({ name, disabled = false, onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`motion-safe:hover:animate-pulse text-sm md:text-base px-4 sm:px-6 md:px-12 py-2.5 md:py-3 rounded w-full sm:w-auto
    ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-red-600 text-white hover:bg-red-500 transition-transform duration-100 transform hover:translate-y-[-4px] active:translate-y-0"
    }
    `}
    >
      {name}
    </button>
  );
};

RedButton.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default RedButton;
