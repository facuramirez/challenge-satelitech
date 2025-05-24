import useAuthStore from "../store/useAuthStore";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="bg-white shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-gray-700">
            Bienvenido,{" "}
            <span className="font-semibold">{user?.name || "Usuario"}</span>
          </span>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
