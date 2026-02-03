import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthBootstrap } from "@/auth/useAuthBootstrap";


export default function App() {
  useAuthBootstrap();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Outlet />
    </div>
  );
}