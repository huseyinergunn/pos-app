import { useEffect, useState, useCallback, useMemo } from "react";
import { Column, Pie, Line } from "@ant-design/plots";
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react"; 
import { Card, ConfigProvider, theme, message, Skeleton, Button, Result } from "antd";
import {LockOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import API from "../config/appConfig";

const StatisticPage = () => {
  const navigate = useNavigate();
  const [allBills, setAllBills] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const isDark = document.documentElement.classList.contains("dark");

  const user = JSON.parse(localStorage.getItem("posUser"));
  const isAdmin = user?.role === "admin" && user?.token;

  const fetchData = useCallback(async () => {
    if (!isAdmin) return; 
    try {
      setLoading(true);
      const [productRes, billRes] = await Promise.all([
        API.get("/products/get-all"),
        API.get("/bills")
      ]);
      setProducts(productRes.data || []);
      setAllBills(billRes.data || []);
    } catch (err) {
      message.error("Veriler analiz edilirken bir hata oluştu.");
      console.error("API HATASI:", err);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [isAdmin]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const filteredBills = useMemo(() => {
    const now = new Date();
    if (filterType === "1day") {
      const today = new Date(now.setHours(0, 0, 0, 0));
      return allBills.filter(b => new Date(b.createdAt) >= today);
    } 
    if (filterType === "1week") {
      const lastWeek = new Date(now.setDate(now.getDate() - 7));
      return allBills.filter(b => new Date(b.createdAt) >= lastWeek);
    }
    return allBills;
  }, [filterType, allBills]);

  const stats = useMemo(() => {
    const totalRevenue = filteredBills.reduce((acc, b) => acc + Number(b.totalAmount || 0), 0);
    const totalItemsSold = filteredBills.reduce((acc, b) => acc + (b.cartItems || []).reduce((s, i) => s + i.quantity, 0), 0);
    
    const dailyData = Object.values(
      filteredBills.reduce((acc, bill) => {
        const date = new Date(bill.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
        if (!acc[date]) acc[date] = { tarih: date, tutar: 0, rawDate: new Date(bill.createdAt) };
        acc[date].tutar += Number(bill.totalAmount || 0);
        return acc;
      }, {})
    ).sort((a, b) => a.rawDate - b.rawDate);

    const productMap = {};
    filteredBills.forEach(b => {
      (b.cartItems || []).forEach(i => {
        productMap[i.title] = (productMap[i.title] || 0) + i.quantity;
      });
    });

    const bestSelling = Object.keys(productMap)
      .map(name => ({ name, quantity: productMap[name] }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return { totalRevenue, totalItemsSold, dailyData, bestSelling, productMap };
  }, [filteredBills]);
if (!isAdmin) {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-start bg-transparent p-4 overflow-hidden pt-0">
      
      <div className="mt-0 w-full flex flex-col items-center">
        <Result
          status="403"
          icon={
            <div className="flex justify-center scale-75 md:scale-100">
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
  const commonTheme = isDark ? 'dark' : 'light';

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <div className="p-4 md:p-10 min-h-screen transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-blue-100/20 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <TrendingUp className="text-blue-600 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Analiz Paneli</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Yönetici Erişimi • Canlı Veri</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-2 sm:p-2 sm:pl-6 rounded-[2.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 w-full md:w-auto transition-all">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] shrink-0 mt-1 sm:mt-0">Zaman Aralığı</span>
            <div className="flex bg-slate-100/50 dark:bg-slate-950/50 p-1 rounded-[1.4rem] sm:rounded-2xl border border-slate-200/50 dark:border-slate-800/50 relative w-full sm:w-auto">
              {[{ label: "GÜN", value: "1day" }, { label: "HAFTA", value: "1week" }, { label: "TÜMÜ", value: "all" }].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterType(item.value)}
                  className={`relative z-10 flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest transition-all duration-300 ${filterType === item.value ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/5 scale-[1.02]" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-transparent"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard loading={loading} title="Toplam Ciro" value={`${stats.totalRevenue.toLocaleString("tr-TR")}₺`} icon={<DollarSign size={24}/>} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-500/10" />
          <StatCard loading={loading} title="Sipariş Sayısı" value={filteredBills.length} icon={<ShoppingCart size={24}/>} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" />
          <StatCard loading={loading} title="Ürün Çeşidi" value={products.length} icon={<Package size={24}/>} color="text-violet-500" bg="bg-violet-50 dark:bg-violet-500/10" />
          <StatCard loading={loading} title="Satılan Adet" value={stats.totalItemsSold} icon={<TrendingUp size={24}/>} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-500/10" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ChartWrapper title="Gelir Akışı" loading={loading}>
            <Line data={stats.dailyData} xField="tarih" yField="tutar" theme={commonTheme} height={350} smooth point={{ size: 5 }} color="#2563eb" />
          </ChartWrapper>
          <ChartWrapper title="En Çok Satanlar" loading={loading}>
            <Column data={stats.bestSelling} xField="name" yField="quantity" theme={commonTheme} height={350} color="#8b5cf6" columnStyle={{ radius: [12, 12, 0, 0] }} />
          </ChartWrapper>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <ChartWrapper title="Ödeme Kanalları" loading={loading}>
            <Pie data={[{ type: 'Kart', value: filteredBills.filter(b => b.paymentMethod === 'cart').length }, { type: 'Nakit', value: filteredBills.filter(b => b.paymentMethod === 'cash').length }]} angleField="value" colorField="type" theme={commonTheme} height={300} color={['#3b82f6', '#10b981']} />
          </ChartWrapper>
          <ChartWrapper title="Kategori Dağılımı" loading={loading}>
            <Pie data={Object.keys(stats.productMap).map(k => ({ type: k, value: stats.productMap[k] }))} angleField="value" colorField="type" theme={commonTheme} height={300} />
          </ChartWrapper>
        </div>
      </div>
    </ConfigProvider>
  );
};

const StatCard = ({ title, value, icon, color, bg, loading }) => (
  <Card className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-none overflow-hidden transition-all">
    {loading ? <Skeleton active paragraph={{ rows: 1 }} title={{ width: '40%' }} /> : (
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner`}>{icon}</div>
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{title}</p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{value}</h2>
        </div>
      </div>
    )}
  </Card>
);

const ChartWrapper = ({ title, children, loading }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-none transition-all">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h3>
    </div>
    {loading ? <Skeleton.Button active style={{ width: '100%', height: 350, borderRadius: '20px' }} /> : children}
  </div>
);

export default StatisticPage;