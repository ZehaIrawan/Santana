import { Route, Routes } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
import { DashboardPage } from "./DashboardPage";
import { LoginPage } from "./LoginPage";

function App() {
  return (
    // <AuthProvider>
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/dashboard" element={<DashboardPage />} />
    </Routes>
    // </AuthProvider>
  );
}

export default App;
