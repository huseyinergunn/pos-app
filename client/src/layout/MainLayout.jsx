import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Header from "./Header";

const MainLayout = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-fixed bg-gradient-to-br from-slate-50 via-blue-100 to-purple-100 dark:from-slate-950 dark:via-blue-900 dark:to-purple-900 transition-all duration-700">
      <Header isVisible={isVisible} />
      <main className="w-full px-4 md:px-8 lg:px-12 pt-0 md:pt-0 pb-24">
        <div className="animate-in fade-in zoom-in-95 duration-700 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;