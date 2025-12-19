import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "./App"
import Dashboard from "./pages/Dashboard"
import AddStory from "./pages/StoryManagement/AddStory"
import PdfList from "./pages/StoryManagement/PdfList"
import { StoriesLayout } from "./pages/StoryManagement/StoriesLayout"
import PriorityManagement from "./pages/PriorityManagement"
import { ToolsLayout } from "./pages/Tools/ToolsLayout"
import CategoryManagement from "./pages/Tools/CategoryManagement"
import DownloadReport from "./pages/Tools/DownloadReport"
import CreatePoll  from "./pages/StoryManagement/CreatePoll"
import ViewStory from "./pages/StoryManagement/ViewStory"
import ScheduledStory from "./pages/StoryManagement/ScheduledStory"
import LoginPage from "./auth/pages/LoginPage"
import LoginPage2 from "./auth/pages/LoginPage2"


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    children: [
      {
        
      }
    ]
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'stories',
        element: <StoriesLayout />,
        children: [
          { index: true, element: <Navigate to="add" replace /> },
          {
            path: 'add',
            element: <AddStory />
          },
          {
            path: 'view',
            element: <ViewStory />
          },
          {
            path: 'view-schedule',
            element: <ScheduledStory />
          },
          {
            path: 'pdf-list',
            element: <PdfList />
          },
          { 
            path: 'create-poll', 
            element: <CreatePoll onClose={() => {}} /> 
          },
          { 
            path: 'video-list',
            element: <div>Video List</div> 
          },
          {
            path: 'contact-list',
            element: <div>Contact List</div>
          }
        ]
      },
      {
        path: 'priority',
        element: <PriorityManagement />
      },
      {
        path: 'tools',
        element: <ToolsLayout />,
        children: [
          { index: true, element: <Navigate to="category-management" replace /> },
          {
            path: 'category-management',
            element: <CategoryManagement />
          },
          {
            path: 'meta-management',
            element: <div>Meta Management</div>
          },
          {
            path: 'download-report',
            element: <DownloadReport/>
          }
        ]
      },
      {
        path: 'users',
        element: <div>Users</div>,
        children: [
          { index: true, element: <Navigate to="user-access-management" replace /> },
          {
            path: 'user-access-management',
            element: <div>User Access Management</div>
          },
          {
            path: 'admin-user-list',
            element: <div>Admin User List</div>
          },
          {
            path: 'users',
            element: <div>Users</div>
          }
        ]
      }
    ]
  }
])
