import React, { useState, useMemo, useEffect, useCallback } from "react";
import Edit from "../components/products/Edit";
import { ConfigProvider, theme, Select, Button, message, Result } from "antd";
import { PlusOutlined, DatabaseOutlined } from "@ant-design/icons";
import { Search } from "lucide-react"; 
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
  const [sortOrder, setSortOrder] = useState(null);
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
      console.error("API HATASI:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchText) {
      result = result.filter((p) => p.title?.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (selectedCategory !== "Tümü") {
      result = result.filter((p) => p.category?.localeCompare(selectedCategory, "tr", { sensitivity: "base" }) === 0);
    }
    if (sortOrder === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, searchText, selectedCategory, sortOrder]);

  if (!isAdmin) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-transparent">
        <Result
          status="403"
          title={<h2 className="text-3xl font-black tracking-tighter dark:text-white uppercase m-0">YETKİSİZ ERİŞİM</h2>}
          subTitle={<p className="text-slate-500 dark:text-slate-400 font-medium text-base mt-2">Bu panel yalnızca yönetici yetkisine sahip kullanıcılar içindir.</p>}
          extra={
            <Button 
              type="primary" 
              size="large" 
              className="h-12 px-10 rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 border-none bg-blue-600 hover:bg-blue-700 transition-all"
              onClick={() => navigate("/")}
            >
              Ana Sayfaya Dön
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 20,
          colorBgContainer: isDark ? '#0f172a' : '#ffffff',
          colorBorder: isDark ? '#1e293b' : '#e2e8f0'
        }
      }}
    >
      <div className="min-h-screen bg-transparent p-4 md:p-10 transition-all duration-300">
        
       
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="flex items-center gap-5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-blue-100/20 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all duration-300">
              <DatabaseOutlined className="text-blue-600 text-3xl" />
            </div>
            
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                Ürün Yönetimi
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  SİSTEM AKTİF • {products.length} KAYIT ANALİZ EDİLDİ
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
           
            <div className="relative flex-1 min-w-[240px] group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="text"
                placeholder="Ürün ismi ile ara..."
                className="w-full pl-12 pr-4 h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
                onChange={(e) => {
                  setSearchText(e.target.value);
                  dispatch(setSearch(e.target.value.toLowerCase()));
                }}
              />
            </div>

            <Select
              placeholder={<span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Kategori</span>}
              value={selectedCategory}
              onChange={setSelectedCategory}
              variant="borderless"
              className="w-full md:w-48 h-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all"
              popupClassName="dark:bg-slate-900 rounded-xl"
              options={[
                { value: "Tümü", label: <span className="text-[11px] font-bold uppercase tracking-tight">Tümü</span> },
                ...categories.map((c) => ({
                  value: c.title,
                  label: <span className="text-[11px] font-bold uppercase tracking-tight">{c.title}</span>,
                })),
              ]}
            />

            <Select
              placeholder={<span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Sıralama</span>}
              className="w-full md:w-44 h-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all"
              variant="borderless"
              onChange={(val) => setSortOrder(val)}
              allowClear
              popupClassName="dark:bg-slate-900 rounded-xl"
              options={[
                { value: "price-asc", label: <span className="text-[11px] font-bold uppercase tracking-tight">En Düşük</span> },
                { value: "price-desc", label: <span className="text-[11px] font-bold uppercase tracking-tight">En Yüksek</span> }
              ]}
            />

            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 border-none px-8 font-black text-[11px] tracking-widest shadow-xl shadow-blue-500/20 uppercase"
            >
              Yeni Ürün
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
          {!loading ? (
            <div className="p-2 md:p-6">
              <Edit 
                products={filteredProducts} 
                categories={categories} 
                refreshData={refreshData} 
                isAddModalOpen={isAddModalOpen} 
                setIsAddModalOpen={setIsAddModalOpen} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              </div>
              <span className="mt-6 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Veriler İşleniyor</span>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ant-select-selector { background-color: transparent !important; }
        .ant-select-selection-item { font-weight: 700 !important; }
        .dark .ant-table { background: transparent !important; }
        .dark .ant-table-thead > tr > th {
          background: #0f172a !important;
          color: #64748b !important;
          border-bottom: 1px solid #1e293b !important;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.1em;
          font-weight: 900;
        }
      `}} />
    </ConfigProvider>
  );
};

export default ProductPage;