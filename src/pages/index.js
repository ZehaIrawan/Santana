import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";
import FetchPage from "./FetchPage";
import { LoginPage } from "./LoginPage";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/dashboard" element={<DashboardPage />} />
      <Route exact path="/fetch" element={<FetchPage />} />
    </Routes>
  );
}

export default App;
