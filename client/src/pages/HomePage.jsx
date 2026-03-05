import { ConfigProvider, theme, Button, Drawer, Badge, Input } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../config/appConfig";
import Categories from "../components/categories/Categories";
import Products from "../components/products/Products";
import DashboardCarts from "../components/dashboard/DashboardCarts";
import CartTotals from "../features/cart/CartTotals";
import { 
  BarChartOutlined, 
  HomeOutlined, 
  CloseOutlined,
  ShoppingCartOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { setProducts as setReduxProducts, setSearch } from "../redux/slices/productSlice";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [statsFilter, setStatsFilter] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default"); 
  const dispatch = useDispatch();
  const search = useSelector((state) => state.product.search);
  const cart = useSelector((state) => state.cart);
  const selectedCategory = useSelector((state) => state.product.category);
  const user = JSON.parse(localStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin";
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
      console.error("API HATASI:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    if (!products || products.length === 0) return [];
    let result = products.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const matchesSearch = title.includes((search || "").toLowerCase());
      if (!selectedCategory || selectedCategory === "Tümü") return matchesSearch;
      const productCategory = typeof item.category === "object" && item.category !== null ? item.category.title : item.category;
      return matchesSearch && String(productCategory || "").localeCompare(selectedCategory, "tr", { sensitivity: "base" }) === 0;
    });
    if (sortOption === "price-asc") result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortOption === "price-desc") result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortOption === "alphabetical") result.sort((a, b) => (a.title || "").localeCompare(b.title || "", "tr"));
    else if (sortOption === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else result.sort((a, b) => {
        const hashA = a._id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
        const hashB = b._id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
        return (hashA % 10) - (hashB % 10) || a.title.localeCompare(b.title);
    });
    return result;
  }, [products, search, selectedCategory, sortOption]);

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm, token: { borderRadius: 20, colorPrimary: "#2563eb" } }}>
      <div className="flex flex-col min-h-screen bg-transparent transition-all relative pb-24 md:pb-0"> 
        <div className="p-4 md:px-10 md:pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center gap-5 w-full md:w-auto">
            <div className="flex items-center gap-5">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-blue-100/20 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <HomeOutlined className="text-blue-600 text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Satış Paneli</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">SİSTEM AKTİF • CANLI VERİ</span>
                </div>
              </div>
            </div>
            <div className="w-full md:hidden mt-2">
              <Input size="large" placeholder="Ürünlerde ara..." prefix={<SearchOutlined className="text-blue-500" />} value={search} onChange={(e) => dispatch(setSearch(e.target.value))} className="h-14 rounded-2xl bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5 text-slate-900 dark:text-white font-bold" />
            </div>
          </div>

          {isAdmin && (
            <Button size="large" onClick={() => setIsStatsModalVisible(true)} className="group flex h-14 px-6 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform"><BarChartOutlined className="text-sm" /></div>
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
                {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 p-4 rounded-[2.5rem] h-64" />)}
              </div>
            ) : <Products categories={categories} filtered={filtered} products={products} setProducts={setProducts} setSortOption={setSortOption} refreshData={fetchAll} />}
          </main>
        </div>

        <button onClick={() => setIsCartOpen(true)} className="hidden md:flex fixed bottom-10 right-10 w-20 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-110 active:scale-95 z-[100] group">
          <Badge count={cart.cartItems.length} offset={[5, 0]} color="#ef4444">
            <ShoppingCartOutlined className="text-3xl text-white group-hover:rotate-12 transition-transform" />
          </Badge>
        </button>

        <Drawer title={null} closable={false} onClose={() => setIsCartOpen(false)} open={isCartOpen} placement={window.innerWidth > 768 ? "right" : "bottom"} width={window.innerWidth > 768 ? 420 : "100%"} height={window.innerWidth > 768 ? "100%" : "85%"} styles={{ body: { padding: 0 }, wrapper: { borderRadius: window.innerWidth > 768 ? "0" : "2.5rem 2.5rem 0 0" } }}>
          <CartTotals onClose={() => setIsCartOpen(false)} />
        </Drawer>

        {isStatsModalVisible && isAdmin && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsStatsModalVisible(false)} />
            <div className="relative w-full max-w-6xl bg-white dark:bg-slate-950 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 md:p-12 pb-4 flex flex-row justify-between items-center gap-6 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-blue-600/10 text-blue-600 flex items-center justify-center"><BarChartOutlined className="text-xl md:text-2xl" /></div>
                  <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">İşletme Raporu</h2>
                </div>
                <button onClick={() => setIsStatsModalVisible(false)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"><CloseOutlined /></button>
              </div>

              <div className="px-6 md:px-12 mb-6 overflow-x-auto no-scrollbar shrink-0">
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] w-fit">
                  {["daily", "weekly", "monthly"].map((f) => (
                    <button key={f} onClick={() => setStatsFilter(f)} className={`px-5 md:px-8 py-2 md:py-3 rounded-[1.2rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${statsFilter === f ? "bg-white dark:bg-slate-800 text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}>
                      {f === "daily" ? "GÜNLÜK" : f === "weekly" ? "HAFTALIK" : "AYLIK"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 p-6 md:p-12 pt-0 overflow-y-auto no-scrollbar pb-8 md:pb-12">
                <DashboardCarts filterType={statsFilter} />
              </div>
            </div>
          </div>
        )}
      </div>

     <style dangerouslySetInnerHTML={{ __html: `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .ant-badge-count { z-index: 10; border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important; }
    
    /* Pagination Düzenlemesi */
    .ant-pagination { 
      display: flex !important; 
      justify-content: center !important; 
      align-items: center !important;
      flex-wrap: nowrap !important; /* Aşağı kaymayı engeller */
      gap: 2px !important;
      overflow-x: auto !important; /* Çok fazla sayfa varsa yatayda kaydırır */
      padding: 10px 0 !important;
    }

    .ant-pagination-item, .ant-pagination-prev, .ant-pagination-next, .ant-pagination-jump-prev, .ant-pagination-jump-next { 
      border-radius: 50% !important; 
      min-width: 28px !important; 
      height: 28px !important; 
      line-height: 28px !important; 
      background: rgba(255,255,255,0.05) !important; 
      border: 1px solid rgba(255,255,255,0.1) !important; 
      margin: 0 !important;
      flex-shrink: 0 !important;
    }

    @media (max-width: 640px) {
      .ant-pagination {
        transform: scale(0.9);
      }
    }
  `}} />
    </ConfigProvider>
  );
};

export default HomePage;