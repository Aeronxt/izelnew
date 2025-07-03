// routes.js
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import AllProducts from "./Pages/AllProducts";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import Account from "./Pages/Account";
import NotFound from "./Pages/NotFound";
import Category from "./Pages/Category";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import PaymentSuccess from "./Pages/PaymentSuccess";
import TrackOrder from "./Pages/TrackOrder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "products",
        element: <AllProducts />,
      },
      {
        path: "product/:id",
        element: <Product />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "login",
        element: <LogIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "category/:category",
        element: <Category />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "track-delivery",
        element: <TrackOrder />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
