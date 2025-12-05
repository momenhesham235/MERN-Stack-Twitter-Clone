import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/index.jsx";
import "./styles/index.css";

const App = () => {
  return (
    <main className="flex max-w-6xl mx-auto">
      <AppRoutes />
      <Toaster />
    </main>
  );
};

export default App;
