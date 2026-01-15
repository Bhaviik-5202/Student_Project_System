import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
