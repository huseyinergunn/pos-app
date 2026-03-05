import { CloseOutlined, PrinterOutlined, SafetyOutlined } from "@ant-design/icons";
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
  const billNumber = customer?._id ? customer._id.slice(-8).toUpperCase() : "00000000";

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `e-Fatura-${billNumber}`,
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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

      <div className="relative w-full max-w-[800px] bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 max-h-[85vh] z-10 overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center font-black text-blue-600">
              <PrinterOutlined />
            </div>
            <h3 className="text-xs font-black uppercase tracking-tight dark:text-white">Fatura Önizleme</h3>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition-all">
            <CloseOutlined />
          </button>
        </div>

        <div className="flex-1 bg-slate-100 dark:bg-black/40 overflow-x-hidden overflow-y-auto p-4 flex justify-center custom-scrollbar">
          <div className="w-full flex justify-center pt-0 items-start pb-20">
              <div className="print-container origin-top scale-[0.42] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.85] transition-all duration-300">
                <section 
                  ref={componentRef} 
                  className="bg-white p-[15mm] text-left text-black bill-content mx-auto" 
                  style={{ width: '210mm', minHeight: '297mm', height: 'fit-content' }}
                >
                  <div className="flex justify-between items-start border-b-4 border-black pb-8">
                    <div className="space-y-0">
                      <h2 className="text-4xl font-black italic tracking-tighter">NEXPOS</h2>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Akıllı Satış ve Stok Yönetimi</p>
                    </div>
                    <div className="text-right">
                      <h1 className="text-5xl font-light text-slate-200 tracking-[0.2em] uppercase leading-none">Fatura</h1>
                      <p className="font-mono font-bold text-xl mt-3 tracking-tighter">#INV-{billNumber}</p>
                    </div>
                  </div>

                  <div className="my-10 grid grid-cols-2 gap-12">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Faturalanan Müşteri</p>
                      <h3 className="text-2xl font-black uppercase leading-tight break-words">{customer?.customerName}</h3>
                      <div className="w-12 h-1.5 bg-black mt-4"></div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">İşlem Tarihi</p>
                      <p className="text-lg font-bold">{new Date(customer?.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <table className="w-full mt-10">
                    <thead>
                      <tr className="border-b-2 border-black text-left text-[11px] font-black uppercase tracking-wider">
                        <th className="py-4">Ürün Açıklaması</th>
                        <th className="py-4 text-center w-24">Adet</th>
                        <th className="py-4 text-right w-32">Toplam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customer?.cartItems?.map((item, i) => (
                        <tr key={i} className="text-[15px]">
                          <td className="py-5 font-bold text-slate-800">{item.title}</td>
                          <td className="py-5 text-center font-medium">x{item.quantity}</td>
                          <td className="py-5 text-right font-black tracking-tight">{formatCurrency(item.price * item.quantity)}₺</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-16 flex justify-end mb-24">
                    <div className="w-72 space-y-3">
                      <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Ara Toplam</span>
                        <span className="text-black">{formatCurrency(subTotal)}₺</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        <span>KDV (%{TAX_RATE})</span>
                        <span className="text-black">+{formatCurrency(taxAmount)}₺</span>
                      </div>
                      <div className="flex justify-between text-3xl font-black border-t-4 border-black pt-5 mt-4">
                        <span>TOPLAM</span>
                        <span className="tracking-tighter">{formatCurrency(totalAmount)}₺</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-10 text-center border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] mb-4">Teşekkür Ederiz</p>
                    <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 italic">
                      <SafetyOutlined />
                      <span>Bu belge elektronik ortamda oluşturulmuştur. İrsaliye yerine geçer.</span>
                    </div>
                  </div>
                </section>
              </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t dark:border-slate-800 bg-white dark:bg-[#0f172a] flex gap-3 shrink-0 items-center">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="flex-1 h-14 rounded-2xl font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all uppercase text-[11px] tracking-widest"
          >
            Vazgeç
          </button>
          <button 
            onClick={handlePrint}
            className="flex-[2] h-14 rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <PrinterOutlined />
            Faturayı Yazdır
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: A4; 
            margin: 0 !important; 
          }
          body { 
            -webkit-print-color-adjust: exact; 
            margin: 0 !important; 
            padding: 0 !important;
          }
          /* Yazdırma anında modal ve arkaplanı gizle */
          .fixed, .absolute { visibility: hidden !important; }
          /* Sadece fatura içeriğini göster */
          .bill-content { 
            visibility: visible !important;
            position: fixed !important; 
            left: 0 !important; 
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 9999 !important;
          }
          .bill-content * { visibility: visible !important; }
        }

        /* Köşe Sorunu Çözümü (Görselde işaretlediğin yer) */
        .ant-modal-content, .relative.rounded-[2.5rem] {
          overflow: hidden !important; /* Bu satır köşelerin dışarı taşmasını engeller */
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

export default PrintBill;