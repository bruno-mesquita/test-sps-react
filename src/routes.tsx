import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { queryClient } from "./lib/queryClient";
import { userKeys, fetchUser } from "./queries/users";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Users from "./pages/Users";
import UserCreate from "./pages/UserCreate";
import UserEdit from "./pages/UserEdit";
import AttachmentViewer from "./pages/AttachmentViewer";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

async function userEditLoader({ params }: { params: Record<string, string | undefined> }) {
  const id = Number(params.userId);
  await queryClient.prefetchQuery({ queryKey: userKeys.detail(id), queryFn: () => fetchUser(id) });
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/new",
    element: (
      <ProtectedRoute>
        <UserCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/:userId",
    element: (
      <ProtectedRoute>
        <UserEdit />
      </ProtectedRoute>
    ),
    loader: userEditLoader,
  },
  {
    path: "/users/:userId/attachments/:attachmentId",
    element: (
      <ProtectedRoute>
        <AttachmentViewer />
      </ProtectedRoute>
    ),
  },
]);

export default router;
