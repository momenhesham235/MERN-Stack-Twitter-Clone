import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/auth/signup/SignUpPage.jsx";
import LoginPage from "../pages/auth/login/LoginPage.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import Notification from "../pages/notification/NotificationPage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import NotFound from "../pages/NotFound/NotFoundPage.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import RightPanel from "../components/common/RightPanel.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import useGetMe from "../hooks/auth/useGetMe.js";

const AppRoutes = () => {
  const { data: authUser } = useGetMe();
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUpPage />}
        />

        {/* Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Sidebar />
              <HomePage />
              <RightPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Sidebar />
              <Notification />
              <RightPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <Sidebar />
              <ProfilePage />
              <RightPanel />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <PrivateRoute>
              <NotFound />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
