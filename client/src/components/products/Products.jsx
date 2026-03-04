import { useState } from "react";
import ProductItem from "./ProductItem";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Add from "./Add";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { Pagination, ConfigProvider, theme, Select } from "antd";

const Products = ({ categories, products, setProducts, filtered, refreshData, setSortOption }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 32; 
  const navigate = useNavigate();
  const isDark = document.documentElement.classList.contains("dark");

  const user = JSON.parse(localStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin";

  const displayProducts = Array.isArray(filtered) ? filtered : [];
  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = displayProducts.slice(indexOfFirstProduct, indexOfLastProduct);

 return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
          {isAdmin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full xl:w-2/3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="group flex items-center justify-center gap-3 bg-white dark:bg-slate-900/40 text-emerald-600 dark:text-emerald-400 py-4 rounded-[2rem] font-black transition-all border border-emerald-100 dark:border-emerald-500/20 shadow-xl shadow-emerald-500/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 uppercase tracking-widest text-[11px]"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <PlusOutlined />
                </div>
                Yeni Ürün Ekle
              </button>

              <button
                onClick={() => navigate("/products")}
                className="group flex items-center justify-center gap-3 bg-white dark:bg-slate-900/40 text-amber-600 dark:text-amber-400 py-4 rounded-[2rem] font-black transition-all border border-amber-100 dark:border-amber-500/20 shadow-xl shadow-amber-500/5 hover:bg-amber-50 dark:hover:bg-amber-500/10 uppercase tracking-widest text-[11px]"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <EditOutlined />
                </div>
                Envanteri Yönet
              </button>
            </div>
          ) : (
            <div className="hidden xl:block xl:w-2/3"></div>
          )}

          <div className="w-full xl:w-1/3 flex justify-end group relative">
            <ConfigProvider
              theme={{
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    borderRadius: 20,
                    colorBgElevated: isDark ? "#0f172a" : "#ffffff",
                    controlItemBgActive: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
                }
              }}
            >
              <div className="relative w-full">
                <ArrowUpDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                <Select
                    placeholder="Sıralama Seçin"
                    defaultValue="random"
                    variant="borderless"
                    popupClassName="modern-dropdown"
                    suffixIcon={<ChevronDown size={16} className="text-slate-400" />}
                    className="w-full h-14 pl-8 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 font-bold text-slate-700 dark:text-slate-200 overflow-hidden"
                    onChange={(value) => setSortOption(value)}
                    options={[
                        { value: 'random', label: '✨ Rastgele Sırala' },
                        { value: 'alphabetical', label: '🔤 A\'dan Z\'ye' },
                        { value: 'price-asc', label: '📉 Ucuzdan Pahalıya' },
                        { value: 'price-desc', label: '📈 Pahalıdan Ucuza' },
                        { value: 'newest', label: '🆕 En Yeni Ürünler' },
                    ]}
                />
              </div>
            </ConfigProvider>
          </div>
        </div>

        <div className="products-wrapper grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((item, index) => (
              <ProductItem 
                item={item} 
                key={item._id || `${index}-${item.title}`} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-slate-200/50 dark:border-slate-700/50">
              <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Aranan kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}
        </div>

        {displayProducts.length > pageSize && (
          <div className="flex justify-center mt-4 mb-10">
            <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
              <Pagination
                current={currentPage}
                total={displayProducts.length}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/40 dark:border-slate-700/50"
              />
            </ConfigProvider>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .modern-dropdown { border-radius: 24px !important; padding: 8px !important; border: 1px solid rgba(255,255,255,0.1) !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important; }
        .modern-dropdown .ant-select-item { border-radius: 12px !important; margin-bottom: 4px !important; padding: 10px 12px !important; font-weight: 600 !important; transition: all 0.2s !important; }
        .ant-select-selector { box-shadow: none !important; border: none !important; outline: none !important; }
      `}} />

      {isAdmin && (
        <Add
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          categories={categories}
          products={products}
          setProducts={setProducts}
          refreshData={refreshData}
        />
      )}
    </>
  );
};

export default Products;