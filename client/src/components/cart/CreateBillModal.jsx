import { 
  CreditCardOutlined, 
  WalletOutlined, 
  UserOutlined, 
  FileProtectOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd"; 
import API from "../../config/appConfig";
import { reset } from "../../redux/slices/cartSlice";

const CreateBillModal = ({ isModalOpen, setIsModalOpen, cartItems, total, taxAmount, grandTotal, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("cart");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const user = JSON.parse(localStorage.getItem("posUser"));
  const isLoggedIn = Boolean(user?.token);

  const handleCreateBill = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const newBill = {
        customerName: customerName.trim() !== "" ? customerName.trim() : `Müşteri-${Date.now()}`,
        paymentMethod: paymentType,
        subTotal: Number(total.toFixed(2)),
        tax: Number(taxAmount.toFixed(2)),
        totalAmount: Number(grandTotal.toFixed(2)),
        cartItems: cartItems,
      };

      await API.post("/bills", newBill);
      dispatch(reset()); 
      message.success("Fatura başarıyla oluşturuldu!");
      
      if (onSuccess) {
        onSuccess();
      } else {
        setIsModalOpen(false);
      }
      
      navigate("/bills");  
    } catch (err) {
      message.error("Fatura oluşturulamadı!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4">
      <div 
        className="absolute inset-0 bg-slate-500/20 dark:bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative w-full max-w-[1000px] h-[88vh] md:h-auto max-h-[90vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom md:zoom-in duration-300">
        
        <div className="flex items-center justify-between p-4 md:p-8 border-b border-slate-100 dark:border-slate-900 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <FileProtectOutlined className="text-blue-500 text-lg md:text-xl" />
            </div>
            <div>
              <h2 className="text-slate-900 dark:text-white text-base md:text-xl font-black uppercase italic tracking-tighter">ÖDEME ONAYI</h2>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-red-500 transition-all"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-7 p-5 md:p-10 space-y-6 md:space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.4em]">Müşteri Bilgisi</label>
                <div className="relative">
                  <UserOutlined className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                  <input
                    type="text"
                    placeholder="İsim veya Masa No..."
                    className="w-full h-12 md:h-20 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-[1.5rem] pl-14 pr-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-all text-sm"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-[0.4em]">Ödeme Şekli</label>
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <button
                    type="button"
                    onClick={() => setPaymentType("cart")}
                    className={`flex flex-col items-center justify-center h-24 md:h-40 rounded-2xl md:rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                      paymentType === "cart"
                        ? "border-blue-600 bg-blue-600/10 text-blue-600 dark:text-white"
                        : "border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/50 text-slate-400 opacity-60"
                    }`}
                  >
                    <CreditCardOutlined className="text-xl md:text-4xl mb-1" />
                    <span className="font-black uppercase text-[8px] md:text-[11px] tracking-widest">Kredi Kartı</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType("cash")}
                    className={`flex flex-col items-center justify-center h-24 md:h-40 rounded-2xl md:rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                      paymentType === "cash"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/50 text-slate-400 opacity-60"
                    }`}
                  >
                    <WalletOutlined className="text-xl md:text-4xl mb-1" />
                    <span className="font-black uppercase text-[8px] md:text-[11px] tracking-widest">Nakit</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 md:p-10 bg-slate-50 dark:bg-slate-900/30 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-900 flex flex-col">
              <div className="space-y-4 mb-6">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Sipariş Özeti</h3>
                <div className="space-y-3 max-h-[120px] md:max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[11px] md:text-sm font-bold text-slate-800 dark:text-white uppercase">{item.title}</span>
                        <span className="text-[9px] text-slate-400 font-black">X{item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-600 dark:text-slate-400 italic text-[11px] md:text-sm">
                        {(item.price * item.quantity).toLocaleString("tr-TR")}₺
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Ara Toplam</span>
                  <span>{total.toLocaleString("tr-TR")}₺</span>
                </div>
                <div className="flex justify-between text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                  <span>KDV (%20)</span>
                  <span>+{taxAmount.toLocaleString("tr-TR")}₺</span>
                </div>
                
                <div className="pt-2 text-center">
                  <div className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                    {Math.floor(grandTotal).toLocaleString("tr-TR")}
                    <span className="text-sm md:text-2xl opacity-20 ml-1">.00₺</span>
                  </div>
                </div>

                <button
                  disabled={!isLoggedIn || loading}
                  onClick={handleCreateBill}
                  className={`w-full h-12 md:h-20 rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-xs tracking-[0.2em] uppercase mt-4 transition-all active:scale-95 shadow-lg ${
                    !isLoggedIn || loading 
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                      : paymentType === "cart" 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                        : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20"
                  }`}
                >
                  {loading ? "İŞLENİYOR..." : !isLoggedIn ? "YETKİ YOK" : "ÖDEMEYİ TAMAMLA"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default CreateBillModal;