import { Button, Form, message, Modal } from "antd";
import API from "../../config/appConfig";
import { PlusOutlined } from "@ant-design/icons";

const Add = ({ isAddModalOpen, setIsAddModalOpen, categories, setCategories }) => {
  const [form] = Form.useForm();
  const isDark = document.documentElement.classList.contains("dark");

  const onFinish = async (values) => {
    try {
      const res = await API.post("/categories/add-category", values);
      message.success("Kategori başarıyla eklendi.");
      
      const newCategory = {
        ...values,
        _id: res.data?._id || Date.now().toString(),
      };

      setCategories([...categories, newCategory]);
      form.resetFields();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error("Kategori eklenirken bir hata oluştu.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none ring-0 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

  return (
    <Modal
      open={isAddModalOpen}
      onCancel={() => setIsAddModalOpen(false)}
      footer={false}
      centered
      closable={true}
    
      styles={{
        content: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff", 
          borderRadius: "2rem",
          padding: "2rem"
        },
      }}
    >
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
          <PlusOutlined className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Yeni Kategori
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">
            İşletmenize yeni bir grup ekleyin
          </p>
        </div>
      </div>

      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="title"
          label={<span className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">Kategori Başlığı</span>}
          rules={[{ required: true, message: "Kategori Alanı Boş Geçilemez!" }]}
        >
        
          <input 
            placeholder="Örn: Mamalar" 
            className={inputClass} 
            autoComplete="off"
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-8">
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="px-6 h-12 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            İptal
          </button>
          <button 
            type="submit" 
            className="px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            OLUŞTUR
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default Add;