import { useEffect } from "react";
import { SiteHeader } from "../../components/SiteHeader/SiteHeader";
import "./MainPage.css";
import mainBackground from "../../assets/mainBackground.png";
import { fetchDeals } from "../../store/models/deal/deal.thunk";
import { Deal } from "../../store/models/deal/typing/deal.interface";
import { useAppDispatch, useAppSelector } from "../../store/hooks/store.hooks";

const skeletonItems = Array.from({ length: 4 });

const formatAmount = (value: number) =>
  value
    .toLocaleString("en-US", { maximumFractionDigits: 0 })
    .replace(/,/g, " ");

const formatPercent = (value: number) => {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value
    .toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, "");
};

export function MainPage() {
  const { deals, status, offset, hasMore } = useAppSelector(
    (state) => state.deals,
  );
  const dispatch = useAppDispatch();

  const PAGE_SIZE_INITIAL = 4;
  const PAGE_SIZE_LAZY = 2;

  useEffect(() => {
    dispatch(fetchDeals({ limit: PAGE_SIZE_INITIAL, offset: 0 }));
  }, [dispatch]);

  useEffect(() => {
    if (!hasMore) return;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        status === "idle"
      ) {
        dispatch(fetchDeals({ limit: PAGE_SIZE_LAZY, offset }));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset, hasMore, status, dispatch]);

  const scrollToDeals = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const dealsSection = document.getElementById("open-deals");
    dealsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getDaysLeft = (validTo: string) => {
    const validToDate = new Date(validTo).getTime();
    const now = Date.now();
    const diffInMs = validToDate - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffInDays);
  };

  return (
    <main className="home-page">
      <SiteHeader hideAuthWhenAuthorized />

      <section
        className="main-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.74), rgba(15, 23, 42, 0.82)), url(${mainBackground})`,
        }}
      >
        <div className="main-banner-content">
          <h1>The chemical negatively charged</h1>
          <p>
            Numerous calculations predict, and experiments confirm, that the
            force field reflects the beam, while the mass defect is not formed.
            The chemical compound is negatively charged.
          </p>
          <a
            href="#open-deals"
            className="main-banner-cta"
            onClick={scrollToDeals}
          >
            Get Started
          </a>
        </div>
      </section>

      <section id="open-deals" className="open-deals-section">
        <h2>Open Deals</h2>

        {status === "failed" && (
          <p className="error">Cannot load deals from backend.</p>
        )}
        {status === "idle" && deals.length === 0 && (
          <p className="subtitle">No deals yet.</p>
        )}

        <div className="open-deals-grid">
          {deals.length === 0 && status === "loading"
            ? skeletonItems.map((_, index) => (
                <article
                  key={`skeleton-${index}`}
                  className="deal-card deal-card-skeleton"
                  aria-hidden="true"
                >
                  <div className="deal-card-skeleton-overlay">
                    <span className="skeleton-line skeleton-title" />
                    <div className="deal-card-row">
                      <span className="skeleton-line skeleton-metric" />
                      <span className="skeleton-line skeleton-metric" />
                      <span className="skeleton-line skeleton-metric" />
                    </div>
                    <div className="deal-card-row deal-card-row-bottom">
                      <span className="skeleton-line skeleton-metric-wide" />
                      <span className="skeleton-line skeleton-metric" />
                    </div>
                  </div>
                </article>
              ))
            : deals.map((deal: Deal) => (
                <article
                  key={deal.id}
                  className="deal-card"
                  style={{
                    backgroundImage: `url(${deal.imageUrl})`,
                  }}
                >
                  <div className="deal-card-overlay">
                    <h3>{deal.title}</h3>
                    <div className="deal-card-row">
                      <span>
                        {formatAmount(deal.targetAmount)} {deal.currency.symbol}
                      </span>
                      <span>Yield {formatPercent(deal.yieldPercent)}%</span>
                      <span>Sold {formatPercent(deal.soldPercent)}%</span>
                    </div>
                    <div className="deal-card-row">
                      <span>
                        Ticket - {formatAmount(deal.ticketAmount)}{" "}
                        {deal.currency.symbol}
                      </span>
                      <span>Days left {getDaysLeft(deal.validTo)}</span>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </section>
    </main>
  );
}
