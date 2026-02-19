import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/store.hooks";
import { logout } from "../../store/models/auth/auth.thunk";
import "./SiteHeader.css";

interface SiteHeaderProps {
  hideAuthWhenAuthorized?: boolean;
  hideGuestActions?: boolean;
}

export function SiteHeader({
  hideAuthWhenAuthorized: _hideAuthWhenAuthorized = false,
  hideGuestActions = false,
}: SiteHeaderProps) {
  const dispatch = useAppDispatch();
  const { token, status } = useAppSelector((state) => state.authorization);
  const isAuthorized = Boolean(token);

  const handleSignOut = () => {
    dispatch(logout());
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="home-logo">
          My Logo
        </Link>

        {(isAuthorized || !hideGuestActions) && (
          <div className="site-header-actions">
            {isAuthorized ? (
              <button
                type="button"
                className="site-header-action site-header-action-button"
                onClick={handleSignOut}
                disabled={status === "loading"}
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="site-header-action">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="site-header-action site-header-action--primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
