import { Button, Form, Input, Modal, Select, Table, Tag, Popconfirm, message, ConfigProvider, theme } from "antd";
import React, { useEffect, useState } from "react";
import { Edit3, Trash2 } from "lucide-react"; 
import Add from "./Add"; 
import API from "../../config/appConfig";

const Edit = ({ products, categories, refreshData, isAddModalOpen, setIsAddModalOpen }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState({});
  const [form] = Form.useForm();
  
  const user = JSON.parse(sessionStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin";
  

  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (isEditModalOpen && editingItem._id) {
      form.setFieldsValue(editingItem);
    }
  }, [editingItem, isEditModalOpen, form]);

  const onFinish = async (values) => {
    try {
      await API.put("/products/update-product", { 
        ...values, 
        price: Number(values.price),
        productId: editingItem._id 
      });
      message.success("Ürün başarıyla güncellendi.");
      setIsEditModalOpen(false);
      form.resetFields();
      refreshData();
    } catch (err) {
      message.error("Güncelleme sırasında bir hata oluştu.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete("/products/delete-product", { data: { productId: id } });
      message.success("Ürün başarıyla silindi.");
      refreshData();
    } catch (err) {
      message.error("Silme işlemi başarısız.");
      console.error(err);
    }
  };

  const columns = [
    { 
      title: "Görsel", 
      dataIndex: "img", 
      key: "img",
      width: 70,
      render: (img) => <img src={img} alt="" className="w-10 h-10 object-cover rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm" />
    },
    { 
      title: "Ürün Adı", 
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title || "").localeCompare(b.title || "", "tr"),
      render: (text) => <span className="font-bold text-slate-800 dark:text-slate-200">{text}</span>
    },
    { 
      title: "Kategori", 
      dataIndex: "category", 
      key: "category",
      render: (c) => (
        <Tag className="rounded-lg px-2 border-none bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider">
          {c}
        </Tag>
      )
    },
    { 
      title: "Fiyat", 
      dataIndex: "price", 
      key: "price",
      align: "right",
      render: (p) => <span className="font-black text-emerald-600 dark:text-emerald-400">{Number(p || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}₺</span> 
    },
    {
      title: "İşlem",
      key: "action",
      width: 100,
      align: "right",
      render: (_, record) => (
        isAdmin ? (
        <div className="flex gap-1 justify-end">
          <Button 
            type="text"
            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
            onClick={() => { setEditingItem(record); setIsEditModalOpen(true); }} 
            icon={<Edit3 size={16}/>} 
          />
          <Popconfirm 
            title="Silmek istediğinize emin misiniz?" 
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" icon={<Trash2 size={16}/>} />
          </Popconfirm>
        </div>
        ) : <Tag color="error">Yetki Yok</Tag>
      )
    }
  ];

  if (!isAdmin) return <div className="p-10 text-center font-bold text-slate-500">Bu sayfaya erişim yetkiniz bulunmamaktadır.</div>;

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 16,
          colorBgContainer: isDark ? '#020617' : '#ffffff', 
          colorBorder: isDark ? '#1e293b' : '#e2e8f0'
        }
      }}
    >
      <div className={`custom-table-container ${isDark ? 'dark-mode-active' : ''}`}>
        <Table 
          dataSource={products} 
          columns={columns} 
          rowKey="_id" 
          pagination={{ 
            pageSize: 8,
            showSizeChanger: false,
            className: "px-4 py-4 m-0 flex justify-center sm:justify-end items-center"
          }}
          scroll={{ x: 700 }}
          className="product-table transition-all"
        />
      </div>

      <Add 
        isAddModalOpen={isAddModalOpen} 
        setIsAddModalOpen={setIsAddModalOpen} 
        categories={categories} 
        refreshData={refreshData} 
      />

      <Modal 
        title={
          <div className="flex flex-col gap-1 pt-2">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
              Ürünü Düzenle
            </h2>
            <div className="h-1 w-10 bg-blue-600 rounded-full" />
          </div>
        } 
        open={isEditModalOpen} 
        forceRender 
        onCancel={() => {
            setIsEditModalOpen(false);
            form.resetFields();
        }} 
        footer={null}
        centered
        width={500}
        rootClassName={isDark ? "dark-modal-root" : ""}
        modalRender={(modal) => (
          <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl">
            {modal}
          </div>
        )}
      >
        <Form 
          form={form} 
          onFinish={onFinish} 
          layout="vertical" 
          className="mt-6 space-y-4 px-2 pb-4"
        >
          <Form.Item 
            name="title" 
            label={<span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ürün Adı</span>} 
            rules={[{ required: true, message: 'Ürün adı gerekli' }]}
          >
            <Input className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white" />
          </Form.Item>

          <Form.Item 
            name="img" 
            label={<span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Görsel URL</span>}
          >
            <Input className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              name="category" 
              label={<span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Kategori</span>} 
              rules={[{ required: true, message: 'Kategori seçiniz' }]}
            >
              <Select 
                className="h-12 w-full rounded-2xl"
                placeholder="Seçiniz"
                options={categories.map(c => ({
                  label: <span className="text-xs font-bold">{c.title.toUpperCase()}</span>, 
                  value: c.title
                }))} 
              />
            </Form.Item>

            <Form.Item 
              name="price" 
              label={<span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Fiyat (₺)</span>} 
              rules={[{ required: true, message: 'Fiyat gerekli' }]}
            >
              <Input 
                type="number" 
                className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white" 
              />
            </Form.Item>
          </div>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            className="h-14 mt-6 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 border-none shadow-lg shadow-blue-500/30 text-xs font-black tracking-[0.2em] uppercase transition-all"
          >
            GÜNCELLEMEYİ KAYDET
          </Button>
        </Form>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-table-container .ant-table-body::-webkit-scrollbar,
        .custom-table-container .ant-table-content::-webkit-scrollbar {
          display: none !important;
        }

        .ant-table-pagination.ant-pagination {
          margin: 16px 0 !important;
          float: none !important;
          display: flex !important;
          width: 100% !important;
          flex-wrap: nowrap !important;
        }

        ${isDark ? `
          .ant-table-thead > tr > th {
            background: #0f172a !important;
            color: #94a3b8 !important;
            border-bottom: 1px solid #1e293b !important;
          }
          .ant-table-row { background: #020617 !important; }
          .ant-table-cell { border-bottom: 1px solid #1e293b !important; }
          .ant-pagination-item-active { background: #1e293b !important; border-color: #2563eb !important; }
        ` : ''}
      `}} />
    </ConfigProvider>
  );
};

export default Edit;