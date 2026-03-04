import { Button, Form, message, Modal, Table } from "antd";
import React, { useState, useEffect } from "react";
import API from "../../config/appConfig";
import { EditOutlined } from "@ant-design/icons";

const Edit = ({ isEditModalOpen, setIsEditModalOpen, categories, setCategories }) => {
  const [editingRow, setEditingRow] = useState({});
  const [form] = Form.useForm();
  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
  if (isEditModalOpen && form) {
    if (editingRow && editingRow._id) {
      form.setFieldsValue({ title: editingRow.title });
    } else {
      form.resetFields();
    }
  }
}, [editingRow, form, isEditModalOpen]);

  const onFinish = async (values) => {
    try {
      await API.put("/categories/update-category", {
        ...values,
        categoryId: editingRow._id,
      });
      message.success("Kategori başarıyla güncellendi.");
      
      setCategories(
        categories.map((item) => {
          if (item._id === editingRow._id) {
            return { ...item, title: values.title };
          }
          return item;
        })
      );
      setEditingRow({});
    } catch (error) {
      message.error("Kategori güncellenirken bir hata oluştu.");
      console.error("Kategori güncellenirken hata oluştu:", error);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      try {
        await API.delete("/categories/delete-category", {
          data: { categoryId: id },
        });
        message.success("Kategori başarıyla silindi.");
        setCategories(categories.filter((item) => item._id !== id));
      } catch (error) {
        message.error("Kategori silinirken bir hata oluştu.");
        console.error("Kategori silinirken hata oluştu:", error);
      }
    }
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm";

  const columns = [
    {
      title: <span className="text-xs uppercase tracking-wider font-bold">Kategori Başlığı</span>,
      dataIndex: "title",
      render: (text, record) => {
        if (record._id === editingRow._id) {
          return (
            <Form.Item 
                className="mb-0" 
                name="title" 
                rules={[{ required: true, message: "Boş olamaz!" }]}
            >
              <input className={inputClass} autoFocus />
            </Form.Item>
          );
        }
        return <p className="text-slate-700 dark:text-slate-200 font-medium">{text}</p>;
      },
    },
    {
      title: <span className="text-xs uppercase tracking-wider font-bold">İşlem</span>,
      width: 180,
      render: (_, record) => (
        <div className="flex gap-4">
          {record._id === editingRow._id ? (
            <>
              <button type="submit" className="text-emerald-500 hover:text-emerald-600 font-bold text-sm transition-colors">
                Kaydet
              </button>
              <button type="button" onClick={() => setEditingRow({})} className="text-slate-400 hover:text-slate-500 font-bold text-sm transition-colors">
                İptal
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setEditingRow(record)} className="text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors">
              Düzenle
            </button>
          )}
          <button type="button" onClick={() => deleteCategory(record._id)} className="text-red-500 hover:text-red-600 font-bold text-sm transition-colors">
            Sil
          </button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={isEditModalOpen}
      footer={false}
      onCancel={() => {
        setIsEditModalOpen(false);
        setEditingRow({});
      }}
      width={700}
      centered
      destroyOnClose
      styles={{
        content: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderRadius: "2rem",
          padding: "2rem"
        }
      }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
          <EditOutlined className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Kategori Yönetimi
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">
            Mevcut grupları düzenleyin veya silin
          </p>
        </div>
      </div>

      <Form form={form} onFinish={onFinish}>
        <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
          <Table
            dataSource={categories}
            columns={columns}
            rowKey="_id"
            pagination={{ 
              pageSize: 5,
              showSizeChanger: false,
              className: "px-4 dark:text-white"
            }}
            className="custom-table"
            rowClassName={() => "dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"}
          />
        </div>
      </Form>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-table .ant-table { background: transparent !important; }
        .custom-table .ant-table-thead > tr > th { 
          background: ${isDark ? '#1e293b' : '#f8fafc'} !important; 
          color: ${isDark ? '#94a3b8' : '#64748b'} !important;
          border-bottom: 1px solid ${isDark ? '#334155' : '#e2e8f0'} !important;
        }
        .custom-table .ant-table-tbody > tr > td { 
          border-bottom: 1px solid ${isDark ? '#1e293b' : '#f1f5f9'} !important;
        }
        .ant-pagination-item-active { border-color: #2563eb !important; }
        .ant-pagination-item-active a { color: #2563eb !important; }
      `}} />
    </Modal>
  );
};

export default Edit;