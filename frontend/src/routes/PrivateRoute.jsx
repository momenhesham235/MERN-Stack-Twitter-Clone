import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useGetMe from "../hooks/auth/useGetMe";

const PrivateRoute = ({ children }) => {
  const { data: authUser, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-primary">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!authUser) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
