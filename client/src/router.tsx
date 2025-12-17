import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "./App"
import Dashboard from "./pages/Dashboard"

export const router = createBrowserRouter([
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
        element: <div>Stories</div>,
        children: [
          { index: true, element: <Navigate to="add" replace /> },
          {
            path: 'add',
            element: <div>Add Story</div>
          },
          {
            path: 'view',
            element: <div>View Story</div>
          },
          {
            path: 'view-schedule',
            element: <div>View Schedule Story</div>
          },
          {
            path: 'pdf-list',
            element: <div>PDF List</div>
          },
          { 
            path: 'create-poll', 
            element: <div>Create Poll</div> 
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
        element: <div>Priority</div>
      },
      {
        path: 'tools',
        element: <div>Tools</div>,
        children: [
          { index: true, element: <Navigate to="category-management" replace /> },
          {
            path: 'category-management',
            element: <div>Category Management</div>
          },
          {
            path: 'meta-management',
            element: <div>Meta Management</div>
          },
          {
            path: 'download-report',
            element: <div>Download Report</div>
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
