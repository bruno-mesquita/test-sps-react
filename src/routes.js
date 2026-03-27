import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Users from "./pages/Users";
import UserEdit, { userLoader, newUserLoader } from "./pages/UserEdit";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return children;
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
        <UserEdit />
      </ProtectedRoute>
    ),
    loader: newUserLoader,
  },
  {
    path: "/users/:userId",
    element: (
      <ProtectedRoute>
        <UserEdit />
      </ProtectedRoute>
    ),
    loader: userLoader,
  },
]);

export default router;
