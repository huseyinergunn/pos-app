import { Table, Button, message, Popconfirm, Space, ConfigProvider, theme, Tag, Switch, Tooltip, Result } from "antd";
import { useEffect, useState, useCallback } from "react";
import { PrinterOutlined, CloseCircleOutlined, ReloadOutlined, FileTextOutlined, LockOutlined , CreditCardOutlined, WalletOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import API from "../config/appConfig";
import PrintBill from "../components/bills/PrintBill";

const BillPage = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showCancelled, setShowCancelled] = useState(true);
  const isDark = document.documentElement.classList.contains("dark");

  const user = JSON.parse(sessionStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin" && user?.token;

  const getBills = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const res = await API.get("/bills");
      setBills(res.data);
    } catch (err) {
      message.error("Veriler alınamadı.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    getBills();
  }, [getBills]);

  const handleCancel = async (id) => {
    if (!isAdmin) return message.error("Bu işlem için yetkiniz yok!");
    try {
      await API.patch("/bills/cancel-bill", { billId: id });
      message.warning("Fatura iptal edildi.");
      getBills();
    } catch (err) {
      message.error("İptal işlemi başarısız oldu.");
      console.error(err);
    }
  };

  const filteredBills = showCancelled 
    ? bills 
    : bills.filter(bill => bill.status !== "İptal Edildi");

  const columns = [
    {
      title: "MÜŞTERİ BİLGİSİ",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black shadow-lg uppercase">{text?.charAt(0)}</div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-slate-200 font-black text-[13px] uppercase tracking-tight">{text}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">POS KAYDI</span>
          </div>
        </div>
      ),
    },
    {
      title: "ÖDEME",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
      render: (method) => (
        <div className="flex justify-center">
          {method === "cart" ? (
            <Tag icon={<CreditCardOutlined />} className="rounded-lg px-2.5 py-1 font-black uppercase text-[10px] border-none bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-1">KART</Tag>
          ) : (
            <Tag icon={<WalletOutlined />} className="rounded-lg px-2.5 py-1 font-black uppercase text-[10px] border-none bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">NAKİT</Tag>
          )}
        </div>
      ),
    },
    {
      title: "TOPLAM",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (text) => <span className="font-black text-slate-900 dark:text-white text-md">{Number(text).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}₺</span>,
    },
    {
      title: "DURUM",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isCancelled = status === "İptal Edildi";
        return <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCancelled ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500" : "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"}`}>{status}</div>;
      },
    },
    {
      title: "İŞLEMLER",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Görüntüle / Yazdır">
            <Button type="text" size="large" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl" icon={<PrinterOutlined />} onClick={() => { setSelectedBill(record); setIsPrintModalOpen(true); }} />
          </Tooltip>
          {isAdmin && record.status !== "İptal Edildi" && (
            <Popconfirm title="Faturayı iptal et" description="Bu işlem geri alınamaz." onConfirm={() => handleCancel(record._id)} okText="İptal Et" cancelText="Vazgeç" okButtonProps={{ danger: true }}>
              <Button type="text" size="large" className="text-slate-300 dark:text-slate-600 hover:text-red-500 rounded-xl" icon={<CloseCircleOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

if (!isAdmin) {
  return (
<div className="fixed inset-0 h-screen w-screen flex flex-col items-center justify-start bg-transparent p-4 overflow-hidden pt-0">      
      <div className="mt-24 md:mt-48 w-full flex flex-col items-center">
        <Result
          status="403"
          icon={
            <div className=" flex justify-center scale-75 md:scale-100">
               <LockOutlined className="text-blue-500 text-6xl" />
            </div>
          }
          title={
            <h2 className="text-2xl font-black tracking-tighter dark:text-white uppercase m-0 mt-[-10px]">
              YETKİSİZ ERİŞİM
            </h2>
          }
          subTitle={
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
              Bu panel yalnızca yönetici yetkisine sahip kullanıcılar içindir.
            </p>
          }
          extra={
            <div className="mt-0">
              <Button 
                type="primary" 
                size="large" 
                className="h-12 px-12 rounded-2xl font-bold uppercase tracking-wider border-none bg-blue-600 shadow-xl active:scale-95 transition-transform" 
                onClick={() => navigate("/")}
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          }
          className="!p-0 !m-0"
        />
      </div>
    </div>
  );
}
  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm, token: { colorPrimary: '#2563eb', borderRadius: 20 } }}>
      <div className="p-4 md:p-10 min-h-screen transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-blue-100/20 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <FileTextOutlined className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Fatura Takibi</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{bills.length} KAYIT ANALİZ EDİLDİ</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pl-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 w-full md:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İPTALLER</span>
            <Switch checked={showCancelled} onChange={setShowCancelled} className="bg-slate-200 dark:bg-slate-700" />
            <Button onClick={getBills} icon={<ReloadOutlined />} loading={loading} className="h-10 w-10 flex items-center justify-center rounded-2xl border-none bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
          <Table className="custom-bill-table" columns={columns} dataSource={filteredBills} rowKey="_id" loading={loading} pagination={{ pageSize: 8, className: "px-8 py-6 m-0 flex justify-center md:justify-end" }} scroll={{ x: 800 }} />
        </div>
        {isPrintModalOpen && <PrintBill isModalOpen={isPrintModalOpen} setIsModalOpen={(val) => { setIsPrintModalOpen(val); if(!val) setSelectedBill(null); }} customer={selectedBill} />}
      </div>
    </ConfigProvider>
  );
};

export default BillPage;