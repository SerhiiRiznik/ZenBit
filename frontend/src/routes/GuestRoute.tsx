import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks/store.hooks";

export function GuestRoute() {
  const token = useAppSelector((state) => state.authorization.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
