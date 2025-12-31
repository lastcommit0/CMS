import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  return (
    <div className="flex w-full">
      <Outlet />
    </div>
  );
};
