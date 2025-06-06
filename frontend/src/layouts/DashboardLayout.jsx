import { useState } from "react";
import logo from "../assets/logo-blanco.png";
import { Sidebar } from "../components/Sidebar";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import useAuthStore from "../store/useAuthStore";

export const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { email, role } = useAuthStore((state) => state.user);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="fixed top-0 flex flex-row items-center justify-between bg-[var(--blue)] shadow-2xl h-16 w-full z-90 px-4 text-white">
        <img src={logo} alt="Logo" className="h-[80%]" />
        <div className="flex flex-col items-center lg:items-end justify-center w-fit">
          <div className="flex flex-row gap-2 items-center w-fit">
            <strong>Usuario:</strong>
            <span>{email}</span>
          </div>
          <div className="flex flex-row gap-2 items-center w-fit">
            <strong>Rol:</strong>
            <span>{role}</span>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white p-2 hover:bg-[var(--blue-hover)] rounded-lg transition-colors cursor-pointer "
        >
          {isSidebarOpen ? (
            <XMarkIcon className="size-6" />
          ) : (
            <Bars3Icon className="size-6" />
          )}
        </button>
      </nav>

      {/* Overlay para cerrar el sidebar en móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="lg:ml-[14rem] mt-16 py-6 px-8 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </>
  );
};
