import { ConfigProvider, theme, Button, message, Badge, Drawer } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../config/appConfig";
import Categories from "../components/categories/Categories";
import Products from "../components/products/Products";
import DashboardCarts from "../components/dashboard/DashboardCarts";
import CartTotals from "../features/cart/CartTotals";
import { BarChartOutlined, HomeOutlined, ShoppingCartOutlined, CloseOutlined } from "@ant-design/icons";
import { setProducts as setReduxProducts } from "../redux/slices/productSlice";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [statsFilter, setStatsFilter] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortOption, setSortOption] = useState("random");
  const dispatch = useDispatch();
  const search = useSelector((state) => state.product.search);
  const selectedCategory = useSelector((state) => state.product.category);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = JSON.parse(localStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin";

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isDark = document.documentElement.classList.contains("dark");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        API.get("/categories/get-all"),
        API.get("/products/get-all"),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      dispatch(setReduxProducts(prodRes.data));
    } catch (err) {
      message.error("Veriler yüklenemedi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products].filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const matchesSearch = title.includes((search || "").toLowerCase());
      if (!selectedCategory || selectedCategory === "Tümü") return matchesSearch;
      const productCategory = typeof item.category === "object" && item.category !== null ? item.category.title : item.category;
      return matchesSearch && String(productCategory || "").localeCompare(selectedCategory, "tr", { sensitivity: "base" }) === 0;
    });

    switch (sortOption) {
      case "price-asc": result.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "price-desc": result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "alphabetical": result.sort((a, b) => (a.title || "").localeCompare(b.title || "", "tr")); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "random": result.sort(() => Math.random() - 0.5); break;
      default: break;
    }
    return result;
  }, [products, search, selectedCategory, sortOption]);

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm, 
        token: { borderRadius: 20, colorPrimary: "#2563eb" } 
      }}
    >
      <div className="flex flex-col min-h-screen bg-transparent transition-all relative">
        <div className="p-4 md:px-10 md:pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shrink-0">
          <div className="flex items-center gap-5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-blue-100/20 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <HomeOutlined className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                Satış Paneli
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  SİSTEM AKTİF • CANLI VERİ
                </span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <Button
              size="large"
              onClick={() => setIsStatsModalVisible(true)}
              className="group h-14 px-6 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <BarChartOutlined className="text-sm" />
              </div>
              <span className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-[0.2em] text-[11px]">Analiz</span>
            </Button>
          )}
        </div>

     
        <div className="flex flex-col lg:flex-row flex-1 p-4 md:px-10 md:pb-10 gap-8 items-start relative">
          <aside className="w-full lg:w-72 lg:sticky lg:top-36 z-20 shrink-0 self-start">
            <Categories categories={categories} setCategories={setCategories} />
          </aside>

          <main className="flex-1 w-full"> 
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 p-4 rounded-[2.5rem] h-64" />
                ))}
              </div>
            ) : (
              <Products 
                categories={categories} 
                filtered={filtered} 
                products={products} 
                setProducts={setProducts} 
                setSortOption={setSortOption} 
                refreshData={fetchAll} 
              />
            )}
          </main>
        </div>

<div className="fixed bottom-6 right-6 z-[999] pointer-events-none"> 
  <Badge 
    count={cartItems.length} 
    color="#ef4444" 
    offset={[-5, 5]} 
    className="pointer-events-auto" 
  >
    <button
      onClick={() => setIsCartOpen(true)}
      className="flex flex-col items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl transition-all active:scale-90 border-none pointer-events-auto"
    >
      <ShoppingCartOutlined className="text-2xl mb-1" />
      <span className="text-[11px] font-black">
        {total.toLocaleString("tr-TR")}₺
      </span>
    </button>
  </Badge>
</div>

        <Drawer
          title={null} closable={false} onClose={() => setIsCartOpen(false)} open={isCartOpen}
          placement={window.innerWidth > 768 ? "right" : "bottom"}
          width={window.innerWidth > 768 ? 420 : "100%"}
          height={window.innerWidth > 768 ? "100%" : "85%"}
          styles={{ body: { padding: 0 }, wrapper: { borderRadius: window.innerWidth > 768 ? "0" : "2.5rem 2.5rem 0 0" } }}
        >
          <CartTotals onClose={() => setIsCartOpen(false)} />
        </Drawer>

        {isStatsModalVisible && isAdmin && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setIsStatsModalVisible(false)} />
            <div className="relative w-full max-w-6xl max-h-[92vh] bg-white dark:bg-slate-950 rounded-[3.5rem] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-8 md:p-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-3xl bg-blue-600/10 text-blue-600 flex items-center justify-center"><BarChartOutlined className="text-2xl" /></div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">İşletme Raporu</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem]">
                    {["daily", "weekly", "monthly"].map((f) => (
                      <button key={f} onClick={() => setStatsFilter(f)} className={`px-6 py-2 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest ${statsFilter === f ? "bg-white dark:bg-slate-800 text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}>
                        {f === "daily" ? "GÜNLÜK" : f === "weekly" ? "HAFTALIK" : "AYLIK"}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setIsStatsModalVisible(false)} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"><CloseOutlined /></button>
                </div>
              </div>
              <div className="flex-1 p-8 md:p-12 pt-0 overflow-y-auto no-scrollbar"><DashboardCarts filterType={statsFilter} /></div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .categories-wrapper > div { 
          background: transparent !important; 
          border: none !important; 
          box-shadow: none !important;
          padding: 0 !important;
        }
        .ant-badge-count { z-index: 10; border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important; }
      `}} />
    </ConfigProvider>
  );
};

export default HomePage;