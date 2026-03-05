import { useState } from "react";
import { PlusOutlined, MinusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useCart } from "../hooks/useCart";
import { TAX_RATE } from "../config/appConfig";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateBillModal from "../components/cart/CreateBillModal";

const CartPage = () => {
  const { cartItems, grandTotal, addItem, decreaseItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("posUser"));
  const isAdminOrStaff = user?.role === "admin" || user?.role === "staff";

  const taxDivider = 1 + TAX_RATE / 100;
  const calculatedSubTotal = grandTotal / taxDivider;
  const calculatedTaxAmount = grandTotal - calculatedSubTotal;

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" /> 
          <ShoppingBag 
            size={80} 
            strokeWidth={1.5} 
            className="text-slate-400 dark:text-slate-500 relative z-10 opacity-50" 
          />
        </div>

        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">
          SEPETİNİZ BOŞ
        </h2>
        <p className="text-slate-500 uppercase text-[10px] tracking-[0.3em] mb-10 font-bold">
          Henüz ürün eklemediniz
        </p>
        <button 
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] font-black transition-all active:scale-95 shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-xs"
        >
          ANA SAYFAYA DÖN
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent p-4 md:p-8 flex flex-col text-slate-900 dark:text-white transition-all">
      
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between mb-12 shrink-0">
        <button 
          onClick={() => navigate("/")} 
          className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white font-black uppercase text-[10px] tracking-widest transition-all flex items-center"
        >
          <ArrowLeftOutlined className="mr-2"/> GERİ DÖN
        </button>
        <h1 className="text-2xl font-black uppercase italic tracking-[0.4em] text-slate-900 dark:text-white">SEPETİM</h1>
        <div className="w-10 h-10"></div> 
      </div>

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 items-start">
        
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6 group transition-all shadow-sm dark:shadow-none">
              <div className="w-24 h-24 bg-slate-50 dark:bg-white rounded-3xl p-3 shrink-0 shadow-lg">
                <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="font-black uppercase text-lg tracking-tight text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-blue-600 dark:text-blue-500 font-bold text-xs tracking-widest">{item.price} ₺</p>
              </div>
              
              <div className="flex items-center bg-slate-100 dark:bg-black/20 backdrop-blur-md rounded-2xl p-2 border border-slate-200 dark:border-white/5">
                <button onClick={() => decreaseItem(item)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"><MinusOutlined /></button>
                <span className="w-10 text-center font-black text-slate-900 dark:text-white">{item.quantity}</span>
                <button onClick={() => addItem(item)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"><PlusOutlined /></button>
              </div>

              <div className="text-right min-w-[120px]">
                <span className="font-black text-2xl italic text-slate-900 dark:text-white">{(item.quantity * item.price).toLocaleString()} ₺</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 sticky top-8">
          <div className="bg-white dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-xl dark:shadow-2xl flex flex-col h-fit">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-10 text-center">SİPARİŞ ÖZETİ</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest">ARA TOPLAM</span>
                <span className="font-black text-slate-900 dark:text-white">{calculatedSubTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}₺</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-blue-600 dark:text-blue-500 uppercase tracking-widest">VERGİ (%{TAX_RATE})</span>
                <span className="text-blue-600 dark:text-blue-500 font-black">+{calculatedTaxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}₺</span>
              </div>
              
              <div className="h-px bg-slate-200 dark:bg-white/10 my-4"></div>
              
              <div className="text-center py-6">
                <p className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em] mb-2">TOPLAM ÖDENECEK</p>
                <div className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {Math.floor(grandTotal).toLocaleString()}
                  <span className="text-2xl opacity-20 dark:opacity-20 ml-1">.00₺</span>
                </div>
              </div>

              <button 
                onClick={() => isAdminOrStaff && setIsModalOpen(true)}
                disabled={!isAdminOrStaff}
                className={`w-full h-20 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all border-none
                  ${isAdminOrStaff 
                    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 cursor-pointer" 
                    : "bg-slate-300 dark:bg-gray-700 cursor-not-allowed opacity-70"
                  }`}
              >
                {isAdminOrStaff ? "ÖDEMEYE GEÇ" : "GİRİŞ YAPILMALI"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateBillModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        cartItems={cartItems} 
        total={calculatedSubTotal} 
        taxAmount={calculatedTaxAmount} 
        grandTotal={grandTotal} 
      />
    </div>
  );
};

export default CartPage;