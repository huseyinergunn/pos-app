import { CreditCardOutlined, WalletOutlined, UserOutlined, FileProtectOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd"; 
import API from "../../config/appConfig";
import { reset } from "../../redux/slices/cartSlice";

const CreateBillModal = ({ isModalOpen, setIsModalOpen, cartItems, total, taxAmount, grandTotal }) => {
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
      setIsModalOpen(false);
      message.success("Fatura başarıyla oluşturuldu!");
      navigate("/bills");
    } catch (err) {
      message.error("Fatura oluşturulamadı!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4">
      
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" 
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative w-full max-w-[900px] max-h-[95vh] lg:max-h-none overflow-y-auto bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2rem] sm:rounded-[3rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300 custom-scrollbar">
        
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 sm:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/10 dark:bg-blue-600/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-blue-500/20 dark:border-blue-500/30">
              <FileProtectOutlined className="text-blue-600 dark:text-blue-500 text-lg sm:text-xl" />
            </div>
            <div>
              <h2 className="text-slate-900 dark:text-white text-base sm:text-lg font-black uppercase tracking-tighter leading-none">Ödeme Onayı</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-1">İşlem Detaylarını Gözden Geçirin</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em]">Müşteri Bilgisi</label>
              <div className="relative">
                <UserOutlined className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="İsim veya Masa No..."
                  className="w-full h-14 sm:h-16 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-4 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em]">Ödeme Şekli</label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentType("cart")}
                  className={`flex flex-col items-center justify-center p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                    paymentType === "cart"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-white shadow-lg shadow-blue-500/10"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 hover:border-slate-200"
                  }`}
                >
                  <CreditCardOutlined className="text-2xl sm:text-3xl mb-2 sm:mb-3" />
                  <span className="font-black uppercase text-[9px] sm:text-[11px] tracking-widest">Kredi Kartı</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType("cash")}
                  className={`flex flex-col items-center justify-center p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                    paymentType === "cash"
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-white shadow-lg shadow-emerald-500/10"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 hover:border-slate-200"
                  }`}
                >
                  <WalletOutlined className="text-2xl sm:text-3xl mb-2 sm:mb-3" />
                  <span className="font-black uppercase text-[9px] sm:text-[11px] tracking-widest">Nakit</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 bg-slate-50/50 dark:bg-black/20 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 sm:mb-6">Sipariş İçeriği</h3>
              <div className="space-y-3 sm:space-y-4 max-h-[150px] sm:max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">{item.title}</span>
                      <span className="text-[8px] sm:text-[9px] text-slate-400 font-black mt-0.5 uppercase">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      {(item.price * item.quantity).toLocaleString("tr-TR")}₺
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 pt-5 border-t border-slate-200 dark:border-slate-800 mt-5 sm:mt-6">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Ara Toplam</span>
                <span>{total.toLocaleString("tr-TR")}₺</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-red-500/70 uppercase tracking-widest">
                <span>KDV (%20)</span>
                <span>+{taxAmount.toLocaleString("tr-TR")}₺</span>
              </div>
              
              <div className="pt-3 sm:pt-4 flex flex-col items-center text-center">
                <span className="text-[8px] sm:text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-1">Toplam Tahsilat</span>
                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {Math.floor(grandTotal).toLocaleString("tr-TR")}
                  <span className="text-base sm:text-xl text-blue-600 dark:text-blue-500 opacity-80">.{(grandTotal % 1).toFixed(2).split('.')[1]}₺</span>
                </div>
              </div>

              <button
                disabled={!isLoggedIn || loading}
                onClick={handleCreateBill}
                className={`w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-[12px] tracking-[0.2em] uppercase mt-4 sm:mt-6 transition-all active:scale-95 shadow-xl ${
                  !isLoggedIn || loading 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30"
                }`}
              >
                {loading ? "İŞLENİYOR..." : !isLoggedIn ? "YETKİ YOK" : "ÖDEMEYİ TAMAMLA"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBillModal;