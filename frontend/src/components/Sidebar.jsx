import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PaperAirplaneIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export const Sidebar = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const links = [
    {
      name: "Viajes",
      href: "/viajes",
      Icon: PaperAirplaneIcon,
    },
    // Solo mostrar el enlace de usuarios si el usuario es admin
    ...(user?.role === "admin"
      ? [
          {
            name: "Usuarios",
            href: "/usuarios",
            Icon: UserCircleIcon,
          },
        ]
      : []),
    {
      name: "Estadísticas",
      href: "/estadisticas",
      Icon: ChartBarIcon,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-[14rem] bg-[var(--blue-hover)] shadow-lg text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 z-80 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-2 w-full mx-auto text-base h-full [&>a]:pl-4 pt-8 pb-2">
        {links.map(({ name, href, Icon }) => (
          <Link
            key={href}
            to={href}
            onClick={() => {
              if (window.innerWidth < 1024) {
                onClose();
              }
            }}
            className={`flex items-center gap-2 mx-4 py-2 rounded-lg pl-4 transition-colors ${
              pathname === href
                ? "bg-white text-black hover:bg-white hover:text-black"
                : "hover:bg-[var(--blue-hover)]"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{name}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mx-4 py-2 cursor-pointer rounded-lg pl-4 transition-colors mt-auto mb-2 hover:bg-[var(--blue-hover)]"
        >
          <PowerIcon className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
