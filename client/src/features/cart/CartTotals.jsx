import { useState } from "react";
import { Button, App, Modal } from "antd"; // message yerine App eklendi
import { CloseOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../../hooks/useCart";
import CreateBillModal from "../../components/cart/CreateBillModal";
import { TAX_RATE } from "../../config/appConfig";

const CartTotals = ({ onClose }) => {
  const { cartItems, grandTotal, addItem, decreaseItem, deleteItem, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Ant Design App Hook'ları (Dark mode uyumlu mesaj ve modal için)
  const { message, modal } = App.useApp();

  const taxDivider = 1 + TAX_RATE / 100;
  const subTotal = grandTotal / taxDivider;
  const taxAmount = grandTotal - subTotal;
  const user = JSON.parse(localStorage.getItem("posUser"));
  const isLoggedIn = Boolean(user?.token);

  const handleClear = () => {
    modal.confirm({ // Modal.confirm yerine modal.confirm (context uyumlu)
      title: 'Sepeti Boşalt?',
      content: 'Tüm ürünler silinecek. Emin misiniz?',
      okText: 'Evet, Sil',
      okType: 'danger',
      onOk: () => { 
        clearCart(); 
        message.success("Sepet temizlendi."); 
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-all relative overflow-hidden">
      
      <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>

      <div className="shrink-0 px-6 py-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <ShoppingCartOutlined className="text-white text-base" />
          </div>
          <div>
            <h2 className="text-xs font-black dark:text-white uppercase tracking-tight leading-none">Sipariş</h2>
            <span className="text-[9px] text-slate-400 font-bold uppercase">{cartItems.length} Ürün</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            type="text" 
            danger 
            size="small"
            onClick={handleClear} 
            className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100"
            disabled={cartItems.length === 0}
          >
            Temizle
          </Button>
          <Button 
            type="text" 
            icon={<CloseOutlined className="text-xs" />} 
            onClick={onClose}
            className="md:hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full w-8 h-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-white dark:bg-slate-900">
        {cartItems.length > 0 ? (
          [...cartItems].reverse().map((item) => (
            <div key={item._id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover border dark:border-slate-600" />
                  <button 
                    onClick={() => deleteItem(item)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <CloseOutlined className="text-[6px]" />
                  </button>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[10px] font-black dark:text-white uppercase truncate w-24 leading-none mb-1">{item.title}</h3>
                  <p className="text-blue-600 font-bold text-[10px] leading-none">{(item.price).toLocaleString("tr-TR")}₺</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white dark:bg-slate-700 p-1 rounded-lg border dark:border-slate-600">
                <button onClick={() => decreaseItem(item)} className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-600 shadow-sm transition-colors">
                  <MinusOutlined className="text-[7px]" />
                </button>
                <span className="w-6 text-center font-black text-[10px] dark:text-white">{item.quantity}</span>
                <button onClick={() => addItem(item)} className="w-5 h-5 flex items-center justify-center rounded bg-blue-600 text-white shadow-sm hover:bg-blue-700">
                  <PlusOutlined className="text-[7px]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
            <ShoppingCartOutlined className="text-6xl mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center px-10">Sepetiniz Boş</span>
          </div>
        )}
      </div>

      <div className="shrink-0 p-5 bg-white dark:bg-slate-800 border-t dark:border-slate-700 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Genel Toplam</span>
             <span className="text-2xl font-black text-blue-600 tracking-tighter leading-none">{grandTotal.toLocaleString("tr-TR")}₺</span>
          </div>
          <div className="flex flex-col items-end opacity-60">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">KDV Dahil</span>
             <span className="text-[11px] font-black dark:text-white leading-none">Ara: {subTotal.toLocaleString("tr-TR", {maximumFractionDigits:0})}₺</span>
          </div>
        </div>

        <Button 
          type="primary" 
          block 
          disabled={cartItems.length === 0 || !isLoggedIn} 
          onClick={() => setIsModalOpen(true)}
          className="h-14 rounded-xl bg-blue-600 hover:bg-blue-700 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 border-none transition-all active:scale-95 disabled:opacity-50"
        >
          {!isLoggedIn ? "Giriş Yapılmalı" : "Siparişi Tamamla"}
        </Button>
      </div>

      <CreateBillModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        cartItems={cartItems} 
        total={subTotal} 
        taxAmount={taxAmount} 
        grandTotal={grandTotal} 
      />
    </div>
  );
};

export default CartTotals;