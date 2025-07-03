import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { HeaderProvider } from "./context/HeaderContext";
import { WishlistProvider } from "./context/WishlistContext";
import { LangProvider } from "./context/LangContext";
import { AuthProvider } from "./Auth/firebase";
import router from "./routes";

function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <HeaderProvider>
          <CartProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Define default options
                  className: "",
                  duration: 5000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },

                  // Default options for specific types
                  success: {
                    duration: 3000,
                    theme: {
                      primary: "green",
                      secondary: "black",
                    },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </HeaderProvider>
      </LangProvider>
    </AuthProvider>
  );
}

export default App;
