import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* Main body context based on image_8bde20.png */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet /> {/* This is where dynamic pages will render */}
        </main>
      </div>

      <Footer />
    </div>
  );
}