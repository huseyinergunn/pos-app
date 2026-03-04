import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import API from "../../config/appConfig";

const DashboardCarts = ({ filterType = "daily" }) => {
  const [bills, setBills] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [billRes, productRes] = await Promise.all([
          API.get("/bills"),
          API.get("/products/get-all")
        ]);
        setBills(billRes.data || []);
        setProducts(productRes.data || []);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsData = useMemo(() => {
    const now = new Date(); 
    const filteredBills = bills.filter((bill) => {
      if (!bill.createdAt) return false;
      const billDate = new Date(bill.createdAt);

      if (filterType === "daily") {
        return billDate.toDateString() === now.toDateString();
      } 
      if (filterType === "weekly") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return billDate >= lastWeek && billDate <= now;
      } 
      if (filterType === "monthly") {
        const lastMonth = new Date();
        lastMonth.setDate(now.getDate() - 30);
        return billDate >= lastMonth && billDate <= now;
      }
      return true;
    });

    return { 
      revenue: filteredBills.reduce((acc, bill) => acc + Number(bill.totalAmount || 0), 0), 
      salesCount: filteredBills.length, 
      customers: new Set(filteredBills.map(b => b.customerName || b._id)).size
    };
  }, [bills, filterType]);

  const stats = [
    { 
      title: `${filterType === 'daily' ? 'Günlük' : filterType === 'weekly' ? 'Haftalık' : 'Aylık'} Ciro`, 
      value: `₺${statsData.revenue.toLocaleString("tr-TR")}`, 
      icon: DollarSign, 
      gradient: "from-emerald-500 to-teal-600"
    },
    { 
      title: "Toplam Satış", 
      value: statsData.salesCount, 
      icon: ShoppingCart, 
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      title: "Müşteri", 
      value: statsData.customers, 
      icon: Users, 
      gradient: "from-violet-500 to-purple-600"
    },
    { 
      title: "Ürün Çeşidi", 
      value: products.length, 
      icon: Package, 
      gradient: "from-orange-500 to-amber-600"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {loading 
        ? [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-[2.5rem]" />
          ))
        : stats.map((item, i) => (
            <div 
              key={i} 
              className="group relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 flex justify-between items-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] mb-2">
                  {item.title}
                </p>
                <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 tracking-tighter">
                  {item.value}
                </h2>
              </div>

              <div className={`p-5 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <item.icon size={32} strokeWidth={2.5} />
              </div>
            </div>
          ))
      }
    </div>
  );
};

export default DashboardCarts;