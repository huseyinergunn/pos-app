import { useEffect, lazy, Suspense, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme, App as AntApp } from "antd";
import API from "./config/appConfig";
import { setProducts, setCategory } from "./redux/slices/productSlice";
import MainLayout from "./layout/MainLayout";

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen font-semibold text-gray-500 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <span className="uppercase tracking-widest text-[10px] font-black text-slate-400">Yükleniyor...</span>
    </div>
  </div>
);

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const HomePage = lazy(() => import("./pages/HomePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const BillPage = lazy(() => import("./pages/BillPage"));
const StatisticPage = lazy(() => import("./pages/StatisticPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));

const ProtectedLayout = () => {
  const user = localStorage.getItem("posUser");
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Suspense fallback={<PageLoader />}>
      <MainLayout />
    </Suspense>
  );
};

const AdminLayout = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <MainLayout />
    </Suspense>
  );
};

function App() {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const handleVisibilityChange = () => {
      document.title = document.hidden ? "Seni Özledik! 👋" : "NexPos | POS Sistemi";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    const fetchInitialData = async () => {
      const userStr = localStorage.getItem("posUser");
      if (!userStr) return; 

      const user = JSON.parse(userStr);
      if (!user.token) return;

      try {
        const { data } = await API.get("/products/get-all");
        dispatch(setProducts(data));
        dispatch(setCategory("Tümü"));
      } catch (error) {
        console.error("Başlangıç verisi çekilemedi:", error.message);
      }
    };

    fetchInitialData();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, [dispatch]);

  const checkIsAuthenticated = () => {
    const userStr = localStorage.getItem("posUser");
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return !!user.token;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb', 
          borderRadius: 16, 
          fontFamily: 'inherit',
          colorBgBase: isDarkMode ? '#020617' : '#ffffff', 
          colorBgContainer: isDarkMode ? '#0f172a' : '#ffffff', 
        },
        components: {
          Modal: {
            borderRadiusLG: 28, 
            paddingLG: 32,
          },
          Message: {
            borderRadiusSM: 12,
            contentPadding: "12px 24px"
          }
        }
      }}
    >
      <AntApp>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route 
                path="/login" 
                element={checkIsAuthenticated() ? <Navigate to="/" replace /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={checkIsAuthenticated() ? <Navigate to="/" replace /> : <Register />} 
              />
              
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
              </Route>

              <Route element={<ProtectedLayout />}>
                <Route path="/cart" element={<CartPage />} />
              </Route>

              <Route element={<AdminLayout />}>
                <Route path="/bills" element={<BillPage />} />
                <Route path="/statistics" element={<StatisticPage />} />
                <Route path="/products" element={<ProductPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;