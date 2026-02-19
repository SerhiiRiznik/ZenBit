import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/AuthPages/LoginPage/LoginPage";
import { MainPage } from "./pages/MainPage/MainPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { RegisterPage } from "./pages/AuthPages/RegisterPage/RegisterPage";
import { GuestRoute } from "./routes/GuestRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
