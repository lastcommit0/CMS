import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "./App"
import Dashboard from "./pages/Dashboard"
import AddStory from "./pages/StoryManagement/AddStory"
import { PdfList } from "./pages/StoryManagement/PdfList"
import { StoriesLayout } from "./pages/StoryManagement/StoriesLayout"
import PriorityManagement from "./pages/PriorityManagement"
import { ToolsLayout } from "./pages/Tools/ToolsLayout"
import CategoryManagement from "./pages/Tools/CategoryManagement"
import DownloadReport from "./pages/Tools/DownloadReport"
import NewsStoryAgent from "./pages/Tools/NewsStoryAgent"
import CreatePoll from "./pages/StoryManagement/CreatePoll"
import ViewStory from "./pages/StoryManagement/ViewStory"
import ScheduledStory from "./pages/StoryManagement/ScheduledStory"
import LoginPage from "./auth/pages/LoginPage"
import LoginPage2 from "./auth/pages/LoginPage2"
import { UserLayout } from "./pages/UserManagement/UserLayout"
import UserAccessManagement from "./pages/UserManagement/UserAccessManagement"
import AdminUserList from "./pages/UserManagement/AdminUserList"
import Users from "./pages/UserManagement/Users"
import LoginLayout from "./auth/pages/LoginLayout"
import { VideoList } from "./pages/StoryManagement/VideoList"
import { ContactList } from "./pages/StoryManagement/ContactList"
import ProtectedRoute from "./auth/ProtectedRoute"
import OAuthCallback from "./auth/OauthCallback"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="auth" replace />,
      },
      {
        path: 'auth',
        element: <LoginPage />
      },
      {
        path: 'login',
        element: <LoginPage2 />
      },
      { path: "auth/callback", element: <OAuthCallback /> }

    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/user',
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
                element: <CreatePoll />
              },
              {
                path: 'video-list',
                element: <VideoList />
              },
              {
                path: 'contact-list',
                element: <ContactList />
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
                element: <DownloadReport />
              },
              {
                path: 'news-story-agent',
                element: <NewsStoryAgent />
              }
            ]
          },
          {
            path: 'users',
            element: <UserLayout />,
            children: [
              { index: true, element: <Navigate to="user-access-management" replace /> },
              {
                path: 'user-access-management',
                element: <UserAccessManagement />
              },
              {
                path: 'admin-user-list',
                element: <AdminUserList />
              },
              {
                path: 'users',
                element: <Users />
              }
            ]
          }
        ]
      }
    ]
  }
])
