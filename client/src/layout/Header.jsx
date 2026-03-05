import { useEffect, useState, useCallback } from "react";
import { 
  Moon, Sun, LayoutDashboard, ShoppingCart, 
  Package, FileText, BarChart3, Search, LogOut, 
  ShieldCheck, UserCircle, HardDrive, LogIn
} from "lucide-react";
import { App, Badge, Popconfirm, Drawer } from "antd"; 
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setSearch } from "../redux/slices/productSlice";
import { reset } from "../redux/slices/cartSlice";
import CartTotals from "../features/cart/CartTotals";

const Header = ({ isVisible: propIsVisible }) => {
  const { message } = App.useApp(); 
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [internalVisible, setInternalVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isVisible = propIsVisible !== undefined ? propIsVisible : internalVisible;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userStr = sessionStorage.getItem("posUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isHomePage = location.pathname === "/";
  const [isTemporaryShow, setIsTemporaryShow] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const isPrivilegedUser = user && (user.role === "admin" || user.role === "staff");

  const getRoleConfig = (role) => {
    const r = role?.toLowerCase();
    switch (r) {
      case 'admin': return { label: "ADMİN", style: "bg-green-500/10 text-green-600 border-green-500/20", icon: <ShieldCheck size={12} className="text-emerald-500 md:size-[14px]" /> };
      case 'staff': return { label: "PERSONEL", style: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: <HardDrive size={12} className="text-blue-500 md:size-[14px]" /> };
      default: return { label: "MÜŞTERİ", style: "bg-slate-500/10 text-slate-600 border-slate-500/20", icon: <UserCircle size={12} className="text-emerald-500 md:size-[14px]" /> };
    }
  };

  const controlHeader = useCallback(() => {
    if (propIsVisible !== undefined) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY < 10) setInternalVisible(true);
    else if (currentScrollY > lastScrollY) setInternalVisible(false);
    else setInternalVisible(true);
    setLastScrollY(currentScrollY);
  }, [lastScrollY, propIsVisible]);

  useEffect(() => {
    window.addEventListener('scroll', controlHeader, { passive: true });
    return () => window.removeEventListener('scroll', controlHeader);
  }, [controlHeader]);

  useEffect(() => {
    if (dark) { 
      document.documentElement.classList.add("dark"); 
      localStorage.setItem("theme", "dark"); 
    } else { 
      document.documentElement.classList.remove("dark"); 
      localStorage.setItem("theme", "light"); 
    }
  }, [dark]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const showTimer = setTimeout(() => {
        setIsTemporaryShow(true);
        setIsBouncing(true);
      }, 0);

      const hideTimer = setTimeout(() => {
        setIsTemporaryShow(false);
        setIsBouncing(false);
      }, 2000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [cartItems.length]);

  const handleLogout = () => {
    sessionStorage.removeItem("posUser");
    dispatch(reset()); 
    message.success({ content: "Başarıyla çıkış yapıldı.", duration: 1 });
    window.dispatchEvent(new Event("storage")); 
    navigate("/login", { replace: true });
  };

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Panel" },
    { path: "/cart", icon: ShoppingCart, label: "Sepetim" },
    { path: "/products", icon: Package, label: "Ürünler" },
    { path: "/bills", icon: FileText, label: "Faturalar" },
    { path: "/statistics", icon: BarChart3, label: "Analiz" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[1000] transition-transform duration-500 ease-in-out bg-white/40 dark:bg-slate-900/30 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-lg transform-gpu ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-[1400px] mx-auto flex flex-col items-center px-4 py-2 md:py-3 gap-3">
          <div className="flex items-center justify-between w-full gap-4 h-10 md:h-12">
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <Link to="/" className="flex items-center gap-3 no-tap group">
                <img src={dark ? "/images/LogoDark.svg" : "/images/Logo.svg"} alt="Logo" className="h-8 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
                <div className="flex flex-col justify-between h-8 md:h-11 py-0.5">
                  <span className="text-[18px] md:text-[30px] font-black text-slate-900 dark:text-white leading-none tracking-tighter">NexPos</span>
                  <span className="text-[6px] md:text-[10px] font-bold text-blue-500 leading-none tracking-[0.2em] text-center w-full uppercase">Point Of Sale</span>
                </div>
              </Link>
              {user && (
                <div className={`flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-2.5 md:py-1 rounded-lg border text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${getRoleConfig(user.role).style}`}>
                   {getRoleConfig(user.role).icon}
                   <span>{getRoleConfig(user.role).label}</span>
                </div>
              )}
            </div>

            <div className={`flex-1 max-w-md relative hidden md:block ${!isHomePage && "invisible"}`}>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input type="text" placeholder="Hızlı ara..." className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 text-sm outline-none border-none focus:ring-1 focus:ring-blue-500/50 transition-all text-slate-900 dark:text-white" onChange={(e) => dispatch(setSearch(e.target.value.toLowerCase()))} />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setDark(!dark);
                  message.info({
                    content: `Görünüm modu ${!dark ? 'Gece' : 'Gündüz'} olarak değiştirildi.`,
                    key: 'theme_change', 
                    duration: 1.5
                  });
                }} 
                className="p-2 text-slate-500 bg-white/60 dark:bg-slate-800/40 rounded-lg border border-white/10 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-300"
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {isPrivilegedUser ? (
                <Popconfirm 
                  title="Çıkış yapılsın mı?" 
                  description="Mevcut oturumunuz sonlandırılacaktır."
                  onConfirm={handleLogout} 
                  okText="Evet" 
                  cancelText="Hayır" 
                  centered
                >
                  <button type="button" className="p-2 text-red-500 bg-red-50/50 dark:bg-red-900/20 rounded-lg border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300">
                    <LogOut size={15} />
                  </button>
                </Popconfirm>
              ) : (
                <button 
                  onClick={() => navigate("/login")}
                  className="p-2 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-500/10 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <LogIn size={15} />
                  <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">GİRİŞ YAP</span>
                </button>
              )}
            </div>
          </div>
          <nav className="hidden md:flex items-center justify-center w-full py-1 gap-1 md:gap-2 overflow-x-auto no-scrollbar border-t border-black/5 dark:border-white/5 pt-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className={`flex items-center gap-2 px-3 md:px-4 h-9 rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 flex-shrink-0 uppercase tracking-tighter ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105" : "text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"}`}>
                  {item.path === "/cart" ? (
                    <Badge count={cartItems.length} size="small" offset={[5, -5]} color="#ef4444">
                      <Icon size={16} strokeWidth={2.5} className={isActive ? "text-white" : "text-slate-500"} />
                    </Badge>
                  ) : (
                    <Icon size={16} strokeWidth={2.5} />
                  )}
                  <span className={isActive ? "block" : "hidden sm:block"}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-[1001] bg-white/90 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 px-6 py-2 pb-2 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${
        isTemporaryShow 
          ? "translate-y-0" 
          : (isVisible ? "translate-y-0" : "translate-y-[110%]")
      }`}>
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === "/" ? "text-blue-600" : "text-slate-400"}`}>
          <LayoutDashboard size={20} /><span className="text-[9px] font-black uppercase">Panel</span>
        </Link>
        <Link to="/products" className={`flex flex-col items-center gap-1 ${location.pathname === "/products" ? "text-blue-600" : "text-slate-400"}`}>
          <Package size={20} /><span className="text-[9px] font-black uppercase tracking-tighter">Ürünler</span>
        </Link>
        <div className={`relative -mt-10 flex items-center justify-center transition-transform duration-300 ${isBouncing ? "scale-110" : "scale-100"}`}> 
          <Badge count={cartItems.length} color="#ef4444" offset={[-2, 2]}>
            <button type="button" onClick={() => setIsCartOpen(true)} className={`w-14 h-14 bg-blue-600 text-white rounded-[1.8rem] shadow-2xl flex flex-col items-center justify-center border-4 border-white dark:border-slate-950 active:scale-90 transition-all ${isBouncing ? "animate-bounce" : ""}`}>
              <ShoppingCart size={22} color="white" /><span className="text-[8px] font-black mt-0.5">{total.toLocaleString("tr-TR")}₺</span>
            </button>
          </Badge>
        </div>
        <Link to="/bills" className={`flex flex-col items-center gap-1 ${location.pathname === "/bills" ? "text-blue-600" : "text-slate-400"}`}>
          <FileText size={20} /><span className="text-[9px] font-black uppercase">Fatura</span>
        </Link>
        <Link to="/statistics" className={`flex flex-col items-center gap-1 ${location.pathname === "/statistics" ? "text-blue-600" : "text-slate-400"}`}>
          <BarChart3 size={20} /><span className="text-[9px] font-black uppercase">Analiz</span>
        </Link>
      </div>

      <Drawer title={null} closable={false} onClose={() => setIsCartOpen(false)} open={isCartOpen} placement="bottom" height="85%" styles={{ body: { padding: 0 }, wrapper: { borderRadius: "2.5rem 2.5rem 0 0" } }}>
        <CartTotals onClose={() => setIsCartOpen(false)} />
      </Drawer>
      <div className="h-[90px] md:h-[135px] w-full shrink-0" />
    </>
  );
};

export default Header;