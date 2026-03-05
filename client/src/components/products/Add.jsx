import { Form, message, Modal } from "antd"; 
import { PackagePlus } from "lucide-react";
import API from "../../config/appConfig";

const Add = ({ isAddModalOpen, setIsAddModalOpen, categories = [], refreshData }) => {
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin";

  const onFinish = async (values) => {
    if(!isAdmin) return message.error("Bu işlem için yetkiniz yok!");
    try {
      const res = await API.post("/products/add-product", { 
        ...values, 
        price: Number(values.price) 
      });

      if (res.status === 200 || res.status === 201) {
        message.success("Ürün başarıyla eklendi."); 
        setIsAddModalOpen(false); 
        form.resetFields();
        if (typeof refreshData === "function") {
          refreshData(); 
        }
      }
    } catch (err) {
      console.error("API HATASI:", err);
      message.error("İşlem başarısız.");
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium placeholder:text-slate-400";

  return (
    <Modal
      open={isAddModalOpen && isAdmin}
      onCancel={() => setIsAddModalOpen(false)}
      footer={null}
      centered
      destroyOnClose={true} 
      width={550}
      style={{ top: 20, padding: "10px" }} 
      className="modern-modal"
      modalRender={(modal) => (
        <div className="bg-white dark:bg-slate-950 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl transition-all duration-300 mx-auto max-h-[95vh] overflow-y-auto custom-scrollbar">
          {modal}
        </div>
      )}
    >
      <div className="flex items-center gap-3 md:gap-5 mb-6 md:mb-10 pt-2 md:pt-4">
        <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl md:rounded-[1.4rem] flex items-center justify-center shadow-lg shadow-blue-500/30 group shrink-0">
          <PackagePlus size={20} className="md:size-[26px] text-white group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            Yeni Ürün
          </h2>
          <p className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-1 md:mt-2 flex items-center gap-2">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Envanter Kayıt Paneli
          </p>
        </div>
      </div>

      <Form layout="vertical" onFinish={onFinish} form={form} className="space-y-3 md:space-y-5 px-1 md:px-2 pb-2">
        <Form.Item 
          name="title" 
          label={<span className="text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest ml-1">Ürün Adı</span>} 
          rules={[{ required: true, message: "Ürün adı gerekli!" }]}
          className="mb-2 md:mb-4"
        >
          <input className={`${inputClass} !py-3 md:!py-4`} placeholder="Örn: Double Espresso" />
        </Form.Item>

        <Form.Item 
          name="img" 
          label={<span className="text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest ml-1">Görsel Bağlantısı</span>} 
          rules={[{ required: true, message: "Görsel URL'si gerekli!" }]}
          className="mb-2 md:mb-4"
        >
          <input className={`${inputClass} !py-3 md:!py-4`} placeholder="https://resim-adresi.com/urun.jpg" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          <Form.Item 
            name="price" 
            label={<span className="text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest ml-1">Birim Fiyat (₺)</span>} 
            rules={[{ required: true, message: "Fiyat gerekli!" }]}
            className="mb-2 md:mb-4"
          >
            <input type="number" className={`${inputClass} !py-3 md:!py-4`} placeholder="0.00" />
          </Form.Item>

          <Form.Item 
            name="category" 
            label={<span className="text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest ml-1">Kategori</span>} 
            rules={[{ required: true, message: "Kategori seçiniz!" }]}
            className="mb-2 md:mb-4"
          >
            <div className="relative">
             <select className={`${inputClass} !py-3 md:!py-4 appearance-none cursor-pointer pr-10`}>
  <option value="" disabled selected className="dark:bg-slate-900">Seçiniz</option>
  {Array.isArray(categories) && categories.map((cat) => (
    <option key={cat._id} value={cat.title} className="dark:bg-slate-900">
      {cat.title.toUpperCase()}
    </option>
  ))}
</select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </Form.Item>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 pt-4 md:pt-6">
          <button 
            type="submit" 
            className="group w-full h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl md:rounded-[1.5rem] shadow-xl shadow-blue-500/25 transition-all active:scale-[0.97] uppercase tracking-[0.15em] text-xs md:text-sm flex items-center justify-center gap-3"
          >
            <PackagePlus size={18} md:size={20} />
            Ürünü Sisteme Kaydet
          </button>
          
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="w-full py-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-black transition-all uppercase text-[9px] md:text-[10px] tracking-widest"
          >
            İşlemi İptal Et
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default Add;