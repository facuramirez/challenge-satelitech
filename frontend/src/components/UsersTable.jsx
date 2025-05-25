import React, { useEffect, useState } from "react";
import useUserStore from "../store/useUserStore";
import UserTableSkeleton from "./UserTableSkeleton";
import UserModal from "./UserModal";
import ConfirmationModal from "./ConfirmationModal";
import { toast } from "react-toastify";
import { formatDateToDatetimeLocal } from "../utils/formatDatePicker";
import useAuthStore from "../store/useAuthStore";

const SortArrow = ({ direction }) => {
  if (!direction) return null;

  return direction === "asc" ? (
    <svg
      className="w-4 h-4 ml-1 inline-block absolute top-0 right-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 ml-1 inline-block absolute top-0 right-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

const SortableHeader = ({ label, field, sortConfig, onSort }) => {
  return (
    <th
      className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="relative">
        {label}
        <SortArrow
          direction={sortConfig.key === field ? sortConfig.direction : null}
        />
      </div>
    </th>
  );
};

export const UsersTable = () => {
  const {
    allUsers,
    users,
    loading,
    error,
    fetchUsers,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    sortUsers,
    sortConfig,
    deleteUser,
  } = useUserStore();

  const currentUser = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await fetchUsers();
      } catch (err) {
        toast.error(
          "Error al cargar los usuarios. Por favor, intente nuevamente.",
          {
            position: "bottom-center",
            autoClose: 5000,
          }
        );
      }
    };

    loadUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (user) => {
    if (user.email === currentUser.email) {
      toast.error("No puedes eliminar tu propio usuario", {
        position: "bottom-center",
      });
      return;
    }

    if (user.role === "admin") {
      const adminCount = users.filter((u) => u.role === "admin").length;
      if (adminCount === 1) {
        toast.error("No puedes eliminar el último usuario administrador", {
          position: "bottom-center",
        });
        return;
      }
    }

    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete._id);
      await fetchUsers();
      toast.success("Usuario eliminado correctamente", {
        position: "bottom-center",
      });
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al eliminar el usuario",
        {
          position: "bottom-center",
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <UserTableSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 shadow shadow-sm">
      <div className="flex flex-row justify-between items-center gap-2">
        <span className="text-lg font-bold text-gray-700">
          Usuarios ({allUsers.length})
        </span>
        <button
          onClick={() => handleOpenModal()}
          className="px-3 py-1 text-base text-white bg-[var(--orange)] hover:bg-[var(--orange)] rounded-md transition-colors cursor-pointer"
        >
          Nuevo usuario
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-max table table-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap min-w-fit">
                #
              </th>
              <SortableHeader
                label="Email"
                field="email"
                sortConfig={sortConfig}
                onSort={sortUsers}
              />
              <SortableHeader
                label="Rol"
                field="role"
                sortConfig={sortConfig}
                onSort={sortUsers}
              />
              <SortableHeader
                label="Creado"
                field="createdAt"
                sortConfig={sortConfig}
                onSort={sortUsers}
              />
              <SortableHeader
                label="Actualizado"
                field="updatedAt"
                sortConfig={sortConfig}
                onSort={sortUsers}
              />
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role === "admin" ? "Administrador" : "Usuario"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(user)}
                      className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrar</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">registros</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {"<"}
          </button>

          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages || 1}
          </span>

          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {">"}
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* Modal de usuario (nuevo/editar) */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={`¿Está seguro que desea eliminar el usuario ${
          userToDelete?.email || ""
        }?`}
        loading={isDeleting}
      />
    </div>
  );
};
