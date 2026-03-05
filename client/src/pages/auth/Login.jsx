import { Button, Carousel, Form, App, ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCarousel from "../../components/auth/AuthCarousel";
import { Sun, Moon } from "lucide-react";
import { useDispatch } from "react-redux";
import { reset } from "../../redux/slices/cartSlice"; 

const Login = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch();  
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const userStr = localStorage.getItem("posUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        navigate("/");
      }
    }
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        },
      );
      const user = await res.json();
      if (res.ok) {
        dispatch(reset()); 
        
        localStorage.setItem(
          "posUser",
          JSON.stringify({
            username: user.username,
            email: user.email,
            role: user.role,
            token: user.token,
          }),
        );
        message.success({
          content: "Hoş geldiniz!",
          key: "login-success",
          style: { marginTop: '8vh' }
        });
        navigate("/");
      } else {
        throw new Error(user.message || "Giriş başarısız!");
      }
    } catch (error) {
      message.error({
        content: error.message || "E-posta veya şifre hatalı.",
        key: "login-error",
        style: { marginTop: '8vh' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = () => {
    dispatch(reset()); 
    
    localStorage.removeItem("posUser");
    const guestUser = {
      username: "Misafir",
      role: "guest",
      email: "guest@nexpos.com",
    };
    localStorage.setItem("posUser", JSON.stringify(guestUser));
    message.info({
      content: "Misafir olarak giriş yapıldı.",
      key: "guest-login",
      style: { marginTop: '8vh' }
    });
    navigate("/");
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none ring-0 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all backdrop-blur-sm";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { borderRadius: 16, colorPrimary: "#2563eb" },
      }}
    >
      <div className="h-screen w-full bg-fixed bg-gradient-to-br from-slate-50 via-blue-100 to-purple-100 dark:from-slate-950 dark:via-blue-900 dark:to-purple-900 transition-all duration-700 overflow-hidden relative">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 z-50 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl border border-white dark:border-slate-700 text-blue-600 dark:text-yellow-400 hover:scale-110 transition-transform"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <div className="flex h-full relative z-10">
          <div className="xl:w-2/5 w-full flex flex-col justify-center px-10 xl:px-24">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-[40px] p-10 rounded-[3rem] border border-white/60 dark:border-slate-800/50 shadow-2xl">
              <div className="text-center mb-10">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={isDark ? "/images/LogoDark.svg" : "/images/Logo.svg"}
                    className="h-14 mb-2"
                    alt="Logo"
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                      NexPos
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 dark:text-gray-400 mt-1">
                      Point of Sale
                    </span>
                  </div>
                </div>
              </div>

              <Form
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  label={
                    <span className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">
                      E-mail
                    </span>
                  }
                >
                  <input
                    type="email"
                    placeholder="ornek@email.com"
                    className={inputClass}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={
                    <span className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-widest">
                      Şifre
                    </span>
                  }
                >
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 border-none rounded-2xl text-base font-black shadow-lg shadow-blue-500/30 mt-4 active:scale-95 transition-transform"
                >
                  GİRİŞ YAP
                </Button>
              </Form>

              <button
                type="button"
                onClick={handleGuestEntry}
                className="w-[80%] sm:w-[350px] mx-auto mt-6 py-3 px-6 flex items-center justify-center gap-2 text-[10px] sm:text-[13px] font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all uppercase tracking-[0.15em] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 shadow-sm hover:shadow-md active:scale-95"
              >
                MİSAFİR OLARAK DEVAM ET
              </button>

              <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tight">
                Hesabın yok mu?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-black hover:underline ml-1"
                >
                  KAYIT OL
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center p-12 border-l border-white/30 dark:border-slate-800/30">
            <div className="z-10 w-full max-w-xl bg-white/10 dark:bg-transparent backdrop-blur-[2px] p-8 rounded-[3rem]">
              <Carousel autoplay effect="fade" dots={true}>
                <div key="1">
                  <AuthCarousel
                    img="/images/responsive.svg"
                    title={
                      <span className="font-black text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 dark:from-blue-200 dark:via-indigo-100 dark:to-purple-100">
                        İşletmeniz Sizinle Hareket Etsin
                      </span>
                    }
                    desc={
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-lg italic mt-2 block">
                        Mekana bağlı kalmadan, dilediğiniz cihazdan işletmenizi
                        her an kontrol edin.
                      </span>
                    }
                  />
                </div>
                <div key="2">
                  <AuthCarousel
                    img="/images/statistic.svg"
                    title={
                      <span className="font-black text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 dark:from-blue-200 dark:via-indigo-100 dark:to-purple-100">
                        Veriye Dayalı Adımlar Atın
                      </span>
                    }
                    desc={
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-lg italic mt-2 block">
                        Satış trendlerini anlaşılır grafiklerle izleyerek yarını
                        gerçek rakamlarla planlayın.
                      </span>
                    }
                  />
                </div>
                <div key="3">
                  <AuthCarousel
                    img="/images/admin.svg"
                    title={
                      <span className="font-black text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 dark:from-blue-200 dark:via-indigo-100 dark:to-purple-100">
                        Güven Veren Altyapı
                      </span>
                    }
                    desc={
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-lg italic mt-2 block">
                        Bulut tabanlı yedekleme ile verileriniz her saniye
                        koruma altında kalsın.
                      </span>
                    }
                  />
                </div>
                <div key="4">
                  <AuthCarousel
                    img="/images/customer.svg"
                    title={
                      <span className="font-black text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 dark:from-blue-200 dark:via-indigo-100 dark:to-purple-100">
                        Her Şey Tek Bir Ekranda
                      </span>
                    }
                    desc={
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-lg italic mt-2 block">
                        Envanterden ciro takibine kadar tüm operasyonu tek
                        panelden yönetin.
                      </span>
                    }
                  />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        input:-webkit-autofill { -webkit-text-fill-color: ${isDark ? "white" : "black"}; -webkit-box-shadow: 0 0 0px 1000px ${isDark ? "#0f172a" : "white"} inset; }
        .ant-carousel .slick-dots li button { background: ${isDark ? "#475569" : "#94a3b8"} !important; height: 6px !important; border-radius: 10px !important; }
        .ant-carousel .slick-dots li.slick-active button { background: #2563eb !important; width: 24px !important; }
      `,
        }}
      />
    </ConfigProvider>
  );
};

export default Login;