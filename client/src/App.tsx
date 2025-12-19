import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}