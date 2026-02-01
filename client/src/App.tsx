import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthBootstrap } from "@/auth/useAuthBootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { accessTokenStore } from "./lib/api/tokenManager";


export default function App() {
    const navigate = useNavigate();

  useAuthBootstrap();
  useEffect(() => {
    const handler = () => {
      accessTokenStore.clear();
      navigate('/auth', { replace: true });
    };

    window.addEventListener("auth-expired", handler);
    return () => window.removeEventListener("auth-expired", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Outlet />
    </div>
  );
}