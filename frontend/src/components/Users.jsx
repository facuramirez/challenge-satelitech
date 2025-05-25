import { Title } from "./Title";
import { UsersTable } from "./UsersTable";

export const Users = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Title title="Usuarios" />
      <UsersTable />
    </div>
  );
};
