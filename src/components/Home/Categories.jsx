import RedTitle from "../common/components/RedTitle";
import PropTypes from "prop-types";
import Arrows from "../common/components/Arrows";
import i18n from "../common/components/LangConfig";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";

const Category = ({ icon, name }) => (
  <Link to="category">
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="w-full hover:animate-pulse flex gap-2 sm:gap-4 items-center justify-center flex-col bg-white py-4 sm:py-6 md:py-8 rounded-lg border border-gray-300 transition duration-300 hover:bg-cyan-400 hover:invert hover:shadow-xl hover:-translate-y-2 active:translate-y-0"
    >
      <div className="scale-75 sm:scale-90 md:scale-100">{icon}</div>
      <div className="text-sm sm:text-base md:text-lg px-2 text-center">{name}</div>
    </button>
  </Link>
);

const CategoryList = () => {
  const categories = [
    {
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 14H14C12.8954 14 12 14.8954 12 16V40C12 41.1046 12.8954 42 14 42H42C43.1046 42 44 41.1046 44 40V16C44 14.8954 43.1046 14 42 14Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28 24V32M24 28H32" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      name: i18n.t("category.categories.0"), // Clothing
    },
    {
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 21C35 24.866 31.866 28 28 28C24.134 28 21 24.866 21 21C21 17.134 24.134 14 28 14C31.866 14 35 17.134 35 21Z" stroke="black" strokeWidth="2"/>
          <path d="M42 42H14C14 37.582 17.582 34 22 34H34C38.418 34 42 37.582 42 42Z" stroke="black" strokeWidth="2"/>
        </svg>
      ),
      name: i18n.t("category.categories.1"), // Accessories
    },
    {
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 21H21C17.134 21 14 24.134 14 28V35C14 38.866 17.134 42 21 42H35C38.866 42 42 38.866 42 35V28C42 24.134 38.866 21 35 21Z" stroke="black" strokeWidth="2"/>
          <path d="M21 21V14H35V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 42V49H35V42" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      name: i18n.t("category.categories.2"), // Bags
    },
    {
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 28H14C12.8954 28 12 28.8954 12 30V42C12 43.1046 12.8954 44 14 44H42C43.1046 44 44 43.1046 44 42V30C44 28.8954 43.1046 28 42 28Z" stroke="black" strokeWidth="2"/>
          <path d="M38 28V21C38 16.5817 34.4183 13 30 13H26C21.5817 13 18 16.5817 18 21V28" stroke="black" strokeWidth="2"/>
        </svg>
      ),
      name: i18n.t("category.categories.3"), // Shoes
    },
  ];

  return (
    <Grid container spacing={2}>
      {categories.map((category, index) => (
        <Grid item xs={6} sm={6} md={3} key={index}>
          <Category icon={category.icon} name={category.name} />
        </Grid>
      ))}
    </Grid>
  );
};

Category.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

const Categories = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <RedTitle>Categories</RedTitle>
        <div className="hidden sm:block">
          <Arrows />
        </div>
      </div>
      <CategoryList />
    </section>
  );
};

export default Categories;
