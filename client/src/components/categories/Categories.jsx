import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/slices/productSlice";
import { PlusOutlined, EditOutlined, AppstoreOutlined } from "@ant-design/icons";
import Add from "./Add";
import Edit from "./Edit";

const Categories = ({ categories, setCategories }) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.product.category);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin";
const safeCategories = Array.isArray(categories) ? categories : [];
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 bg-white dark:bg-slate-900/40 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300 h-auto md:max-h-[calc(100vh-220px)] overflow-hidden lg:overflow-visible">
      
      <div className="flex flex-col gap-4 md:gap-6 shrink-0">
        <div className="px-2 hidden md:block">
          <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1">Kategoriler</h2>
          <div className="h-1 w-8 bg-blue-600 rounded-full" />
        </div>

        {isAdmin && (
          <div className="grid grid-cols-2 gap-2 md:gap-3 px-1 lg:flex lg:flex-col lg:gap-3 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-1 md:gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] tracking-widest border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
            >
              <PlusOutlined /> EKLE
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-1 md:gap-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] tracking-widest border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
            >
              <EditOutlined /> YÖNET
            </button>
          </div>
        )}
      </div>

     <nav className="flex-1 overflow-x-auto md:overflow-y-auto no-scrollbar -mx-4 md:mx-0 px-4 md:px-0 min-h-0"> 
        <ul className="flex flex-row md:flex-col gap-3 md:gap-4 py-2"> 
          <CategoryItem 
            title="Tümü" 
            active={selectedCategory === "Tümü"} 
            onClick={() => dispatch(setCategory("Tümü"))}
            icon={<AppstoreOutlined />}
          />

          {safeCategories.map((item) => (
            <CategoryItem 
              key={item._id}
              title={item.title} 
              active={item.title === selectedCategory} 
              onClick={() => dispatch(setCategory(item.title))}
              icon={item.icon}
            />
          ))}
        </ul>
      </nav>

      {isAdmin && (
        <>
          <Add isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} categories={safeCategories} setCategories={setCategories} />
          <Edit isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} categories={safeCategories} setCategories={setCategories} />
        </>
      )}
    </div>
  );
};

const CategoryItem = ({ title, active, onClick, icon }) => (
  <li 
    onClick={onClick}
    className={`group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1 shrink-0
    w-[72px] h-[72px] md:min-h-[96px] md:w-full rounded-[1.4rem] md:rounded-[2.2rem] relative
    ${active 
      ? "bg-blue-600 text-white z-10 shadow-md shadow-blue-500/20 ring-2 ring-blue-600/10" 
      : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-100 dark:border-transparent"
    }`} 
  >
    <div className="flex flex-col items-center justify-center z-10 pointer-events-none">
      {icon ? (
        <span className="text-lg md:text-2xl mb-0.5">{icon}</span>
      ) : (
        <div className={`w-1.5 h-1.5 rounded-full mb-1 ${active ? 'bg-white' : 'bg-slate-400 dark:bg-slate-600'}`} />
      )}
      <span className={`font-black uppercase text-[7px] md:text-[9px] tracking-tighter md:tracking-widest text-center px-1 truncate w-full ${active ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
        {title}
      </span>
    </div>
  </li>
);

export default Categories;