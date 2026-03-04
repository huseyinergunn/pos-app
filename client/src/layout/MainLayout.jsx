import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
   <div className="min-h-screen w-full bg-fixed bg-gradient-to-br from-slate-50 via-blue-100 to-purple-100 dark:from-slate-950 dark:via-blue-900 dark:to-purple-900 transition-all duration-700">
      
      <Header />
      
      <main className="flex-grow w-full px-4 md:px-8 lg:px-12 py-6">
        <div className="animate-in fade-in zoom-in-95 duration-700 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;