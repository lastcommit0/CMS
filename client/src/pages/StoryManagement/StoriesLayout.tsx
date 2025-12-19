import { Outlet } from "react-router-dom";

export const StoriesLayout = () => {
  return (
    <div className="flex w-full">
      <Outlet />
    </div>
  );
};
