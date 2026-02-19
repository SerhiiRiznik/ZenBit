import { Link } from "react-router-dom";
import { SiteHeader } from "../../components/SiteHeader/SiteHeader";
import "./NotFoundPage.css";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <SiteHeader />

      <section className="not-found-content">
        <p className="not-found-code">404</p>
        <h1>Page not found</h1>
        <p>
          The page you are looking for does not exist or has been moved.
          Let&apos;s get you back to the main page.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-btn not-found-btn--solid">
            Back Home
          </Link>
          <Link to="/login" className="not-found-btn">
            Go to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
