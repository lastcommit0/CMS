import { Outlet } from "react-router-dom";

export const ToolsLayout = () => {
  return (
    <div className="flex w-full">
      <Outlet />
    </div>
  );
};
