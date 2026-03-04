import { useState } from "react";
import { 
  DeleteOutlined, 
  ShoppingCartOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  ArrowLeftOutlined,
  ClearOutlined 
} from "@ant-design/icons";
import { useCart } from "../hooks/useCart";
import CreateBillModal from "../components/cart/CreateBillModal";
import { TAX_RATE } from "../config/appConfig";
import { useNavigate } from "react-router-dom";
import { Popconfirm, message } from "antd";

const CartPage = () => {
  const { cartItems, grandTotal, addItem, decreaseItem, deleteItem, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const taxDivider = 1 + TAX_RATE / 100;
  const calculatedSubTotal = grandTotal / taxDivider;
  const calculatedTaxAmount = grandTotal - calculatedSubTotal;

  const handleClearCart = () => {
    clearCart();
    message.success("Sepet başarıyla temizlendi.");
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in transition-colors duration-300">
        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700">
          <ShoppingCartOutlined className="text-5xl text-slate-400 dark:text-slate-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Sepet Boş</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-xs">Henüz bir ürün eklemediniz.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          SATIŞA BAŞLA
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 h-screen flex flex-col transition-colors duration-300 overflow-hidden">
      
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button 
          onClick={() => navigate("/")} 
          className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeftOutlined /> GERİ
        </button>
        
        <h1 className="text-sm md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
          Sepetim
        </h1>

        <Popconfirm
          title="Sepeti Temizle"
          onConfirm={handleClearCart}
          okText="Evet"
          cancelText="Hayır"
          okButtonProps={{ danger: true }}
        >
          <button className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all font-black text-[10px]">
            <ClearOutlined />
          </button>
        </Popconfirm>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 overflow-hidden">
        
        <div className="lg:col-span-8 md:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="space-y-3 overflow-y-auto pr-2 no-scrollbar pb-20">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-3 flex items-center gap-3 transition-all shadow-sm">
                
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-800 rounded-xl flex-shrink-0 border border-slate-100 dark:border-slate-700 overflow-hidden p-1">
                  <img src={item.img} alt="" className="w-full h-full object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-black uppercase text-[11px] md:text-sm truncate leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold mt-0.5">
                      {Number(item.price).toLocaleString("tr-TR")}₺
                    </span>
                  </div>
                </div>

                <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                  <button onClick={() => decreaseItem(item)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"><MinusOutlined style={{fontSize: '10px'}}/></button>
                  <span className="w-6 text-center font-black text-slate-900 dark:text-white text-[12px]">{item.quantity}</span>
                  <button onClick={() => addItem(item)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"><PlusOutlined style={{fontSize: '10px'}}/></button>
                </div>

                <div className="flex flex-col items-end gap-1 ml-2">
                  <span className="text-slate-900 dark:text-white font-black text-[13px] md:text-base tracking-tighter">
                    {(item.quantity * item.price).toLocaleString("tr-TR")}₺
                  </span>
                  <button onClick={() => deleteItem(item)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <DeleteOutlined style={{fontSize: '14px'}} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 md:col-span-5 w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Özet</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 font-bold uppercase">Ara Toplam</span>
                <span className="text-slate-900 dark:text-white font-black">{calculatedSubTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}₺</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 font-bold uppercase">KDV (%{TAX_RATE})</span>
                <span className="text-slate-900 dark:text-white font-black">{calculatedTaxAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}₺</span>
              </div>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

              <div className="text-center py-2">
                <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                  {Math.floor(grandTotal).toLocaleString("tr-TR")}
                  <span className="text-sm ml-0.5 opacity-40">.{(grandTotal % 1).toFixed(2).split('.')[1]}₺</span>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20 mt-4"
              >
                TAMAMLA
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

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CartPage;