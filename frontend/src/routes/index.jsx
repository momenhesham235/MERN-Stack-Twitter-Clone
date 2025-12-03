import { Routes, Route } from "react-router-dom";
import SignUpPage from "../pages/auth/signup/SignUpPage.jsx";
import LoginPage from "../pages/auth/login/LoginPage.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import Notification from "../pages/notification/NotificationPage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import NotFound from "../pages/NotFound/NotFoundPage.jsx";
import Sidebar from "../components/common/Sidebar.jsx";
import RightPanel from "../components/common/RightPanel.jsx";

const AppRoutes = () => {
  return (
    <>
      {/* Left Sidebar */}
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RightPanel />
    </>
  );
};

export default AppRoutes;
