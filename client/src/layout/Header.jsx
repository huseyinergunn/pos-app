import { useEffect, useState, useCallback } from "react";
import { 
  Moon, Sun, LayoutDashboard, ShoppingCart, 
  Package, FileText, BarChart3, Search, LogOut, 
  ShieldCheck, UserCircle, HardDrive
} from "lucide-react";
import { Badge, Popconfirm, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setSearch } from "../redux/slices/productSlice";
import { reset } from "../redux/slices/cartSlice";

const Header = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = JSON.parse(localStorage.getItem("posUser"));

  const getRoleConfig = (role) => {
    const r = role?.toLowerCase();
    switch (r) {
      case 'admin':
        return {
          label: "ADMİN",
          style: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          icon: <ShieldCheck size={12} className="text-emerald-500 md:size-[14px]" />
        };
      case 'staff':
        return {
          label: "PERSONEL",
          style: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: <HardDrive size={12} className="text-emerald-500 md:size-[14px]" />
        };
      default:
        return {
          label: "MÜŞTERİ",
          style: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          icon: <UserCircle size={12} className="text-emerald-500 md:size-[14px]" />
        };
    }
  };

  const controlHeader = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY < 10) {
        setIsVisible(true);
      } else if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', controlHeader);
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

  const handleLogout = () => {
    localStorage.removeItem("posUser");
    dispatch(reset());
    message.success("Başarıyla çıkış yapıldı.");
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Panel" },
    { path: "/cart", icon: ShoppingCart, label: "Sepet", badge: cartItems.length },
    { path: "/products", icon: Package, label: "Ürünler" },
    { path: "/bills", icon: FileText, label: "Faturalar" },
    { path: "/statistics", icon: BarChart3, label: "Analiz" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-500 bg-white/40 dark:bg-slate-900/30 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-lg transform-gpu ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}>
        <div className="max-w-[1400px] mx-auto flex flex-col items-center px-4 py-2 md:py-3 gap-3">
          
          <div className="flex items-center justify-between w-full gap-4 h-10 md:h-12">
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <Link to="/" className="flex items-center gap-3 no-tap group">
                <img
                  src={dark ? "/images/LogoDark.svg" : "/images/Logo.svg"}
                  alt="Logo"
                  className="h-8 md:h-14 w-auto object-contain transition-transform group-hover:scale-105"
                />

                <div className="flex flex-col justify-between h-8 md:h-11 py-0.5">
                  <span className="text-[18px] md:text-[30px] font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                    NexPos
                  </span>
                  <span className="text-[6px] md:text-[10px] font-bold text-blue-500 leading-none tracking-[0.2em] text-center w-full">
                    Point Of Sale
                  </span>
                </div>
              </Link>

              {user && (
                <div className={`flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-2.5 md:py-1 rounded-lg border text-[9px] md:text-[10px] font-black bg-green-500/10 text-green-600 uppercase tracking-widest transition-all ${getRoleConfig(user.role).style}`}>
                   {getRoleConfig(user.role).icon}
                   <span>{getRoleConfig(user.role).label}</span>
                </div>
              )}
            </div>

            <div className="flex-1 max-w-md relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                placeholder="Hızlı ara..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/40 text-sm outline-none border-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                onChange={(e) => dispatch(setSearch(e.target.value.toLowerCase()))}
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDark(!dark)} 
                className="p-2 text-slate-500 bg-white/60 dark:bg-slate-800/40 rounded-lg border border-white/10 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-300"
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              {user && (
                <Popconfirm title="Çıkış yapılsın mı?" onConfirm={handleLogout} okText="Evet" cancelText="Hayır">
                  <button className="p-2 text-red-500 bg-red-50/50 dark:bg-red-900/20 rounded-lg border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300">
                    <LogOut size={15} />
                  </button>
                </Popconfirm>
              )}
            </div>
          </div>

          <div className="w-full md:hidden relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              placeholder="Ürün ara..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/40 text-[12px] outline-none border border-white/10 focus:ring-1 focus:ring-blue-500/30 transition-all"
              onChange={(e) => dispatch(setSearch(e.target.value.toLowerCase()))}
            />
          </div>

          <nav className="flex items-center justify-center w-full py-1 gap-1 md:gap-2 overflow-x-auto no-scrollbar border-t border-black/5 dark:border-white/5 pt-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-2 px-3 md:px-4 h-9 rounded-xl text-[10px] md:text-[11px] font-bold transition-all duration-300 flex-shrink-0 uppercase tracking-tighter ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
                  }`}
                >
                  <Badge count={item.badge} size="small" offset={[3, -3]} color="#ef4444">
                    <Icon size={16} strokeWidth={2.5} />
                  </Badge>
                  <span className={isActive ? "block" : "hidden sm:block"}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="h-[145px] md:h-[135px] w-full shrink-0" />
    </>
  );
};

export default Header;