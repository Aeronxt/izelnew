/* eslint-disable react/prop-types */
import i18n from "../common/components/LangConfig";
import FlashSaleItem from "../common/components/FlashSaleItem";
import RedTitle from "../common/components/RedTitle";
import ViewAll from "../common/components/ViewAll";
import { useProducts } from "../../hooks/useProducts";
import { Grid } from "@mui/material";
import Loader from "../common/components/Loader";

const RelatedItems = ({ selectedProduct }) => {
  const { products, loading } = useProducts({ type: selectedProduct?.type });
  
  // Filter out the current product from related items
  const relatedItems = products.filter(
    (item) => item.id !== selectedProduct?.id
  ).slice(0, 4); // Limit to 4 related items

  if (loading) {
    return (
      <div className="mx-auto md:mx-2">
        <RedTitle title={i18n.t("productPage.relatedItems")} />
        <div className="flex justify-center items-center h-64">
          <Grid container spacing={3} justifyContent="center">
            {[...Array(4)].map((_, index) => (
              <Grid item key={index}>
                <Loader />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
  }

  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mx-auto md:mx-2">
        <RedTitle title={i18n.t("productPage.relatedItems")} />
        <div className="relative mt-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform ">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {relatedItems.map((item, index) => (
              <Grid item key={item.id}>
                <FlashSaleItem
                  item={item}
                  index={index}
                  totalItems={relatedItems.length}
                  stars={item.stars}
                  rates={item.rates}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <ViewAll name={i18n.t("redButtons.viewAllProducts")} />
      </div>
    </>
  );
};

export default RelatedItems;
