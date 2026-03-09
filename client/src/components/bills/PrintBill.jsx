import { CloseOutlined, PrinterOutlined, SafetyOutlined, FilePdfOutlined } from "@ant-design/icons";
import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { App } from "antd"; 
import { TAX_RATE } from "../../config/appConfig";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

  const handleDownloadPDF = async () => {
    message.loading({ content: "PDF Hazırlanıyor...", key: "pdf" });
    const element = componentRef.current;
    const canvas = await html2canvas(element, {
      scale: 3, 
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
    });
    
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(`Fatura-${billNumber}.pdf`);
    message.success({ content: "PDF başarıyla indirildi.", key: "pdf" });
  };

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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

      <div className="relative w-full max-w-[900px] bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 max-h-[95vh] z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-5 border-b dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <PrinterOutlined className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight dark:text-white leading-none">Fatura Önizleme</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1">SİSTEM ÇIKTISI GÖRÜNTÜLENİYOR</p>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition-all active:scale-90">
            <CloseOutlined />
          </button>
        </div>

        <div className="flex-1 bg-slate-200 dark:bg-slate-950 overflow-auto p-4 flex justify-center custom-scrollbar">
          <div className="w-fit h-fit shadow-2xl origin-top transition-transform duration-300 sm:scale-100 scale-[0.42] sm:my-4">
            <section 
              ref={componentRef} 
              className="bg-white text-left text-black bill-content p-[15mm] flex flex-col" 
              style={{ width: '210mm', minHeight: '297mm', height: 'fit-content', color: '#000' }}
            >
              <div className="flex justify-between items-start border-b-[6px] border-black pb-8">
                <div>
                  <h2 className="text-5xl font-black tracking-tighter text-black">NEXPOS</h2>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Smart Point of Sale Systems</p>
                </div>
                <div className="text-right">
                  <h1 className="text-6xl font-black text-slate-100 tracking-tighter uppercase leading-none mb-4">INVOICE</h1>
                  <div className="inline-block bg-black text-white px-4 py-1 text-sm font-mono font-bold uppercase">
                    No: #{billNumber}
                  </div>
                </div>
              </div>

              <div className="my-12 grid grid-cols-2 gap-20">
                <div className="border-l-4 border-black pl-6">
                  <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-3">Müşteri Bilgileri</p>
                  <h3 className="text-3xl font-black uppercase leading-none text-black mb-2">{customer?.customerName}</h3>
                  <p className="text-sm text-slate-500 font-medium italic">Perakende Satış Müşterisi</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-3">İşlem Detayları</p>
                  <p className="text-xl font-black text-black">{new Date(customer?.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">{new Date(customer?.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <table className="w-full mt-4">
                <thead>
                  <tr className="border-b-4 border-black text-left text-[12px] font-black uppercase tracking-widest text-black">
                    <th className="py-4">Ürün Detayı</th>
                    <th className="py-4 text-center w-24">Miktar</th>
                    <th className="py-4 text-right w-40">Birim</th>
                    <th className="py-4 text-right w-40">Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {customer?.cartItems?.map((item, i) => (
                    <tr key={i} className="text-[16px]">
                      <td className="py-6 font-black text-black uppercase tracking-tight">{item.title}</td>
                      <td className="py-6 text-center font-bold">x{item.quantity}</td>
                      <td className="py-6 text-right font-medium text-slate-500">{formatCurrency(item.price)}₺</td>
                      <td className="py-6 text-right font-black text-black">{formatCurrency(item.price * item.quantity)}₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-auto pt-10 flex justify-end">
                <div className="w-80 space-y-4">
                  <div className="flex justify-between text-[12px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Ara Toplam</span>
                    <span className="text-black">{formatCurrency(subTotal)}₺</span>
                  </div>
                  <div className="flex justify-between text-[12px] font-black text-slate-400 uppercase tracking-widest">
                    <span>KDV (%{TAX_RATE})</span>
                    <span className="text-black">+{formatCurrency(taxAmount)}₺</span>
                  </div>
                  <div className="flex justify-between text-4xl font-black border-t-[6px] border-black pt-6 mt-6 text-black">
                    <span>TOPLAM</span>
                    <span className="tracking-tighter">{formatCurrency(totalAmount)}₺</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-8 border-t-2 border-dashed border-slate-200 text-center">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] mb-6">Teşekkür Ederiz</p>
                <div className="bg-slate-50 py-4 px-6 inline-flex items-center gap-3 rounded-full">
                  <SafetyOutlined className="text-blue-600 text-lg" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    Bu belge 213 sayılı VUK uyarınca elektronik ortamda düzenlenmiştir.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-5 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row gap-3 shrink-0 items-center">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="w-full sm:flex-1 h-14 rounded-2xl font-black text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-slate-600 transition-all uppercase text-[10px] tracking-widest"
          >
            Kapat
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="w-full sm:flex-1 h-14 rounded-2xl bg-emerald-500 text-white font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
          >
            <FilePdfOutlined className="text-lg" />
            PDF
          </button>
          <button 
            onClick={handlePrint}
            className="w-full sm:flex-1 h-14 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
          >
            <PrinterOutlined className="text-lg" />
            Yazdır
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 0mm !important; }
          html, body { height: 100%; margin: 0 !important; padding: 0 !important; background: #fff !important; }
          .fixed, .absolute, button, .shrink-0 { display: none !important; }
          .custom-scrollbar { overflow: visible !important; }
          section.bill-content { 
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            visibility: visible !important;
            display: block !important;
            box-shadow: none !important;
            transform: none !important;
            border: none !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default PrintBill;
