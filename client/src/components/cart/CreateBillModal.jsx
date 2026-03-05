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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity" 
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative w-full max-w-[1000px] bg-[#020617] border border-slate-900 rounded-[3rem] shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="flex items-center justify-between p-8 border-b border-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <FileProtectOutlined className="text-blue-500 text-xl" />
            </div>
            <div>
              <h2 className="text-white text-xl font-black uppercase italic tracking-tighter">ÖDEME ONAYI</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">İşlem Detaylarını Gözden Geçirin</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 text-slate-500 hover:text-white transition-all"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-7 p-10 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Müşteri Bilgisi</label>
              <div className="relative">
                <UserOutlined className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 text-lg" />
                <input
                  type="text"
                  placeholder="İsim veya Masa No..."
                  className="w-full h-20 bg-[#0a0f1e] border border-slate-800 rounded-[1.5rem] pl-16 pr-6 text-white font-bold outline-none focus:border-blue-600 transition-all text-base shadow-inner"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Ödeme Şekli</label>
              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setPaymentType("cart")}
                  className={`flex flex-col items-center justify-center h-40 rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                    paymentType === "cart"
                      ? "border-blue-600 bg-blue-600/10 text-white shadow-2xl shadow-blue-500/10"
                      : "border-slate-900 bg-[#0a0f1e] text-slate-600 opacity-40 hover:opacity-100"
                  }`}
                >
                  <CreditCardOutlined className="text-4xl mb-3" />
                  <span className="font-black uppercase text-[11px] tracking-widest">Kredi Kartı</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType("cash")}
                  className={`flex flex-col items-center justify-center h-40 rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                    paymentType === "cash"
                      ? "border-blue-600 bg-blue-600/10 text-white shadow-2xl shadow-blue-500/10"
                      : "border-slate-900 bg-[#0a0f1e] text-slate-600 opacity-40 hover:opacity-100"
                  }`}
                >
                  <WalletOutlined className="text-4xl mb-3" />
                  <span className="font-black uppercase text-[11px] tracking-widest">Nakit</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-10 bg-[#0a0f1e]/60 border-l border-slate-900/50 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Sipariş İçeriği</h3>
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-4 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center group">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white uppercase">{item.title}</span>
                      <span className="text-[10px] text-slate-600 font-black mt-0.5">X{item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-400 italic text-sm">
                      {(item.price * item.quantity).toLocaleString("tr-TR")}₺
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-900">
              <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                <span>Ara Toplam</span>
                <span>{total.toLocaleString("tr-TR")}₺</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-blue-500 uppercase tracking-widest">
                <span>KDV (%20)</span>
                <span>+{taxAmount.toLocaleString("tr-TR")}₺</span>
              </div>
              
              <div className="pt-6 text-center">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2 block">Toplam Tahsilat</span>
                <div className="text-6xl font-black text-white tracking-tighter">
                  {Math.floor(grandTotal).toLocaleString("tr-TR")}
                  <span className="text-2xl opacity-20 ml-1">.00₺</span>
                </div>
              </div>

              <button
                disabled={!isLoggedIn || loading}
                onClick={handleCreateBill}
                className={`w-full h-20 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase mt-8 transition-all active:scale-95 shadow-2xl ${
                  !isLoggedIn || loading 
                    ? "bg-slate-900 text-slate-700 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                }`}
              >
                {loading ? "İŞLENİYOR..." : !isLoggedIn ? "YETKİ YOK" : "ÖDEMEYİ TAMAMLA"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CreateBillModal;