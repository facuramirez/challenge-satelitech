import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
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

const links = [
  {
    name: "Viajes",
    href: "/viajes",
    Icon: PaperAirplaneIcon,
  },
  // {
  //   name: "Usuarios",
  //   href: "/usuarios",
  //   Icon: UserCircleIcon,
  //   tailwindClasses: "",
  // },
  {
    name: "Estadísticas",
    href: "/estadisticas",
    Icon: ChartBarIcon,
    tailwindClasses: "",
  },
  {
    name: "Cerrar sesión",
    href: "/logout",
    Icon: PowerIcon,
    tailwindClasses: "mt-auto",
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-[14rem] bg-[var(--blue-hover)] shadow-lg text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 z-80 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-2 w-full mx-auto text-base h-full [&>a]:pl-4 pt-8 pb-2">
        {links.map(({ name, href, Icon, tailwindClasses }) => (
          <Link
            key={href}
            to={href === "/logout" ? pathname : href}
            onClick={(e) => {
              if (href === "/logout") {
                logout();
                navigate("/");
              }
              if (window.innerWidth < 1024) {
                // lg breakpoint
                onClose();
              }
            }}
            className={`flex items-center gap-2 mx-4 py-2 rounded-lg pl-4 transition-colors ${tailwindClasses} ${
              pathname === href
                ? "bg-white text-black hover:bg-white hover:text-black"
                : "hover:bg-[var(--blue-hover)]"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
