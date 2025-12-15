import LoginPage2 from "./auth/pages/LoginPage2"
import LoginPage from "./auth/pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import Sidebar from "./components/Sidebar"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Layout from './components/Layout';
// import ProtectedRoute from './components/ProtectedRoute';
// import StoryManagement from './pages/StoryManagement';
// import UserManagement from './pages/UserManagement';
// import CategoryManagement from './pages/CategoryManagement';
// import MetaManagement from './pages/MetaManagement';
// import PriorityManagement from './pages/PriorityManagement';
// import DownloadReportPage from './pages/DownloadReportPage';
// import Tools from './pages/Tools';
import AddStory from "./pages/StoryManagement/AddStory";

function App() {
  return (
    <AddStory></AddStory>
    // <BrowserRouter>
    //   <Routes>
    //     {/* Public Routes */}
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/login2" element={<LoginPage2 />} />
        
    //     {/* Protected Routes */}
    //     <Route
    //       path="/"
    //       element={
    //         <ProtectedRoute>
    //           <Layout />
    //         </ProtectedRoute>
    //       }
    //     >
    //       <Route index element={<Navigate to="/dashboard" replace />} />
    //       <Route path="dashboard" element={<Dashboard />} />
    //       <Route path="stories" element={<StoryManagement />} />
    //       <Route path="categories" element={<CategoryManagement />} />
    //       <Route path="meta" element={<MetaManagement />} />
    //       <Route path="priorities" element={<PriorityManagement />} />
    //       <Route path="users" element={<UserManagement />} />
    //       <Route path="download-report" element={<DownloadReportPage />} />
    //       <Route path="tools" element={<Tools />} />
    //     </Route>
        
    //     {/* Catch all - redirect to dashboard */}
    //     <Route path="*" element={<Navigate to="/dashboard" replace />} />
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;