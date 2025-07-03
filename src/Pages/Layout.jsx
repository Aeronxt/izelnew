// Layout.js
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TopHeader from "../components/TopHeader/TopHeader";
import ScrollToTop from "../components/common/components/ScrollToTop";
import { useHeader } from "../context/HeaderContext";

const Layout = () => {
  const { isTopHeaderVisible } = useHeader();

  return (
    <>
      <ScrollToTop />
      <TopHeader />
      <Header />
      <main className={`transition-all duration-300 ${
        isTopHeaderVisible 
          ? 'pt-[152px] md:pt-[136px]' 
          : 'pt-[104px] md:pt-[64px]'
      }`}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
