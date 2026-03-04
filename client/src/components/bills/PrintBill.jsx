import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { App } from "antd"; 
import { TAX_RATE } from "../../config/appConfig";

const PrintBill = ({ isModalOpen, setIsModalOpen, customer }) => {
  const componentRef = useRef(null);
  const { message } = App.useApp(); 

  const totalAmount = Number(customer?.totalAmount || 0);
  const taxDivider = 1 + TAX_RATE / 100;
  const subTotal = totalAmount / taxDivider;
  const taxAmount = totalAmount - subTotal;
  const billNumber = customer?._id ? customer._id.slice(-6).toUpperCase() : "0000";

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Fatura-${billNumber}`,
    onAfterPrint: () => message.success("Yazdırma işlemi başlatıldı."),
  });

  const formatCurrency = (val) => Number(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity cursor-pointer" 
        onClick={() => setIsModalOpen(false)}
      />

      
      <div className="relative w-full max-w-[850px] bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
        
        
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <PrinterOutlined className="text-blue-600 text-lg" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight dark:text-white">
              Fatura Önizleme
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:text-slate-400 transition-all border border-transparent hover:border-red-100"
          >
            <CloseOutlined />
          </button>
        </div>

      
        <div className="bg-slate-100 dark:bg-black/40 p-4 md:p-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: '65vh' }}>
          
          <div className="flex justify-center" style={{ transform: 'scale(0.7)', transformOrigin: 'top center', marginBottom: '-300px' }}>
            <section 
              ref={componentRef} 
              className="bg-white p-[20mm] shadow-2xl text-left text-black" 
              style={{ width: '210mm', minHeight: '297mm' }}
            >
             
              <div className="flex justify-between border-b-4 border-black pb-8">
                <h2 className="text-4xl font-black italic tracking-tighter">NEXPOS</h2>
                <div className="text-right">
                  <h1 className="text-5xl font-light text-slate-300 tracking-[0.2em] uppercase">Fatura</h1>
                  <p className="font-mono font-bold text-xl mt-2">#INV-{billNumber}</p>
                </div>
              </div>

              
              <div className="my-10 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Faturalanan Müşteri</p>
                  <h3 className="text-2xl font-black uppercase leading-tight">{customer?.customerName}</h3>
                  <div className="w-12 h-1 bg-black mt-3"></div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">İşlem Tarihi</p>
                  <p className="text-lg font-bold">{new Date(customer?.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

            
              <table className="w-full mt-10">
                <thead>
                  <tr className="border-b-2 border-black text-left text-[11px] font-black uppercase tracking-wider">
                    <th className="py-3">Ürün Açıklaması</th>
                    <th className="py-3 text-center w-24">Adet</th>
                    <th className="py-3 text-right w-32">Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customer?.cartItems?.map((item, i) => (
                    <tr key={i} className="text-sm">
                      <td className="py-5 font-bold text-slate-800">{item.title}</td>
                      <td className="py-5 text-center font-medium">x{item.quantity}</td>
                      <td className="py-5 text-right font-black tracking-tight">{formatCurrency(item.price * item.quantity)}₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-20 flex justify-end">
                <div className="w-72 space-y-3">
                  <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Ara Toplam</span>
                    <span className="text-black">{formatCurrency(subTotal)}₺</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    <span>KDV (%{TAX_RATE})</span>
                    <span className="text-black">+{formatCurrency(taxAmount)}₺</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black border-t-4 border-black pt-4 mt-4">
                    <span>TOPLAM</span>
                    <span className="tracking-tighter">{formatCurrency(totalAmount)}₺</span>
                  </div>
                </div>
              </div>

             
              <div className="mt-24 border-t border-slate-100 pt-10 text-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">Teşekkür Ederiz</p>
                <p className="text-[9px] text-slate-400 mt-2">Bu belge elektronik ortamda Nexpos sistemi tarafından oluşturulmuştur.</p>
              </div>
            </section>
          </div>
        </div>

        
        <div className="flex justify-center gap-4 p-6 border-t dark:border-slate-800 bg-white dark:bg-[#0f172a]">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="flex-1 max-w-[160px] h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 uppercase text-xs tracking-widest"
          >
            Vazgeç
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 max-w-[240px] h-14 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <PrinterOutlined />
            YAZDIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintBill;