import { Outlet } from "react-router-dom";

export const StoriesLayout = () => {
  return (
    <div className="flex w-full">
      <main className="flex-1 ml-96 ">
      <Outlet />
      </main>
    </div>
  );
};
