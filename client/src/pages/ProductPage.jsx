import React, { useState, useMemo, useEffect, useCallback } from "react";
import Edit from "../components/products/Edit";
import { ConfigProvider, theme, Button, message, Result, Select } from "antd";
import { PlusOutlined, DatabaseOutlined } from "@ant-design/icons";
import { Search, ChevronDown, Filter, ArrowUpDown } from "lucide-react"; 
import { useDispatch } from "react-redux";
import { setSearch } from "../redux/slices/productSlice";
import API from "../config/appConfig";
import { useNavigate } from "react-router-dom"; 

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDark = document.documentElement.classList.contains("dark");
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortOrder, setSortOrder] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin";

  const refreshData = useCallback(async () => {
    if (!isAdmin) return; 
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        API.get("/products/get-all"),
        API.get("/categories/get-all")
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      message.error("Veriler yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const title = p.title || "";
        const matchesSearch = title.toLocaleLowerCase("tr").includes(searchText.toLocaleLowerCase("tr"));
        const matchesCategory = selectedCategory === "Tümü" || 
          p.category?.localeCompare(selectedCategory, "tr", { sensitivity: "base" }) === 0;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === "price-asc") return a.price - b.price;
        if (sortOrder === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, searchText, selectedCategory, sortOrder]);

  if (!isAdmin) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-transparent">
        <Result
          status="403"
          title={<h2 className="text-3xl font-black tracking-tighter dark:text-white uppercase m-0">YETKİSİZ ERİŞİM</h2>}
          extra={<Button type="primary" size="large" className="h-12 px-10 rounded-2xl font-bold bg-blue-600 border-none" onClick={() => navigate("/")}>Ana Sayfaya Dön</Button>}
        />
      </div>
    );
  }

  return (
    <ConfigProvider 
        theme={{ 
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { borderRadius: 16 }
        }}
    >
      <div className="min-h-screen bg-transparent p-4 md:p-10 transition-all duration-300">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          
          <div className="flex items-center gap-5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
              <DatabaseOutlined className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Ürün Yönetimi</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">SİSTEM AKTİF • {products.length} KAYIT</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Ara..."
                className="w-full pl-12 pr-4 h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
                onChange={(e) => {
                  setSearchText(e.target.value);
                  dispatch(setSearch(e.target.value.toLowerCase()));
                }}
              />
            </div>

            <Select 
                value={selectedCategory}
                onChange={setSelectedCategory}
                popupClassName="modern-dropdown"
                suffixIcon={<ChevronDown size={16} className="text-slate-400" />}
                className="w-full md:w-48 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all font-bold text-[12px] uppercase"
                options={[
                    { value: "Tümü", label: "📂 Tüm Kategoriler" },
                    ...categories.map((c) => ({ value: c.title, label: c.title }))
                ]}
            />

            <Select 
                value={sortOrder}
                onChange={setSortOrder}
                popupClassName="modern-dropdown"
                suffixIcon={<ArrowUpDown size={16} className="text-slate-400" />}
                className="w-full md:w-48 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all font-bold text-[12px] uppercase"
                options={[
                    { value: "", label: "↕️ Varsayılan" },
                    { value: "price-asc", label: "📉 En Düşük Fiyat" },
                    { value: "price-desc", label: "📈 En Yüksek Fiyat" }
                ]}
            />

            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto h-12 rounded-2xl bg-blue-600 border-none px-8 font-black text-[11px] tracking-widest uppercase shadow-lg shadow-blue-500/20"
            >
              Yeni Ürün
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {!loading ? (
            <div className="p-2 md:p-6">
              <Edit products={filteredProducts} categories={categories} refreshData={refreshData} isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 font-black uppercase tracking-[0.3em] text-[10px] text-slate-400 animate-pulse">Veriler İşleniyor</div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .modern-dropdown { border-radius: 20px !important; padding: 6px !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4) !important; background: ${isDark ? '#0f172a' : '#ffffff'} !important; border: 1px solid ${isDark ? '#1e293b' : '#e2e8f0'} !important; }
        .modern-dropdown .ant-select-item { border-radius: 12px !important; font-weight: 700 !important; font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; }
        .ant-select-selector { border: none !important; background: transparent !important; box-shadow: none !important; }
      `}} />
    </ConfigProvider>
  );
};

export default ProductPage;