import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ViewAll = ({ name }) => {
  return (
    <Link to="/allProducts">
      <button className="inline-block bg-black text-white px-10 py-4 text-lg font-medium hover:bg-gray-800 transition-colors duration-200">
        {name}
      </button>
    </Link>
  );
};

ViewAll.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ViewAll;
